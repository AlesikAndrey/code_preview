import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatInputModule } from '@angular/material';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <div [formGroup]="form">
      <mat-checkbox
        [id]="input.key"
        [formControlName]="input.key"
        [(ngModel)]="input.value">
        {{input.label}}
      </mat-checkbox>
      <mat-error
        *ngIf="!form.controls[input.key].valid && !form.controls[input.key].pristine && submitted">
        <small class="error-small-text">
          {{input.label}} is required.
        </small>
      </mat-error>
    </div>
  `,
})
export class InputCheckboxComponent
  extends IInputComponentBase<any> {
}

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    InputCheckboxComponent,
  ],
  declarations: [
    InputCheckboxComponent,
  ],
})
export class InputCheckboxModule {
}

export class InputCheckbox extends InputBase<boolean> {
  public component = InputCheckboxComponent;

  constructor(options: IInputBase<boolean>) {
    super(options);
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }
}
