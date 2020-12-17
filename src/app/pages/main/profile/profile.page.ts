import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../../../pages/register/register.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Userinformation} from '../../../user.interface'
import { Observable } from 'rxjs';



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
  ) { 
    this.userRef = db.list(this.dbPath)
    
  }

  ngOnInit() {
    this.fireAuth.currentUser.then(res=>{
      this.UID = JSON.stringify(res.uid).replace(/['"]+/g, '');
       this.db.list(`/users/${this.UID}`).valueChanges().subscribe(
        res => {
          this.user = res
          console.log(res)
        }
      )
    });
  }

  ionViewDidEnter(){
      this.db.list(`/locations/${this.UID}`).valueChanges().subscribe(
        res=>{
          this.feeds = res
          console.log(res)
        }
      )
  }

}
