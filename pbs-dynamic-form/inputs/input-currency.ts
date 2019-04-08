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
      ></pbs-currency>
    </div>
  `,
})
export class InputCurrencyComponent
  extends IInputComponentBase<any> {

  public input: InputCurrency;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    PbsCurrencyModule,
  ],
  entryComponents: [
    InputCurrencyComponent,
  ],
  declarations: [
    InputCurrencyComponent,
  ],
})
export class InputCurrencyModule {
}

export class InputCurrency extends InputBase<string> {
  public component = InputCurrencyComponent;

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
