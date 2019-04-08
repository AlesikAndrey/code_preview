import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ComboboxModule } from '../../combobox';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

export interface IInputCombobox extends IInputBase<string> {
  collection: Promise<any[]> | any[] | Observable<any[]>;
  displayField?: string;
  itemKey?: string;
  onAddItem?: () => void;
  progress?: () => boolean | boolean;
  onSelectedItem?: (any, FormGroup) => void;
  listItemTemplate?: (any) => string;
  filterFunc?: (any, filter) => boolean;
}

@Component({
  template: `
    <div [formGroup]="form">
      <combobox
        formControlName="{{input.key}}"
        label="{{input.label}}"
        [collection]="input.collection | async"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        displayField="{{input.displayField}}"
        keyField="{{input.itemKey}}"
        [onAddItem]="input.onAddItem"
        (onSelectedItem)="input.onSelectedItem($event, form)"
        [listItemTemplate]="input.listItemTemplate"
        [filterFunc]="input.filterFunc"
      ></combobox>
    </div>
  `,
})
export class InputComboboxComponent
  extends IInputComponentBase<any> {

  public input: InputCombobox;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ComboboxModule,
  ],
  entryComponents: [
    InputComboboxComponent,
  ],
  declarations: [
    InputComboboxComponent,
  ],
})
export class InputComboboxModule {
}

export class InputCombobox extends InputBase<string> {
  public component: any = InputComboboxComponent;

  public collection: Promise<any[]> | any[] | Observable<any[]>;
  public displayField: string;
  public itemKey: string;
  public onAddItem?: () => void;
  public listItemTemplate?: (any) => string;
  public filterFunc?: (any, filter) => boolean;
  public progress?: () => boolean | boolean;
  public onSelectedItem: (any, FormGroup) => void = () => {};

  constructor(
    options: IInputCombobox,
  ) {
    super(options);
    this.collection = options.collection;
    this.displayField = options.displayField || 'name';
    this.itemKey = options.itemKey || '_href';
    this.onAddItem = options.onAddItem;
    this.listItemTemplate = options.listItemTemplate;
    this.filterFunc = options.filterFunc;
    this.progress = options.progress;
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
