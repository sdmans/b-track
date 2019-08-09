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

  getBill(id) {
    console.log(id)
    let requestUrl = `${this.url}${id}`;
    let request = this.http.get(requestUrl);//Returns bill data in JSON
    /* Implement error handling after you're finished https://stackoverflow.com/questions/44385777/how-does-http-error-handling-work-with-observables */
  
    // console.trace('Adding retrieved bills');
    // console.log(request);
    /* Trying to fix the order for the request since it changes. UPDATE: Will likely only have them appear in a bill detail view and not display the actual data on screen right away. */
    return request;
  }

  compareBill(billId, uniqueId, lastAction): void {
    /* Store the values to create the request string and pass it into the http request */
    let request = this.getBill(billId);

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
        /* Changes boolean value to true and logs current status */
        this.db.changeBillStatus(uniqueId, true);
        console.log('Data Matches, your bill status is up-to-date!');
        console.log(currentLastAction);
      } else {
        console.log('lastAction is outdated! Here is the current last action');
        console.log(currentLastAction);
        this.db.changeBillStatus(uniqueId, false);//Toggles to bill status to false if the bill action doesn't match
        console.log('To update bill status, please click the update Bill button!');
        /* Note for today: Need to update the status in Firebase so the update bill function works */
      }
    });
  }

  updateBill(billId, uniqueid) {
    /* This will be a separate function that updates the status of the bill */
    /* Function takes uniqueId argument passed in from the database-data-viewer-component updateBill method */
   /* It then sets the bill upToDate property to false */


  }

}