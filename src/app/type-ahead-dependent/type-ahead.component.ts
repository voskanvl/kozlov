import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject} from "rxjs";
import {AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {TypeAheadComponent} from "../type-ahead/type-ahead.component";
import {Obj} from "../../functions/Functions";

@Component({
  selector: 'app-type-ahead-dependent',
  templateUrl: '../type-ahead/type-ahead.component.html',
  styleUrls: ['../type-ahead/type-ahead.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: TypeAheadDependentComponent
    }
  ]
})
export class TypeAheadDependentComponent extends TypeAheadComponent implements OnInit, ControlValueAccessor {

  @Input() override valueArray: Array<Obj> = []


  override search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance!.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => this.valueArray.map(e=>e['name']).filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  }


}
