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
// currentBills;
/* Array of Subscriptions solution by https://stackoverflow.com/questions/45087291/unsubscribing-an-array-of-subscriptions */
private subscriptions = new Subscription();
databaseBillData: Observable<Bill[]>; 
// testBills = [];
// testArray = [];
currentUser;
_isLoggedIn: boolean;
// billStatus: boolean;


  constructor(private billService: BillDataService, private db: DatabaseService, private auth: AuthService) {
    // this.currentBills = this.billService.getBillData();
    // this.databaseBillData = this.db.getBillData();
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
    
    // this.databaseBillData = this.db.getBillData().valueChanges();
    this.databaseBillData = this.db.getBillSnapshot();
    // this.db.getBillData().valueChanges().subscribe(data => console.log(data));

    // this.testRetrieveBills();
    //Just a test to retrieve data from the database;
    //this.db.getStoredData().valueChanges().subscribe(data => console.log(data))
    // this.auth.createUser('bill', 'bill@bill.com', '12345'); 
    // this.addRetrievedBills();

  }

  checkBillStatus(uniqueId, billStatus) {
    


    if (billStatus === undefined) {
      /* Function sets the bill to false */
      this.db.changeBillStatus(uniqueId);
    } else if (billStatus === false) {
      console.log("This bill is outdated, click the Update Bill button!");
    } else {
      console.log("Looks like the bill is up-to-date!", billStatus);
    }
  }

  updateBill(billId, lastAction, uniqueId) {
    console.log(`Checking status for ${billId}`);
    // console.log(billId, uniqueId);
    // console.log(lastAction)

    this.billService.getBills(billId).subscribe((bill) => {
      let billRef = bill["bill"] 
      // console.log(billRef.bill_number);
      console.table(billRef.history);
      this.billService.compareBill(billId, lastAction, uniqueId);
    });
  }

  /* Function below is supposed to check all bills at once, but it does not currently work properly. This maybe updated later */
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

  deleteBill(uniqueId, number): void {
    console.log(`Deleting bill number: ${number} with uniqueId: ${uniqueId}`);
    this.db.deleteBill(uniqueId);
    console.log('Bill deleted!');
  }

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
