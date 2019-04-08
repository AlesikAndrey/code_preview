import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PbsCurrencyModule } from '../../currency';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <div [formGroup]="form">
      <pbs-currency
        [formControlName]="input.key"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        [label]="input.label"
        [showCurrencySign]="false"
        [showDecimals]="false"
      ></pbs-currency>
    </div>
  `,
})
export class InputNumberComponent
  extends IInputComponentBase<any> {

  public input: InputNumber;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    PbsCurrencyModule,
  ],
  entryComponents: [
    InputNumberComponent,
  ],
  declarations: [
    InputNumberComponent,
  ],
})
export class InputNumberModule {
}

export class InputNumber extends InputBase<string> {
  public component = InputNumberComponent;

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
