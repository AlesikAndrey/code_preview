import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { HierarchicalComboboxModule, ITreeItem, Tree } from '../../combobox';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <div [formGroup]="form">
      <hierarchical-combobox
        label="{{input.label}}"
        formControlName="{{input.key}}"
        [collection]="input.collection | async"
        [isItemSelectable]="input.isItemSelectable"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        displayField="{{input.displayField}}"
        keyField="{{input.itemKey}}"
        [onAddItem]="input.onAddItem"
      ></hierarchical-combobox>
    </div>
  `,
})
export class InputHierarchicalComboboxComponent
  extends IInputComponentBase<any> {

  public input: InputHierarchicalCombobox;
}

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,

    HierarchicalComboboxModule,
  ],
  entryComponents: [
    InputHierarchicalComboboxComponent,
  ],
  declarations: [
    InputHierarchicalComboboxComponent,
  ],
})
export class InputHierarchicalComboboxModule {
}

export interface IInputHierarchicalCombobox extends IInputBase<string> {
  collection: Promise<Tree<any>> | Tree<any> | Observable<Tree<any>>;
  displayField?: string;
  itemKey?: string;
  onAddItem?: () => void;
  isItemSelectable?: (item: ITreeItem<any>) => boolean | boolean;
}

export class InputHierarchicalCombobox extends InputBase<string> {
  public component = InputHierarchicalComboboxComponent;

  public collection: Promise<Tree<any>> | Tree<any> | Observable<Tree<any>>;
  public displayField: string;
  public itemKey: string;
  public onAddItem?: () => void;
  public isItemSelectable?: (item: ITreeItem<any>) => boolean | boolean;
  private _comboValue;

  get comboValue() {
    return this._comboValue ? this._comboValue : this.value;
  }

  set comboValue(value) {
    this._comboValue = value;
    this.value = this._comboValue;
  }

  constructor(
    options: IInputHierarchicalCombobox,
  ) {
    super(options);
    this.collection = options.collection;
    this.displayField = options.displayField || 'name';
    this.itemKey = options.itemKey || 'id';
    this.onAddItem = options.onAddItem;
    this.isItemSelectable = options.isItemSelectable;
  }

  public disable(form: FormGroup) {
    this.disabled = true;
  }

  public enable(form: FormGroup) {
    this.disabled = false;
  }

}
