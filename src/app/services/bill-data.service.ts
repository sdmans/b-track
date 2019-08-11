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

  constructor(private http: HttpClient, private db: DatabaseService) { 
  }

  getBill(billId) {
    console.log(billId)
    let requestUrl = `${this.url}${billId}`;
    let request = this.http.get(requestUrl);//Returns bill data in JSON
    /* Implement error handling after you're finished with http request https://stackoverflow.com/questions/44385777/how-does-http-error-handling-work-with-observables */
    // console.trace('Adding retrieved bills');
    // console.log(request);
    /* For the current view test. Trying to fix the order of data from request since it changes. UPDATE: Will likely only have them appear in a bill detail view and not display the actual data on screen right away. */
    return request;
  }

  compareBill(billObject, billId, uniqueId, lastAction): void {
    /* Store the values to create the request string and pass it into the http request */
    let request = this.getBill(billId);

    request.subscribe((requestedBill) => {
      let billRef = requestedBill['bill'];//Stored to variable for easier reference
      let billLastAction = billRef.history[(billRef.history.length - 1)];// Retrieves bill last action as last item in history array based on length
      // console.log("Requested Bills: ", requestedBill);

      /* Storing requested bill's last action in an object for easier reference */
      let currentLastAction = {
        date: billLastAction.date,
        action: billLastAction.action
      }

      /* Compare lastAction to retrieved bill's current last action stored in an object at position 0 in the history array */
      if (lastAction.action === currentLastAction.action && lastAction.date === currentLastAction.date) {
        /* Changes boolean value to true and logs current status */
        this.db.changeBillStatus(uniqueId, true);
        console.log("Data for the most current action:");
        console.log(currentLastAction);
        console.log('Data Matches, your bill status is up-to-date!');
        billObject.updateStatus = "This bill is currently up-to-date!";
      } else {
        console.log('lastAction is outdated! Here is the current last action');
        console.log(currentLastAction);
        this.db.changeBillStatus(uniqueId, false);//Toggles to bill status to false if the bill action doesn't match
        console.log('To update bill status, please click the update Bill button!');
        /* Provide message in view to show instruct users on what they need to do! */
        billObject.updateStatus = 'Bill may be outdated, click "Update Bill" to update!';// Adds update status to bill
        console.log("Bill status is", billObject.updateStatus);
      }
    });
  }

  updateBill(billObject: Bill, billId, uniqueId) {
    /* This will be a separate function that updates the last Action of the bill and toggles the bill's status to true */
    /* Function takes a bill's Id for the HTTP reqeust and the bill's unique ID on Firebase as arguments passed in from the database-data-viewer-component updateBill method */
    this.getBill(billId).subscribe((requestedBill) => {
      let billRef = requestedBill['bill'];
      let billLastAction = billRef.history[(billRef.history.length - 1)];

      let currentLastAction = {
        date: billLastAction.date,
        action: billLastAction.action
      }
      this.db.updateBillAction(uniqueId, currentLastAction);
      billObject.updateStatus = "Bill Updated Successfully!";
      console.log(billObject);
    })

  }

}