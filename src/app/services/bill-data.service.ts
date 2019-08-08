import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { legiscanApi } from '../private/access';
import { Bill } from '../shared/bill';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class BillDataService {
  private url: string = legiscanApi.queryUrl;
  private billData;


  // private url: string = "https://api.legiscan.com/?key=fe2e633ae61e25228c946ef9cad0ec7b&op=getBill&id=";
  constructor(private http: HttpClient, private db: DatabaseService) { 
  }

  getBills(id) {
    console.log(id)
    let requestUrl = `${this.url}${id}`;
    let request = this.http.get(requestUrl);
    /* Implement error handling after you're finished https://stackoverflow.com/questions/44385777/how-does-http-error-handling-work-with-observables */
  
    // console.trace('Adding retrieved bills');
    // console.log(request);
    /* Trying to fix the order for the request since it changes. UPDATE: Will likely only have them appear in a bill detail view and not display the actual data on screen right away. */
    return request;
  }

  compareBill(billId, lastAction, uniqueId, billStatus): void {
    /* Store the values to create the request string and pass it into the http request */
    let requestUrl = `${this.url}${billId}`;
    let request = this.http.get(requestUrl);

    request.subscribe((requestedBill) => {
      let billLastAction = requestedBill['bill'].history[0];
      // console.log("Requested Bills: ", requestedBill);

      /* Storing requested bill's last action in an object for easier reference */
      let currentLastAction = {
        date: billLastAction.date,
        action: billLastAction.action
      }

      /* Compare lastAction to retrieved bill's current last action stored in an object at position 0 in the history array */
      if (lastAction.action === currentLastAction.action && lastAction.date === currentLastAction.date) {
        /* Does nothing and logs status since the bill is upToDate */
        // this.db.updateBill(uniqueId, currentLastAction);
        console.log(`Status is ${billStatus}`);
        console.log('Data Matches, your bill status is up-to-date!');
      } else {
        console.log('lastAction is outdated');
        this.db.changeBillStatus(uniqueId);//Toggles to bill status to false if the above condition isn't met
        console.log("Listed last action is: \n", lastAction.action, lastAction.date )
        console.log("Current last action is: \n", currentLastAction.action, currentLastAction.date )
        /* Function takes uniqueId argument passed in from the database-data-viewer-component updateBill method */
        /* It then sets the bill upToDate property to false */

        /* Note for today: Need to update the status in Firebase so the update bill function works */
        
        // this.db.updateBill(uniqueId, currentLastAction);
        // this.db.updateBill(billId, userId);
      }
    });
  }

}