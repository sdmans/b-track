import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Bill } from '../shared/bill';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  testBillData = [
    {
      bill_number: "A1858",
      id: 1057177,
      title: "Continued coverage of prescription drugs",
      description: "Description goes here",
      history: [{action: "Introduced", date: "2018-05-20"}, {action: "Reported", date: "2018-12-03"}],
      upToDate: true
    },
    {
      bill_number: "A3845",
      id: 1112900,
      title: "Prior Authorization",
      description: "Description goes here",
      history: [{action: "Introduced", date: "2018-04-12"}, {action: "Reported", date: "2018-12-03"}],
      upToDate: true
    },
    {
      bill_number: "HB72",
      id: 968893,
      title: "Step therapy",
      description: "Description goes here",
      history: [{action: "Introduced", date: "2018-04-12"}],
      upToDate: true
      }
    ];

  billData;

  private billCollection: AngularFirestoreCollection<Bill>

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore) { 
    this.billCollection = afs.collection<Bill>('bills');//billCollection is now referencing space in the Firestore database.
  }

  /* Retrieves bill data */
  getBillData() {
    // return this.testBillData;
    return this.billCollection;
  }

  getBillSnapshot() {
    this.billData = this.billCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const snapshotData = a.payload.doc.data() as Bill;
        const uniqueId = a.payload.doc.id;
        // console.log({ id, ...data })
        return { uniqueId, ...snapshotData };
      }))
    );
    return this.billData;
  }

  /* Add a bill to the database bill collection */
  addBill(billData: Bill) {
    console.log(billData);
    this.billCollection.add(billData);//Adds bill to Firestore bill collection
  }

  deleteBill(uniqueId) {
    this.afs.collection('bills').doc(`${uniqueId}`).delete();
  }

  checkBills() {
    // console.log(this.billData)
    let billList = this.billData;
    return billList;
  }
  /* Create a function to toggle bill status. Then the update bill button should be available that will use the function below. This should help make the UI work properly */

  changeBillStatus(uniqueId) {
    /* If the bill is false, this should set the bill status to false so it can be updated with the second "Update Bill" button */
    this.afs.collection('bills').doc(`${uniqueId}`).update({ isUpToDate: false });
  }


  updateBill(uniqueId, currentLastAction) {
    console.log('Bill is outdated. Now updating...');
    /* Update bill to currentLastAction which is the current status form the request. Then sets the isUpToDate value to true */
    this.afs.collection('bills').doc(`${uniqueId}`).update({lastAction: currentLastAction});
    this.afs.collection('bills').doc(`${uniqueId}`).update({ isUpToDate: true });
    this.afs.collection('bills').doc(`${uniqueId}`).valueChanges().subscribe((bill: Bill) => {
      if (bill.isUpToDate === true) {
        console.log("Bill is now up-to-date!", bill);
      } else {
        console.log("Bill was not updated, there was an issue", bill);
      }
    });
  }


  /* How to update users in Firebase https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile */
  // getStoredData() {
  //   /* 1/6/19 - Got Firebase Working! */
  //   const dataRef = this.db.list('shopping-list');
  //   return dataRef;
  // }

}

