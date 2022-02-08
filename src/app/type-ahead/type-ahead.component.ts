import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject} from "rxjs";
import {AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {MyFunctions} from "../../functions/Functions"
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TypeAheadComponent
    }
  ]
})
export class TypeAheadComponent implements OnInit, ControlValueAccessor {

  @Input() valueArray: Array<any> = []
  @Input() controlId: string = ""
  @Input() label: string = ""
  @Input() autocomplete: string = "off"
  @Input() errorMessage: string = "Wrong input data"
  @Input() control: AbstractControl | null = null
  @Input() dependent: boolean = false
  @Input() placeholder: string = "Loading..."

  @ViewChild('instance', {static: true}) instance: NgbTypeahead|null = null;

  value = ""

  disabled = false

  focused = false
  blurred = false

  onChange = (a: any) => {
  }

  onTouched = () => {
  }

  click$ = new Subject<string>();
  focus$ = new Subject<string>();
  blur$ = new Subject<string>();


  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance!.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => MyFunctions
        .stringArray(this.valueArray, (this.dependent ? 'name' : undefined))
        .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
        .slice(0, 10)),
      tap(v=>console.log('TypeAheadComponent search', v))
    );
  }

  writeValue(obj: any) {
    this.value = obj;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.blur$.subscribe(() => {
      if (!this.blurred) this.onTouched()
      this.blurred = true
    })
  }

}
