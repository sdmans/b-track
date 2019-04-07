import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  currentUser;

  constructor(private auth: AuthService,  private router: Router) { }

  ngOnInit() {}

  registerUser(email, pw, e) {
    e.preventDefault();
    const userEmail = email.value;
    const password = pw.value;
    this.auth.createUser(userEmail, password);
    this.router.navigateByUrl('/bill-data-list');
  }

  signIn(user, pw, e) {
    e.preventDefault();
    // console.log(formData);
    const username = user.value;
    const accessPw = pw.value;
    // console.log(username, accessPw);
    this.auth.signIn(username, accessPw);
  }

}
