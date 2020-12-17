import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../pages/register/register.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private dbPath = '/users';
  userRef: AngularFireList<User> = null;
  
  constructor(
     private fireAuth: AngularFireAuth,
     private db: AngularFireDatabase,
     private router: Router) { 
    this.userRef = db.list(this.dbPath);
  }




  registerUser(value) {
    return this.fireAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then( res => {
        this.db.object(`/users/${res.user.uid}/info`).set({
            key : res.user.uid,
            first_name : value.firstname,
            last_name : value.lastname,
            email : value.email,
            imageURL : 'https://firebasestorage.googleapis.com/v0/b/uas-ionic-2020.appspot.com/o/images%2Fdefault.jpg?alt=media&token=348cf365-41aa-4a65-adbc-d907fe40cecf'
          })
      }

        )
    
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }


  logoutUser() {
    return new Promise<void>((resolve, reject) => {
      if(this.fireAuth.currentUser) {
        this.fireAuth.signOut()
        .then(() => {
          console.log("log out");
          resolve();
        }).catch((error) => {
          reject();
        })
      }
    })
  }




  userDetails(){
    return this.fireAuth.user;
  }

}
