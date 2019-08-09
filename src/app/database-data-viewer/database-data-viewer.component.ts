import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BillDataService } from '../services/bill-data.service';
import { DatabaseService } from '../services/database.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

/* To access firebase methods and check for auth state */
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Bill } from '../shared/bill';

/* Methods from RXJS */
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { forkJoin } from "rxjs";
// import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-database-data-viewer',
  templateUrl: './database-data-viewer.component.html',
  styleUrls: ['./database-data-viewer.component.css']
})
export class DatabaseDataViewerComponent implements OnInit {
/* Array of Subscriptions solution by https://stackoverflow.com/questions/45087291/unsubscribing-an-array-of-subscriptions */
private subscriptions = new Subscription();
databaseBillData: Observable<Bill[]>; 
currentUser;
_isLoggedIn: boolean;


  constructor(private billService: BillDataService, private db: DatabaseService, private auth: AuthService) {
    // this.currentBills = this.billService.getBillData();
    // this.databaseBillData = this.db.getBillData();
/* User management documentation https://firebase.google.com/docs/auth/web/manage-users */
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.currentUser = this.auth.getCurrentUser(user)
        // console.log(this.currentUser);
        this._isLoggedIn = true;
        return;
      } else {
        this._isLoggedIn = false;
        // console.log('not currently signed in!');
        return;
      }
    });
  }

  ngOnInit() {
    this.databaseBillData = this.db.getBillSnapshot();
    /* In order to filter the bills from the observable above, I would need the userId */

  }

  /* See if you can find a way to toggle classes using https://stackoverflow.com/questions/44535515/angular-ngclass-and-click-event-for-toggling-class */

  checkBillStatus(billId, uniqueId, billStatus, lastAction) {
    if (billStatus === undefined) {
      /* Function sets the bill to false */
      this.db.changeBillStatus(uniqueId, false);
    } else if (billStatus === false || billStatus === true) {
      this.billService.compareBill(billId, uniqueId,lastAction);
    } else {
      console.log("This bill is up-to-date!", billStatus);
    }
  }

  updateBill(billId, lastAction, uniqueId, billStatus) {
    console.log(`Checking status for ${billId}`);
    if (billStatus === false ) {
    this.billService.getBill(billId).subscribe((bill) => {
      let billRef = bill["bill"]; 
      console.table(billRef.history);
      this.billService.compareBill(billId, lastAction, uniqueId);
    });
  } else {
    console.log("Bills seems updated, check the bill's status first!");
  }

  }

  deleteBill(uniqueId, number): void {
    console.log(`Deleting bill number: ${number} with uniqueId: ${uniqueId}`);
    this.db.deleteBill(uniqueId);
    console.log('Bill deleted!');
  }

  /* Function below is supposed to check all bills at once, but it does not currently work. This maybe updated later */
  checkBills(userId) {
    console.log('Checking if bills are up-to-date...');
    const billCollection = this.db.getBillData().valueChanges();
    let altBillCollection: Observable<Bill> = this.db.getBillSnapshot();

    /* Create a way to filter so that you have only the current user's bills. RXJS documentation: https://www.learnrxjs.io/operators/filtering/filter.html*/
    
    billCollection.subscribe((bills) => {
      const billList = from(bills);
      const userBills = billList.pipe(filter(bill => bill.userId === this.currentUser.id));
      userBills.subscribe(
        (bill) => {
          /* storing ID and last action for comparison */
          let billId = bill.id;
          let lastAction = bill.lastAction;
          let userId = bill.userId;
          // let uniqueId = bill.uniqueId; //This won't work because the valueChanges doesn't give an id
         
          // this.billService.compareBills(billId, lastAction, userId);
        });
    });
    /* Next, compare this bill to the bill from the http request. */
  }


  /* Find a way to get bills to perform a request for each instead of storing them to a database */

  

 /* This won't work if the array isn't consistent. You should find a way to redo the array so that it will change based on what's recieved
  checkBillData() {
    
  //Take each bill and cycle through the requested bills to find the current status
    for (let i = 0; i < this.databaseBillData.length; i++) {
   
      const selectedBill = this.databaseBillData[i];
 //The function below matches each stored bill to the queried bills and retrieves the updated data from the matching queried bills
        for(let i = 0; i < this.testBills.length; i++) {
          const queriedBill = this.testBills[i].bill
          // console.log(queriedBill);
          if (selectedBill.bill_number === queriedBill.bill_number) {
            // console.log('Found a match for ' + selectedBill.bill_number);
            // console.log('%c Queried Bill','color: teal; font-weight: bold', {queriedBill});
            
             // 3/16/19 Wrap this in an if statement. Make this change only if there's an update that needs to be made. Otherwise see if you can make a notification that tells them the bills are up-to-date.

            selectedBill.history = queriedBill.history;
            selectedBill.description = queriedBill.description;       
          } else {
            // console.log("No match found!");
          }
        }
        */

      /*
      if(this.databaseBillData[i].bill_number === this.currentBills[i]) {
        console.log(`${this.databaseBillData[i].title} is up-to-date!` );
        this.databaseBillData[i].upToDate = true;
      } else {
        console.log("Error")
;       console.log(`${this.databaseBillData[i].title} is out of date!` );
        console.log(`Please change lastAction to ${this.databaseBillData[i].lastAction}!`)
        this.databaseBillData[i].upToDate = false;
      }
      

    }//Closing first For loop
  }

  */

  destroySubscriptions(){
    /* Maybe we can apply the subscription to the Check Data button so that it resubscribes? */
    console.log('Now Unsubscribing');
    this.subscriptions.unsubscribe();
  }
 /*
  addRetrievedBills(){
    for(let i = 0; i < this.databaseBillData.length; i++) {
      const retrievedBillObject = this.databaseBillData[i].id
      // Array of Subscriptions solution by https://stackoverflow.com/questions/45087291/unsubscribing-an-array-of-subscriptions
      this.subscriptions.add(this.billService.getBills(retrievedBillObject).subscribe((data) => {
        // console.log(data["bill"].bill_id);
        // console.log(data);
        this.testBills.push(data);
      }));
    }
    // console.log(this.testBills);
    // console.table(this.databaseBillData);
  }//addRetrievedBills function ends here
*/

  /* Try promise all, it may help you organize the array once the information is emitted https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all */
/*
  testRetrieveBills() {
    for(let i = 0; i < this.databaseBillData.length; i++) {
      const billObject = this.databaseBillData[i].id;
      // this.billService.getBills(billObject).subscribe(data => console.log(data));

      let request = this.billService.getBills(billObject);
      this.testArray.push(request);

      // Data from each bill is stored into the array

     
    }
  }
   */

}
