import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {
  BehaviorSubject,
} from "rxjs";
import {MockdataService} from "./mockdata.service";
import {MyFunctions, Obj} from "../functions/Functions";

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


Часть света, страна и регион берется из апи https://htmlweb.ru/geo/api_get_data.php. Возможно выбрать несколько регионов.
Страна доступна после выбора части света, регион доступен после выбора страны.
В форме должна быть валидация с подсветкой полей и выводом ошибок валидации под каждым полем, все поля обязательные для заполнения.
Использовать сервисы и rxjs.
 */
  locationsArray: Array<string | number> = [];
  countriesArray: Array<Obj> = [];
  regionsArray: Array<Obj> = [];

  seasons = [
    {eng: 'winter', ru: 'зима'},
    {eng: 'spring', ru: 'весна'},
    {eng: 'summer', ru: 'лето'},
    {eng: 'autumn', ru: 'осень'}
  ]

  private LOADING = "Loading..."
  private LOADED = "Data is loaded"


  locationsLoaded = false
  countriesLoaded = false
  regionsLoaded = false

  locationsPlaceholder = this.LOADING
  countriesPlaceholder = this.LOADING
  regionsPlaceholder = this.LOADING


  validateLocation(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      if (this.locationsArray.includes(control.value)) return null
      return {mustBeIn: control.value}
    }
  }

  log(d: any) {
    console.log(d)
  }

  validateCountry = (control: AbstractControl): ValidationErrors | null => {
    const includes = this.countriesArray.map(e => e['name']).includes(control.value);
    return includes ? null : {v: 1}
  }

  myForm = new FormGroup({
    id: new FormControl("", Validators.required),
    name: new FormControl("", Validators.required),
    date: new FormControl(MyFunctions.objectedDate(new Date(Date.now())), [Validators.required]),
    location: new FormControl(null, [Validators.required, this.validateLocation()]),
    country: new FormControl({value: null, disabled: true}, [this.validateCountry]),
    region: new FormControl({value: null, disabled: true}, [Validators.required]),
    season: new FormArray(this.seasons.map(e => new FormControl(false))),
    isArchive: new FormControl("isn'tArchive", [Validators.required]),
  })

  submit() {
    this.myForm.markAllAsTouched()
  }

  constructor(public data: MockdataService) {
  }

  ngOnInit() {
    const dateControl = this.myForm.controls['date']
    const locationControl = this.myForm.controls['location']
    const countryControl = this.myForm.controls['country']
    const regionControl = this.myForm.controls['region']
    const seasonControl = this.myForm.controls['season']
    const isArchiveControl = this.myForm.controls['isArchive']

    this.data.getLocations().subscribe(v => {
      this.locationsArray = v
      if (!this.locationsLoaded) {
        this.locationsPlaceholder = this.LOADED
        this.locationsLoaded = true
      }
    })
    locationControl.valueChanges
      .subscribe(
        v => {
          if (countryControl.disabled && locationControl.valid) countryControl.enable();
          this.data.getCountries(v).subscribe(data => {
            this.countriesArray = data
            if (locationControl.valid) {
              this.countriesLoaded = true
              this.countriesPlaceholder = this.LOADED
            }
          })
        }
      )
    countryControl.valueChanges.subscribe(
      v => {
        if (this.myForm.controls['region'].disabled && this.myForm.controls['country'].valid) this.myForm.controls['region'].enable();
        const id = MyFunctions.getIdByName(this.countriesArray, v)
        return this.data.getRegions(id).subscribe(data => {
          this.regionsArray = data
          if (!this.regionsLoaded && countryControl.valid) {
            regionControl.enable()

          } else {
            regionControl.disable()
          }
        })
      }
    )
    dateControl.valueChanges.subscribe(console.log)
    regionControl.valueChanges.subscribe(console.log)
    seasonControl.valueChanges.subscribe(console.log)
    isArchiveControl.valueChanges.subscribe(console.log)
  }
}
