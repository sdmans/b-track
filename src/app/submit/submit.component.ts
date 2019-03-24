import { Component, OnInit } from '@angular/core';
import { Bill } from '../shared/bill';
import { DatabaseService } from '../services/database.service';
import { BillDataService } from './../services/bill-data.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})

export class SubmitComponent implements OnInit {
  billIdNumber;
  currentUser;
  _isLoggedIn: boolean;
  // name = 'roger';

  billObject: Bill;//This will contain select information about the bill that the user has searched form the legiscan query.
  constructor(private billService: BillDataService, private db: DatabaseService,  private auth: AuthService, private router: Router) { 
  /* Code below checks whether the user is signed in and toggles _isLoggedIn property. */
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.currentUser = this.auth.getCurrentUser(user);
        // console.log(this.currentUser);
        this._isLoggedIn = true;
        return;
      } else {
        this._isLoggedIn = false;
        // console.log('not currently signed in!');
      }
    })
  }

  ngOnInit() {
  }

  findBill(id): void {
    let billId = id.value;
    this.billIdNumber = id.value;//retrieves the value form the template variable
    this.billService.getBills(billId).subscribe((bill) => {
      let billRef = bill["bill"];
      
      console.log(billRef.bill_number)

      this.billObject = {
        bill_number: billRef.bill_number,
        id: billRef.bill_id,
        state: billRef.state,
        title: billRef.title,
        description: billRef.description,
        history: billRef.history,
        lastAction: billRef.history[0]
      }
      console.log(this.billObject.lastAction);
    });
  }

  addBill(type, e) {
    e.preventDefault();
    // console.log(type);
    const billType = type.value;//retrieves the value form the template variable
    console.log("Bill type is: " + billType);
    
    this.billObject.category = billType;
    this.billObject.isUpToDate = true;
    this.billObject.userId = this.currentUser.id;//Update with billType and User's id for display purposes.

    this.db.addBill(this.billObject);
    //this.billObject = undefined;//Reset the billObject after the query is finished.
    this.router.navigateByUrl('/bill-data-list');

  }
}
