import {Component, OnInit} from '@angular/core';
import {DataService} from "./data-service.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  title = 'kozlov';
  dataValue = new Observable;
  constructor(private data: DataService) {
  }
  ngOnInit() {
    this.dataValue = this.data.getLocations();
  }
}
