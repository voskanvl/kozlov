import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {EMPTY, map, Observable, of} from "rxjs";
import {catchError, retry, tap} from "rxjs/operators";
import {UrlAPI} from "../api/url";

export interface IDataService {
  getLocations(): Observable<Array<string|number>>;

  getCountries(location: string): Observable<Array<object>>;

  getRegions(location: string): Observable<Array<object>>;
}

interface CacheInterface {
  locations: string[],
  countries: { [key: string]: object[] }, //{"Европа":object[],...}
  regions: { [key: string]: object[] },
}

@Injectable({
  providedIn: "root"
})
export class DataService implements IDataService {
  private _cache: CacheInterface = {
    locations: [],
    countries: {},
    regions: {}
  };

  constructor(public httpClient: HttpClient) {
    //get all location
    this.httpClient
      .get(UrlAPI.locations())
      .pipe(
        retry(3),
        catchError(() => EMPTY)
      )
      .subscribe((v) => {
        if (v) {
          this._cache.locations = this.onlyDigitalFields(v as { [key: string]: string }) as string[];
        }
      });
  }

  private onlyDigitalFields(o: { [key: string]: string }): Array<string | object> {
    //{"0":"Европа", "1":"Азия", balans:0} -> ["Европа","Азия"]
    return Object.keys(o)
      .filter((e) => /\d/.test(e))
      .map((e) => o[e]);
  }

  public getLocations() {
    if (this._cache.locations.length) return of(this._cache.locations);
    return this.httpClient.get(UrlAPI.locations()).pipe(
      retry(3),
      map(v => this.onlyDigitalFields(v as { [key: string]: string }) as string[]),
      tap(v => this._cache.locations = v),
      catchError(() => EMPTY)
    )
  }

  public getCountries(location: string) {
    if (this._cache.countries[location])
      return of(this._cache.countries[location]);
    return this.httpClient.get(UrlAPI.countries(location)).pipe(
      retry(3),
      map(v => this.onlyDigitalFields(v as { [key: string]: string }) as object[]),
      tap(v => this._cache.countries[location] = v),
      catchError(() => EMPTY)
    );
  }

  public getRegions(location: string) {
    if (this._cache.regions[location])
      return of(this._cache.regions[location]);
    return this.httpClient.get(UrlAPI.regions(location)).pipe(
      retry(3),
      map(v => this.onlyDigitalFields(v as { [key: string]: string }) as object[]),
      tap(v => this._cache.regions[location] = v),
      catchError(() => EMPTY)
    );
  }
}

// import { Injectable } from '@angular/core';
// import {HttpClient} from "@angular/common/http";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class DataServiceService {
//
//   constructor(private http: HttpClient) { }
//   get(){
//     return this.http.get("https://jsonplaceholder.typicode.com/posts/1");
//   }
// }
