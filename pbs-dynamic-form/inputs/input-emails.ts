import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


import { IInputBase, IInputComponentBase, InputBase } from './input-base';

import {PbsEmailsModule} from '../../emails';

@Component({
  template: `
    <div [formGroup]="form">
      <pbs-emails
        [formControlName]="input.key"
        [control]="form.controls[input.key]"
        [errorMessage]="input.getErrorMessage(form.controls[input.key].errors)"
        [label]="input.label"
      ></pbs-emails>
    </div>
  `,
})
export class InputEmailsComponent
  extends IInputComponentBase<any> {

  public input: InputEmails;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    PbsEmailsModule,
  ],
  entryComponents: [
    InputEmailsComponent,
  ],
  declarations: [
    InputEmailsComponent,
  ],
})
export class InputEmailsModule {
}

export class InputEmails extends InputBase<string> {
  public component = InputEmailsComponent;

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
