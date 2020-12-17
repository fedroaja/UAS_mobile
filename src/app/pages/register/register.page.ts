import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public iLikeIt = [
    {isChecked: false },
  ];

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'firstname' : [
      { type: 'required', message: 'First Name is required'},
   
    ],
    'lastname' : [
      { type: 'required', message: 'Last Name is required'},
    ],
    'email' : [
      { type: 'required', message: 'Email is required'},
      { type: 'pattern', message: 'Enter a valid email'}
    ],
    'password' : [
      { type: 'required', message: 'Password is required'},
      { type: 'minlength', message: 'Password must be at least 6 characters long'}
    ],
    'confirmpassword' : [
      { type: 'required', message: 'Confirm Password is required'},
      { type: 'minlength', message: 'Password must be at least 6 characters long'}
    ]
  };

  constructor(
    private navCtrl: NavController,
    private authSrv: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });

  }
  // && this.iLikeIt['isChecked'] == true
  tryRegister(value) {
    if(value['confirmpassword'] === value['password'])
    {
      if(this.iLikeIt['isChecked'] == true){
        this.authSrv.registerUser(value)
        .then(res =>{
          console.log(res);
          this.errorMessage = '';
          this.successMessage = "Your account has been created. Please log in";
        }, err => {
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = '';
        });
      }else{
        this.errorMessage = "Please confirm term & condition";
        this.successMessage = '';
      }
    }else {
      this.errorMessage = "Password Doesnt Match";
      this.successMessage = '';
    }

  }



}
