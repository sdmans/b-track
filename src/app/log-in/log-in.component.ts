import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  signIn(email, pw, e) {
    e.preventDefault();
    const userEmail = email.value;
    const password = pw.value;
    this.auth.signIn(userEmail, password);
    this.router.navigateByUrl('/bill-data-list');
  }

}
