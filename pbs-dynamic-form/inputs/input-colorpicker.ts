import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';
import {ColorPickerModule} from 'ngx-color-picker';

@Component({
  template: `
    <mat-form-field [formGroup]="form" class="color-picker-form">
      <input
        matInput
        placeholder="{{input.label}}"
        [formControlName]="input.key"
        [id]="input.key"
        [(colorPicker)]="color"
        [(ngModel)]="color"
        />
      <mat-error>
        {{input.getErrorMessage(form.controls[input.key].errors)}}
      </mat-error>
    </mat-form-field>
  `,
})
export class InputColorpickerComponent
  extends IInputComponentBase<any> {

  public color;

  public input: InputColorpicker;
}

@NgModule({
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ],
  entryComponents: [
    InputColorpickerComponent,
  ],
  declarations: [
    InputColorpickerComponent,
  ],
})
export class InputColorpickerModule {
}

export interface IInputColorpicker extends IInputBase<string> {
  type?: string;
}

export class InputColorpicker extends InputBase<string> {
  public type: string;
  public component = InputColorpickerComponent;

  constructor(
    options: IInputColorpicker,
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
