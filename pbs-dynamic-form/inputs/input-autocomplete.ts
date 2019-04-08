import {CommonModule} from '@angular/common';
import {Component, NgModule} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

import {Observable} from 'rxjs/Observable';

import {AutocompleteDataSource} from '../../combobox/autocomplete/autocomplete-list';
import {RemoteData} from '../../remote-data/remote-data';
import {IInputBase, IInputComponentBase, InputBase} from './input-base';

import {AutocompleteModule} from '../../combobox/autocomplete/autocomplete.module';

export interface IInputAutocomplete<T> extends IInputBase<string> {
  dataSource: AutocompleteDataSource<T>;
  getItem: (key: any) => Observable<RemoteData<T>>;
  displayField?: string;
  keyField?: string;
  onAddItem?: () => void;
  getItemHtml?: (T) => any;
  onSelectedItem?: (any, FormGroup) => any;
}

@Component({
  template: `
      <div [formGroup]="form">
          <app-autocomplete
                  formControlName="{{input.key}}"
                  label="{{input.label}}"
                  [dataSource]="input.dataSource"
                  [getItem]="input.getItem"
                  [control]="form.controls[input.key]"
                  [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
                  displayField="{{input.displayField}}"
                  keyField="{{input.keyField}}"
                  [onAddItem]="input.onAddItem"
                  [getItemHtml]="input.getItemHtml"
                  (onSelectedItem)="input.onSelectedItem($event, form)"
          ></app-autocomplete>
      </div>
  `,
})
export class InputAutocompleteComponent
  extends IInputComponentBase<any> {

  public input: InputAutocomplete;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    AutocompleteModule,
  ],
  entryComponents: [
    InputAutocompleteComponent,
  ],
  declarations: [
    InputAutocompleteComponent,
  ],
})
export class InputAutocompleteModule {
}

export class InputAutocomplete extends InputBase<string> {
  public component: any = InputAutocompleteComponent;

  public dataSource: AutocompleteDataSource<any>;
  public getItem: (key: any) => Observable<RemoteData<any>>;
  public displayField: string;
  public keyField: string;
  public onAddItem?: () => void;
  public getItemHtml?: (any) => any;
  public onSelectedItem: (any, FormGroup) => any = () => {};

  constructor(
    options: IInputAutocomplete<any>,
  ) {
    super(options);
    this.dataSource = options.dataSource;
    this.getItem = options.getItem;
    this.displayField = options.displayField || 'name';
    this.keyField = options.keyField || '_href';
    this.onAddItem = options.onAddItem;
    this.getItemHtml = options.getItemHtml;
    if (options.onSelectedItem) {
      this.onSelectedItem = options.onSelectedItem;
    }
  }

  public disable(form: FormGroup) {
    this.disabled = true;
    form.controls[this.key].disable();
    this.value = undefined;
  }

  public enable(form: FormGroup) {
    this.disabled = false;
    form.controls[this.key].enable();
  }
}
