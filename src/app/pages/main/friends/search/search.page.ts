import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';
import { refCount } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  user: any;
  userSearch: any;
  showHide: boolean = false;

  UID: string;

  constructor(
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
    public toastController: ToastController
  ) { }

  ngOnInit() {

  }


  search(event){
    this.fireAuth.currentUser.then(res=>{
      this.UID = JSON.stringify(res.uid).replace(/['"]+/g, '');
       this.db.list(`/users/${this.UID}`).valueChanges().subscribe(
        res => {
          if(res[0]['email'] == event.target.value){
            this.showHide = false;
          }else{
            this.showHide = true;
          }
        }
      )
    });
    this.db.list('/users', ref=> ref.orderByChild('info/email').equalTo(event.target.value)).valueChanges().subscribe(res => {
      this.userSearch = res
     
    })
  }


  

  addfriend(key: string, firstname: string, lastname:string, imgurl:string){
    this.db.object(`/friendlist/${this.UID}/${key}`).set({
      'key':key,
      'first_name': firstname,
      'last_name': lastname,
      'imageURL': imgurl
    }).then(
      res =>{
        this.successToast()
      }
    ).catch(
      err =>{
        this.errToast()
      }
    )
    
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: 'Teman berhasil ditambahkan',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async errToast() {
    const toast = await this.toastController.create({
      message: 'Terjadi Kesalahan! Coba lagi',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }


  

}
