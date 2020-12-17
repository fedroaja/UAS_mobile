import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../../../pages/register/register.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Userinformation} from '../../../user.interface'
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastController, AlertController, IonItemSliding } from '@ionic/angular';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  feeds: any;
  UID: string = "";
  
  firstname:string;


  private dbPath = '/users';
  userRef: AngularFireList<User> = null;

  constructor(
    private fireAuth: AngularFireAuth,
     private db: AngularFireDatabase,
     private router: Router,
     private toastController: ToastController,
     private alertController: AlertController,
  ) { 
    this.userRef = db.list(this.dbPath)
    
  }

  ngOnInit() {
    this.fireAuth.currentUser.then(res=>{
      this.UID = JSON.stringify(res.uid).replace(/['"]+/g, '');
       this.db.list(`/users/${this.UID}`).valueChanges().subscribe(
        res => {
          this.user = res
        }
      )
    });
  }

  ionViewDidEnter(){
      this.db.list(`/locations/${this.UID}`).valueChanges().subscribe(
        res=>{
          this.feeds = res
        }
      )
  }

  delete(key:string, slidingItems){
    this.db.list(`/locations/${this.UID}`, res => res.orderByValue().equalTo(key)).remove().then(
      res => {
      }
    )
  } 

  logout(){
    if(this.fireAuth.currentUser){
      this.fireAuth.signOut().then(
        res =>{
          this.router.navigateByUrl('/login');
        }
      )
    }
  }

  async confirmDelete(key: string, slidingItems: IonItemSliding) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Teman',
      message: 'Kamu Yakin Ingin Menghapus Feed ini ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: () => this.delete(key, slidingItems)
        }
      ]
    });

    await alert.present();
  }

  async deleteToast() {
    const toast = await this.toastController.create({
      message: 'Feed Berhasil di Hapus.',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async errToast() {
    const toast = await this.toastController.create({
      message: 'Terjadi Kesalahan! Coba Lagi',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

}
