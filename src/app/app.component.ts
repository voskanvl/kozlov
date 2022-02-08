import {Component, OnInit} from '@angular/core';
import {MainViewModel} from "./data.model"
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
  debounceTime,
  distinctUntilChanged, firstValueFrom,
  map,
  Observable,
  OperatorFunction, Subject,
} from "rxjs";
import {MockdataService} from "./mockdata.service";
import {MyFunctions, Obj} from "../functions/Functions";
import {tap} from "rxjs/operators";

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
    {eng:'winter',ru:'зима'},
    {eng:'spring', ru:'весна'},
    {eng:'summer',ru:'лето'},
    {eng: 'autumn', ru:'осень'}
  ]

  private LOADING = "Loading..."
  private LOADED = "Data is loaded"


  locationsLoaded = false
  countriesLoaded = false
  regionsLoaded = false

  locationsPlaceholder = this.LOADING
  countriesPlaceholder = this.LOADING
  regionsPlaceholder = this.LOADING

  countryDataLoaded$ = new BehaviorSubject("empty")

  validateLocation(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      if (this.locationsArray.includes(control.value)) return null
      return {mustBeIn: control.value}
    }
  }

  log(d:any){
    console.log(d)
  }

  validateCountry = async (control: AbstractControl): Promise<ValidationErrors | null> => {
    return null
    // return new Promise<ValidationErrors | null>(resolve => {
    //   this.countryDataLoaded$.subscribe(v => {
    //     const includes = this.countriesArray.map(e => e['name']).includes(control.value)
    //     if (includes) {
    //       resolve(null)
    //     } else {
    //       resolve({mustBeIn: control.value})
    //     }
    //   })
    // })
  }

  // validateSeason



  mainViewModel = new MainViewModel();
  myForm = new FormGroup({
    id: new FormControl(this.mainViewModel.Id, Validators.required),
    name: new FormControl(this.mainViewModel.Name, Validators.required),
    date: new FormControl(MyFunctions.objectedDate(new Date(Date.now())), [Validators.required]),
    location: new FormControl(null, [Validators.required, this.validateLocation()]),
    country: new FormControl({value: null, disabled: true}, [Validators.required, ]),
    region: new FormControl({value: null, disabled: true}, [Validators.required]),
    // season: new FormControl(this.mainViewModel.Season, [Validators.required]),
    season: new FormArray(this.seasons.map(e=>new FormControl(false))),
    isArchive: new FormControl("isn'tArchive", [Validators.required]),
  })

  submit() {
  }

  constructor(public data: MockdataService
  ) {
  }

  // changeForm(v
  //              :
  //              any
  // ) {
  //   console.log(v, this.myForm.controls['location'].invalid, this.myForm.controls['country'].disabled)
  //   if ('location' in v) this.data.getCountries(v['location']).subscribe(v => {
  //     this.countriesArray = v;
  //   })
  // }

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
              this.countryDataLoaded$.next("loaded")
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
