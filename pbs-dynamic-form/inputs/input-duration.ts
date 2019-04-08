import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PbsCurrencyModule } from '../../currency';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';
import {PbsDurationModule} from '../../duration';
import {DatepickerDefaultValues} from './input-datepicker';

@Component({
  template: `
    <div [formGroup]="form">
      <pbs-duration
        [formControlName]="input.key"
        [label]="input.label"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        [withoutSeconds]="input.withoutSeconds"
      ></pbs-duration>
    </div>
  `,
})
export class InputDurationComponent
  extends IInputComponentBase<any> {

  public input: InputDuration;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    PbsDurationModule,
  ],
  entryComponents: [
    InputDurationComponent,
  ],
  declarations: [
    InputDurationComponent,
  ],
})
export class InputDurationModule {
}

export class InputDuration extends InputBase<string> {
  public component = InputDurationComponent;

  public withoutSeconds?: boolean;

  constructor(
    options: IInputDuration,
  ) {
    super(options);
    this.withoutSeconds = options.withoutSeconds;
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }
}

export interface IInputDuration extends IInputBase<string> {
  withoutSeconds?: boolean;
}
