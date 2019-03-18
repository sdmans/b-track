import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-data-viewer',
  templateUrl: './current-data-viewer.component.html',
  styleUrls: ['./current-data-viewer.component.css']
})
export class CurrentDataViewerComponent implements OnInit {

  currentBills = [
    {
    title: "hb101",
    description: "A bill about medicine",
    lastAction: "Introduced, referred to house spaghetti committee."
  },
  {
    title: "hb102",
    description: "A bill about medicine",
    lastAction: "Introduced, referred to house linguini committee."
  },
  {
    title: "hb103",
    description: "A bill about medicine",
    lastAction: "Introduced, referred to house rigatoni committee."
  }
]

  constructor() { }

  ngOnInit() {
  }

}
