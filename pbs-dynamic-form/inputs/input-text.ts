import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <mat-form-field [formGroup]="form">
      <input
        matInput
        placeholder="{{input.label}}"
        [formControlName]="input.key"
        [id]="input.key"
        [type]="input.type"
      >
      <mat-error>
        {{input.getErrorMessage(form.controls[input.key].errors)}}
      </mat-error>
    </mat-form-field>
  `,
})
export class InputTextComponent
  extends IInputComponentBase<any> {

  public input: InputText;
}

@NgModule({
  imports: [
    MatInputModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    InputTextComponent,
  ],
  declarations: [
    InputTextComponent,
  ],
})
export class InputTextModule {
}

export interface IInputText extends IInputBase<string> {
  type?: string;
}

export class InputText extends InputBase<string> {
  public type: string;
  public component = InputTextComponent;

  constructor(
    options: IInputText,
  ) {

    super(options);
    this.type = options.type || 'text';
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }
}
