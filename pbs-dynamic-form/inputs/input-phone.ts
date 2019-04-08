import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


import { IInputBase, IInputComponentBase, InputBase } from './input-base';
import {PhoneModule} from '../../phone';


@Component({
  template: `
    <div [formGroup]="form">
      <phone
        [formControlName]="input.key"
        [control]="form.controls[input.key]"
        [preferredCountries]="input.preferredCountries"
        [onlyCountries]="input.onlyCountries"
        [errorMap]="input.errorMap"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        [separateDialCode]="input.separateDialCode"
        [label]="input.label"
      ></phone>
    </div>
  `,
})
export class InputPhoneComponent
  extends IInputComponentBase<any> {

  public input: InputPhone;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    PhoneModule,
  ],
  entryComponents: [
    InputPhoneComponent,
  ],
  declarations: [
    InputPhoneComponent,
  ],
})
export class InputPhoneModule {
}

export class InputPhone extends InputBase<string> {
  public component = InputPhoneComponent;
  preferredCountries: string[] | undefined;
  onlyCountries: string[] | undefined;
  errorMap: string[] | undefined;
  separateDialCode: boolean | undefined;

  constructor(
    options: IInputPhone,
  ) {

    super(options);

    this.preferredCountries = options.preferredCountries;
    this.onlyCountries = options.onlyCountries;
    this.errorMap = options.errorMap;
    this.separateDialCode = options.separateDialCode;
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }
}

export interface IInputPhone extends IInputBase<string> {
  preferredCountries?: string[];
  onlyCountries?: string[];
  errorMap?: string[];
  separateDialCode?: boolean;
}
