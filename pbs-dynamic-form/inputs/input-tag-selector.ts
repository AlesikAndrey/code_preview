import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComboboxModule } from '../../combobox';

import { IInputComponentBase } from './input-base';
import { IInputCombobox, InputCombobox } from './input-combobox';

@Component({
  template: `
    <div [formGroup]="form">
      <tag-selector
        formControlName="{{input.key}}"
        label="{{input.label}}"
        [collection]="input.collection | async"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        displayField="{{input.displayField}}"
        keyField="{{input.itemKey}}"
        [onAddItem]="input.onAddItem"
      ></tag-selector>
    </div>
  `,
})
export class InputTagSelectorComponent
  extends IInputComponentBase<any> {

  public input: InputTagSelector;
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    ComboboxModule,
  ],
  entryComponents: [
    InputTagSelectorComponent,
  ],
  declarations: [
    InputTagSelectorComponent,
  ],
})
export class InputTagSelectorModule {
}

export class InputTagSelector extends InputCombobox {

  public component = InputTagSelectorComponent;

  constructor(
    options: IInputCombobox,
  ) {
    super(options);
  }
}
