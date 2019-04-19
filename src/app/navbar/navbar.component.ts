import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser;
  _isLoggedIn: boolean;

/* Documentation for ViewChild https://angular.io/api/core/ViewChild and ElementRef https://angular.io/api/core/ElementRef */
  @ViewChild('navbarToggler') navbarToggler: ElementRef;//Targets the navbarToggler buttom element in the navbar component view

  constructor(private auth: AuthService, private router: Router) { 
    /* Code below checks whether the user is signed in and toggles _isLoggedIn property. */
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        // console.log(user);
        // this.currentUser = {id: user.uid, name: user.email, email: user.email};

        this.currentUser = this.auth.getCurrentUser(user)
        // console.log(this.currentUser);
        this._isLoggedIn = true;
        console.log(`Currently signed in as ${this.currentUser.email}`);
        return;
      } else {
        this._isLoggedIn = false;
        console.log('not currently signed in!');
      }
    })

  }

  ngOnInit() {
    // console.log(this._isLoggedIn, this.currentUser)
  }

  logOut(e) {
    e.preventDefault();
    console.log("Signing out...")
    this.auth.signOut();
    this._isLoggedIn = false;
    this.router.navigateByUrl('/bill-data-list')
  }

  navBarTogglerIsVisible() {
    return this.navbarToggler.nativeElement.offsetParent !== null;//Checks if the navBarToggler button is visible and returns either true or false
  }

  collapseNav() {
    if (this.navBarTogglerIsVisible()) {
      this.navbarToggler.nativeElement.click();//If the navbarToggler is visisble determined by the method above, it clicks the element to close the tab
    }
  }

}
