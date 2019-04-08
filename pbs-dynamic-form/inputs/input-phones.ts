import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


import { IInputBase, IInputComponentBase, InputBase } from './input-base';

import {PbsPhonesModule} from '../../phones';

@Component({
  template: `
    <div [formGroup]="form">
      <pbs-phones
        [formControlName]="input.key"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        [label]="input.label"
      ></pbs-phones>
    </div>
  `,
})
export class InputMultiplePhonesComponent
  extends IInputComponentBase<any> {

  public input: InputMultiplePhones;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    PbsPhonesModule,
  ],
  entryComponents: [
    InputMultiplePhonesComponent,
  ],
  declarations: [
    InputMultiplePhonesComponent,
  ],
})
export class InputMultiplePhonesModule {
}

export class InputMultiplePhones extends InputBase<string> {
  public component = InputMultiplePhonesComponent;

  constructor(
    options: IInputBase<string>,
  ) {

    super(options);
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }
}
