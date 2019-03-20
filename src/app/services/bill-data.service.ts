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
    // console.log(id)
    let requestUrl = `${this.url}${id}`;
    let request = this.http.get(requestUrl);
    /* Implement error handling after you're finished https://stackoverflow.com/questions/44385777/how-does-http-error-handling-work-with-observables */
  
    // console.trace('Adding retrieved bills');
    // console.log(request);
    /* Trying to fix the order for the request since it changes. UPDATE: Will likely only have them appear in a bill detail view and not display the actual data on screen right away. */
    return request;
  }

  compareBills(billId, lastAction, uniqueId): void {
    let requestUrl = `${this.url}${billId}`;
    let request = this.http.get(requestUrl);

    request.subscribe((requestedBill) => {
      let billLastAction = requestedBill['bill'].history[0];

      console.log("Requested Bills: ", requestedBill)
      /* Storing requested bill's last action to an object for easier reference */
      let currentLastAction = {
        date: billLastAction.date,
        action: billLastAction.action
      }
      // console.log(currentLastAction);

      /* Compare lastAction to retrieved bill's current last action */
      if (lastAction.action === currentLastAction.action && lastAction.date === currentLastAction.date) {
        // console.log(currentLastAction);
        console.log('Data Matches, your bill status is up-to-date!');
        this.db.updateBill(uniqueId, currentLastAction);
      } else {
        console.log('lastAction is outdated');
        /* takes uniqueId argument passed in from the main form the data-viewer method */
        // this.db.updateBill(billId, userId);
      }
    });
  }
}