import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';


declare var google:any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  map: any;
  isCheckin: boolean = false;
  
  currLat: string;
  currLng: string;

  myLat: string;
  myLng: string;

  inputPlace: string = "";

  infoWindow: any = new google.maps.InfoWindow();


  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;


  UID: string;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    private fireAuth: AngularFireAuth,
    public toastController: ToastController
    ) { 
      fireAuth.currentUser.then(res => {
        this.UID = JSON.stringify(res.uid).replace(/['"]+/g, '');
      })
    }

  ngOnInit() {
    

    setInterval(()=>this.autoUpdate(), 1000 * 60 * 10 );
   
  }

  ionViewDidEnter(){
    
    this.showMap();
    

  }

  autoUpdate(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position : Position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(pos);
        console.log(this.inputPlace)
        this.currLat = position.coords.latitude.toString();
        this.currLng = position.coords.longitude.toString();
        
        this.db.list(`/locations/${this.UID}`).push({
          'lat' : this.currLat,
          'lng' : this.currLng,
          'title' : "Auto update",
          'waktu' : new Date().toLocaleString()
        }).then(res=>{
          this.showMap()
        })

      })
    }
    
  }




  showMap() {
    this.db.list(`/locations/${this.UID}`,res=>res.orderByKey().limitToLast(1)).valueChanges().subscribe(res=> {
      this.myLat = res[0]['lat']
      this.myLng = res[0]['lng']

      const location = new google.maps.LatLng(Number(this.myLat), Number(this.myLng));
      const options = {
        center: location,
        zoom: 11,
        disableDefaultUI: true
      };
  
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  
      var MarkCurr = {
        lat: Number(this.myLat),
        lng: Number(this.myLng)
      }
  
      //marker
      const marker = new google.maps.Marker({
        position: MarkCurr,
        map: this.map,
        
      })

      this.db.list(`/friendlist/${this.UID}`).valueChanges().subscribe(res=>{
        for (let i = 0; i < res.length; i++) {
          this.db.list(`/locations/${res[i]['key']}`,res=>res.orderByKey().limitToLast(1)).valueChanges().subscribe(res=>{
  
            const myLat = res[0]['lat']
            const myLng = res[0]['lng']
            var MarkCurr = {
              lat: Number(myLat),
              lng: Number(myLng)
            }
        
            //marker
            const marker = new google.maps.Marker({
              position: MarkCurr,
              map: this.map,
              icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            })
  
          })
          
        }
      })

    })
   
  }

  showCurrentLoc(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position : Position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(pos);
        console.log(this.inputPlace)
        this.currLat = position.coords.latitude.toString();
        this.currLng = position.coords.longitude.toString();
        
        this.db.list(`/locations/${this.UID}`).push({
          'lat' : this.currLat,
          'lng' : this.currLng,
          'title' : this.inputPlace,
          'waktu' : new Date().toLocaleString()
        }).then(res=>{
          this.showMap()
        })

      })
    }
  }

  centerMap() 
  {
    this.map.setCenter(new google.maps.LatLng(Number(this.myLat), Number(this.myLng)));
  }

  changeBtn(){
    this.isCheckin = true
  }
  closeBtn(){
    this.isCheckin = false
  }

}