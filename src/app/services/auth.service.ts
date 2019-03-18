import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: DatabaseService, private afdb: AngularFireDatabase, private auth: AuthService) { }

  createUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
    return console.log('Creating user in database:', email, password);
  }

  signIn(email, password) {
    console.log(email, password);
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        console.error(errorMessage);
      }
      console.log(error);
    });
  }//Sign in ends here

  getCurrentUser(user){
    // console.log(user);
    let currentUser;
    currentUser = {id: user.uid, name: user.email, email: user.email};
    // console.log(currentUser);
    return  currentUser;
  }

  signOut() {
    /*Signing user out, need to find a way to monitor the state so the form changes back to the signed out format */
    firebase.auth().signOut();
    console.log('You are now signed out!');
  }

}
