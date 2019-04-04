import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { Bill } from '../shared/bill';
import { AuthService } from '../services/auth.service';
import { BillDataService } from '../services/bill-data.service';

import { from } from 'rxjs';//To turn testArray into an observable
import { filter } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-current-data-viewer',
  templateUrl: './current-data-viewer.component.html',
  styleUrls: ['./current-data-viewer.component.css']
})
export class CurrentDataViewerComponent implements OnInit {
  currentUser: User;
  displayedBills = [];
  displayedBills$ = [];
  _isLoggedIn: boolean;
  

  currentBills = [
    {
    title: "hb101",
    description: "A bill about medicine",
    lastAction: "Introduced, referred to house spaghetti committee.",
    userId: "L9W7cFwqa2WFx1b984RN53cJmNC3"
  },
  {
    title: "hb102",
    description: "A bill about medicine",
    lastAction: "Introduced, referred to house linguini committee.",
    userId: "L9W7cFwqa2WFx1b984RN53cJmNC3"
  },
  {
    title: "hb103",
    description: "A bill about medicine",
    lastAction: "Introduced, referred to house rigatoni committee.",
    userId: "L9W7cFwqa2WFx1b984RN53cJmNC3"
  }
]

testIdArray = [1057177, 1112900, 968893];

  constructor(private auth: AuthService, private billService: BillDataService) { }

  ngOnInit() {
  //  this.auth.isLoggedIn().then((user) => {
  //   //  console.log(user);
  //    this.currentUser = {name: user.email, email: user.email, userId: user.uid}
  //    console.log(this.currentUser);
  //    this.retrieveTestData();
  //    this._isLoggedIn = true;
  //   }).catch((err) => {
  //     console.log('Not current logged in')
  //     this._isLoggedIn = false;
  //     return;
  //   });

    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.currentUser = this.auth.getCurrentUser(user)
        console.log(this.currentUser);
        this.retrieveTestData();
        this._isLoggedIn = true;
        // console.log(this.displayedBills)
        return;
      } else {
        this._isLoggedIn = false;
        console.log('not currently signed in!');
        return;
      }
    });

    this.retrieveTestDataById();
  }


  retrieveTestData() {
    const testBills = from(this.currentBills);//currentBills as an observable sequence https://www.learnrxjs.io/operators/creation/from.html
  /* rxjs Filter documenation  https://www.learnrxjs.io/operators/filtering/filter.html */

    testBills.pipe(filter((bill) => bill.userId === this.currentUser.id)).subscribe((userBill) => {
      console.log(userBill);
      this.displayedBills.push(userBill);
      console.log(this.displayedBills);
    });
  }

  retrieveTestDataById() {
    this.testIdArray.map((billId) => {
      
      this.billService.getBills(billId).subscribe((bill: Bill) => {
        // console.log(bill);
        const billRef = bill["bill"];
        /* Pushing each of the values from the Bill interface into an array of bills to be displayed */
        this.displayedBills$.push(
          {
            bill_number: billRef.bill_number, 
            id: billRef.bill_id,
            state: billRef.state,
            title: billRef.title,
            description: billRef.description,
            history: billRef.history,
            lastAction: billRef.history[0],
            status: { status: billRef.status, date: billRef.status_date },
            leg_url: billRef.url,
            state_url: billRef.state_link
          });
        /* Request takes bill_number, bill_id, description, and history [] */ 
        
        // console.log(billRef.bill_number);
        // this.displayedBills$.push(bill)
        console.log(this.displayedBills$);
      });
    })
  }
}
