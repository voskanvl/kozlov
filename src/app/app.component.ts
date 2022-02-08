import {Component, OnInit} from '@angular/core';
import {MainViewModel} from "./data.model"
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
} from "rxjs";
import {MockdataService} from "./mockdata.service";
import {MyFunctions, Obj} from "../functions/Functions";
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component-alt.html',
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
  countriesArray: Array<Obj> = [];
  regionsArray: Array<Obj> = [];


  monitor = new Observable();
  mainViewModel = new MainViewModel();
  myForm = new FormGroup({
    id: new FormControl(this.mainViewModel.Id, Validators.required),
    name: new FormControl(this.mainViewModel.Name, Validators.required),
    date: new FormControl(this.mainViewModel.Date, [Validators.required]),
    location: new FormControl(this.mainViewModel.Location, [Validators.required]),
    country: new FormControl({value:this.mainViewModel.Country, disabled: true}, [Validators.required]),
    region: new FormControl({value: this.mainViewModel.Region, disabled: true}, [Validators.required]),
    season: new FormControl(this.mainViewModel.Season, [Validators.required]),
    isArchive: new FormControl(this.mainViewModel.IsArchive, [Validators.required]),
  })

  submit() {
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.countriesArray.map(e => e['name']).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  searchLocation: OperatorFunction<string, (string | number)[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => this.locationsArray.filter(v => String(v).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  constructor(public data: MockdataService) {
  }

  changeForm(v: any) {
    console.log(v, this.myForm.controls['location'].invalid, this.myForm.controls['country'].disabled)
    if ('location' in v) this.data.getCountries(v['location']).subscribe(v => {
      this.countriesArray = v;
    })
  }

  ngOnInit() {
    this.data.getLocations().subscribe(v => this.locationsArray = v)
    this.myForm.controls['location'].valueChanges.subscribe(
      v => {
        if(this.myForm.controls['country'].disabled && this.myForm.controls['location'].valid )this.myForm.controls['country'].enable();
        console.log(this.myForm.controls['location'])
        return this.data.getCountries(v).subscribe(data => this.countriesArray = data)
      }
    )
    this.myForm.controls['country'].valueChanges.subscribe(
      v => {
        console.log('this.myForm.controls[\'country\'].valueChanges',v)
        if(this.myForm.controls['region'].disabled && this.myForm.controls['country'].valid)this.myForm.controls['region'].enable();
        const id = MyFunctions.getIdByName(this.countriesArray, v)
        return this.data.getRegions(id).subscribe(data => this.regionsArray = data)
      }
    )
  }
}
