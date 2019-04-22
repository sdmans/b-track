import { Component, OnInit } from '@angular/core';
import { Bill } from '../shared/bill';
import { DatabaseService } from '../services/database.service';
import { BillDataService } from './../services/bill-data.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';
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
    this.billService.getBills(billId)
    .pipe(take(1))//Unsubscribes automatically after the first execution. From https://blog.angularindepth.com/the-best-way-to-unsubscribe-rxjs-observable-in-the-angular-applications-d8f9aa42f6a0
      .subscribe((bill) => {
      let billRef = bill["bill"];
      
      //Use this to check the bill data in the reponse 
      // console.log(billRef);

/* Sets properties for the billObject of type Bill, based on the requested bill's information. The properties below are from the exported bill.ts file. */
      this.billObject = {
        bill_number: billRef.bill_number,
        id: billRef.bill_id,
        state: billRef.state,
        title: billRef.title,
        description: billRef.description,
        history: billRef.history,
        lastAction: billRef.history[(billRef.history.length-1)],
        state_link: billRef.state_link,
        leg_url: billRef.url
      }
      console.log(this.billObject);

    });
  }

  /* Adds bill with additional data to user's collection */
  addBill(type, e) {
    e.preventDefault();
    // console.log(type);
    const billType = type.value;//retrieves the value from the input template variable
    console.log("Bill type is: " + billType);
    
    this.billObject.category = billType;
    this.billObject.isUpToDate = true;
    this.billObject.userId = this.currentUser.id;//Update with billType and User's id for display purposes.

    this.db.addBill(this.billObject);//Addbill method takes the billObject produced by the request from the findBill method above, then 
    //this.billObject = undefined;//Reset the billObject after the query is finished.
    this.router.navigateByUrl('/bill-data-list');

  }
}
