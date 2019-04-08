import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DatepickerModule } from '../../datepicker';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <div [formGroup]="form">
      <datepicker
        [formControlName]="input.key"
        [label]="input.label"
        [defaultValue]="input.defaultValue"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        [minDate]="input.min"
        [maxDate]="input.max"
      ></datepicker>
    </div>
  `,
})
export class InputDatepickerComponent
  extends IInputComponentBase<any> {

  public input: InputDatepicker;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    DatepickerModule,
  ],
  entryComponents: [
    InputDatepickerComponent,
  ],
  declarations: [
    InputDatepickerComponent,
  ],
})
export class InputDatepickerModule {
}

export interface IInputDatepicker extends IInputBase<string> {
  // @deprecated
  defaultValue?: DatepickerDefaultValues | string;
  min?: string;
  max?: string;
  enableReset?: boolean;
}

export class InputDatepicker extends InputBase<string> {
  public type: string;
  public component = InputDatepickerComponent;

  public defaultValue?: DatepickerDefaultValues | string;
  public max?: string;
  public min?: string;
  public enableReset?: boolean;

  constructor(
    options: IInputDatepicker,
  ) {
    super(options);
    this.defaultValue = options.defaultValue;
    this.max = options.max;
    this.min = options.min;
    this.enableReset = options.enableReset;
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }

}

export type DatepickerDefaultValues = 'today' | 'tomorrow' | 'yesterday' | 'monthAgo';
