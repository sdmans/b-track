import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user';
import { AuthService } from '../services/auth.service';
import { from } from 'rxjs';//To turn testArray into an observable
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-current-data-viewer',
  templateUrl: './current-data-viewer.component.html',
  styleUrls: ['./current-data-viewer.component.css']
})
export class CurrentDataViewerComponent implements OnInit {
  currentUser: User;
  displayedBills = [];

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

  constructor(private auth: AuthService) { }

  ngOnInit() {
   this.auth.isLoggedIn().then((user) => {
    //  console.log(user);
     this.currentUser = {name: user.email, email: user.email, userId: user.uid}
     console.log(this.currentUser);
     this.retrieveTestData();
    });
    
  }

  retrieveTestData() {
    const testBills = from(this.currentBills);//currentBills as an observable sequence https://www.learnrxjs.io/operators/creation/from.html
  /* rxjs Filter documenation  https://www.learnrxjs.io/operators/filtering/filter.html */

  testBills.pipe(filter((bill) => bill.userId === this.currentUser.userId)).subscribe((userBill) => {
    // console.log(userBill);
    this.displayedBills.push(userBill);
    console.log(this.displayedBills);
  });
  }

}
