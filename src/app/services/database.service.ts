import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Bill } from '../shared/bill';
import { User } from '../shared/user';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';


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
  private userCollection: AngularFirestoreCollection<User>

  constructor(private db: AngularFireDatabase, private afs: AngularFirestore) { 
    this.billCollection = afs.collection<Bill>('bills');//billCollection is now referencing space in the Firestore database.
    this.userCollection = afs.collection<User>('users');//userCollection is now referencing space in the Firestore database.
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
        const edit = false; //Added to return a default boolean that determines whether a bill section is in edit mode.
        // console.log({ id, ...data })
        return { uniqueId, edit, ...snapshotData };
      }))
    );
    return this.billData;
  }

  /* Add a bill to the database bill collection */
  addBill(billData: Bill) {
    console.log(billData);
    this.billCollection.add(billData);//Adds bill to Firestore bill collection
    
    const billObject = { id: billData.id, category: billData.category }//billObject contains the bill ID to use in a query and the bill's selected category. Push bill object into user's billCollection
    /* Working with arrays on Firebase as of 2018 https://stackoverflow.com/questions/46757614/how-to-update-an-array-of-objects-with-firestore */
    
    let userRef = this.afs.collection('users').doc(`${billData.userId}`);//Reference to the user based on the logged in user's ID.
    console.log(billObject);
    console.log(billData.userId);
    console.log(userRef);
    userRef.update({
      billCollection: firebase.firestore.FieldValue.arrayUnion(billData.id)//Attempting to use just the ID to see if it's easier to remove than an object.
    });
    
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

  changeBillStatus(uniqueId, boolean) {
    /* If the bill is false, this should set the bill status to false so it can be updated with the second "Update Bill" button */
    this.afs.collection('bills').doc(`${uniqueId}`).update({ isUpToDate: boolean });
  }

  editBillAction(uniqueId, updatedAction) {
    this.afs.collection('bills').doc(`${uniqueId}`).update({lastAction: updatedAction});
  }

  updateBillAction(uniqueId, currentLastAction) {
    console.log('Bill is outdated. Now updating...');
    /* Update bill to currentLastAction which is the current status form the request. Then sets the isUpToDate value to true */
    this.afs.collection('bills').doc(`${uniqueId}`).update({lastAction: currentLastAction});
    this.afs.collection('bills').doc(`${uniqueId}`).update({ isUpToDate: true });
    console.log("Bill was updated successfully!");

    // this.afs.collection('bills').doc(`${uniqueId}`).valueChanges().subscribe((bill: Bill) => {
    //   if (bill.isUpToDate === true) {
    //     console.log("Bill is now up-to-date!", bill);
    //   } else {
    //     console.log("Bill was not updated, there was an issue", bill);
    //   }
    // });
  }

  /* Logic for creating and updating users goes below here */
  createUserData(userEmail, userId, creationDate) {
    console.log(userEmail, userId, creationDate);
    const newUser: User = {email: userEmail, id: userId, dateCreated: creationDate, billCollection: []}
    this.userCollection.doc(`${userId}`).set(newUser);
  }

  getUserData(userId) {
    return this.userCollection.doc(`${userId}`).valueChanges();
  }

  removeBillFromCollection(billId, userId) {
    let userRef = this.afs.collection('users').doc(`${userId}`);//Reference to the user based on the logged in user's ID.

    /* it may be easier to create bill objects and add user references to them. Then add the IDs by themselves to this collection so we can remove that since specifying objects seems to be more complicated */

    /* The update below removes the selected billId from the user's collection */
    userRef.update({
      billCollection: firebase.firestore.FieldValue.arrayRemove(billId)
    });
  }

  /* How to update users in Firebase https://firebase.google.com/docs/auth/web/manage-users#update_a_users_profile */
  // getStoredData() {
  //   /* 1/6/19 - Got Firebase Working! */
  //   const dataRef = this.db.list('shopping-list');
  //   return dataRef;
  // }

}

