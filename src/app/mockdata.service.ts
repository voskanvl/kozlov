import { Injectable } from '@angular/core';
import {IDataService} from "./data-service.service"
import {Observable, of} from "rxjs";
import location from "../api/data.location.json";
import countries from "../api/data.countries.json";
import regions from "../api/data.regions.json";

@Injectable({
  providedIn: 'root'
})
export class MockdataService implements IDataService{

  constructor() { }
  getLocations(): Observable<Array<string|number>> {
    const data:(string|number)[] = Object
        .keys(location)
        .filter(key=>/\d/.test(key))
        .map((e)=>(location as {[key:string]:string|number})[e])
    return of(data)
  }
  getCountries(location: string): Observable<Array<object>> {
    let data = Object.values(countries) as {[key:string]:string|number}[];
    data=data.filter(e=>e['location']===location);
    return of(data)
  }
  getRegions(country: string): Observable<Array<object>> {
    let data = Object.values(regions) as {[key:string]:string|number|null}[];
    console.log(data)
    data=data.filter(e=>e['country']===country);
    return of(data)
  }
}
