import {Component, OnInit} from '@angular/core';
import {MainViewModel} from "./data.model"
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {concatMap, map, mergeMap, Observable, of, switchMap, tap} from "rxjs";
import {MockdataService} from "./mockdata.service";
import {MyFunctions} from "../functions/Functions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  /*
Параметры объекта:
Id - идентификатор
Name - название
Date - дата (датапикер)
Location - часть света (автокомплит)
Country - страна (автокомплит)
Region - регион (автокомплит)
Season - сезон (чекбокс со значениями зима, весна, лето, осень, можно выбрать один или несколько сезонов)
IsArchive - признак архивности (переключатель в архиве, не в архиве)
 */
  locationsArray: Array<string | number> = [];
  countriesArray: Array<{ [key: string]: any }> = [];
  regionsArray: Array<string | number> = [];

  isCountryDisabled = true;
  monitor = new Observable();
  mainViewModel = new MainViewModel();
  myForm = new FormGroup({
    id: new FormControl(this.mainViewModel.Id, Validators.required),
    name: new FormControl(this.mainViewModel.Name, Validators.required),
    date: new FormControl(this.mainViewModel.Date, [Validators.required]),
    location: new FormControl(this.mainViewModel.Location, [Validators.required]),
    country: new FormControl(this.mainViewModel.Country, [Validators.required]),
    region: new FormControl(this.mainViewModel.Region, [Validators.required]),
    season: new FormControl(this.mainViewModel.Season, [Validators.required]),
    isArchive: new FormControl(this.mainViewModel.IsArchive, [Validators.required]),
  })

  submit() {
  }

  constructor(public data: MockdataService) {
  }

  changeForm(v: any) {
    console.log(v, this.myForm.controls['location'].invalid, this.myForm.controls['country'].disabled)
  }



  ngOnInit() {
    let previousValue = {}
    const changedForm$ = this.myForm.valueChanges.pipe(map(v => {
      const delta = MyFunctions.compareObjects(previousValue, v);
      previousValue = v;
      return delta;
    }))
    changedForm$.subscribe(this.changeForm.bind(this))
    // this.monitor = this.data.getLocations();
    this.data.getLocations().subscribe(v => this.locationsArray = v)
    // this.data.getCountries().subscribe(v=>this.countriesArray=v)
  }
}
