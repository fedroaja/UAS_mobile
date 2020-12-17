import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { AlertController, ToastController,IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  UID: string;
  user: any;

  userSearch: any;

  isItemAvailable = false;

  constructor(
    private fireAuth: AngularFireAuth,
     private db: AngularFireDatabase,
     private router: Router,
      private toastController: ToastController,
      private alertController: AlertController,
  ) { }
  ngOnInit() {
    
    this.fireAuth.currentUser.then(res=>{
      this.UID = JSON.stringify(res.uid).replace(/['"]+/g, '');
       this.db.list(`/friendlist/${this.UID}`).valueChanges().subscribe(
        res => {
          this.user = res
   
        }
      )
    });
  }
  ionViewWillEnter() {

    this.fireAuth.currentUser.then(res=>{
      this.UID = JSON.stringify(res.uid).replace(/['"]+/g, '');
       this.db.list(`/friendlist/${this.UID}`).valueChanges().subscribe(
        res => {
          this.user = res
         
        }
      )
    });

  }

  delete(key:string, slidingItems){
    this.db.list(`/friendlist/${this.UID}/${key}`).remove()
      .then(res => {
        slidingItems.close();
        this.deleteToast()
        this.ionViewWillEnter();

      }).catch(res=>{
        this.errToast()
      });
    
    
  }

  getItems(ev: any) {

    this.userSearch = this.user

    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
        this.isItemAvailable = true;
        this.userSearch = this.userSearch.filter((userSearch) => {
            return (userSearch.first_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    } else {
        this.isItemAvailable = false;
    }
}

  async confirmDelete(key: string, slidingItems: IonItemSliding) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Teman',
      message: 'Kamu Yakin Ingin Menghapus Teman ini ?',
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
      message: 'Teman Berhasil di Hapus.',
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
