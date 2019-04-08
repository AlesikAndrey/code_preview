import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';

@Component({
  template: `
    <div fxFlex fxLayout="row">
      <div *ngIf="input.label !== ''" fxLayout="row">
        <div class="input-divider" style="width: 20px"></div>
        <div class="input-divider-label" fxLayout="row" fxLayoutAlign="center center">{{input.label}}</div>
      </div>
      <div fxFlex class="input-divider"></div>
    </div>
  `,
})
export class InputDividerComponent
  extends IInputComponentBase<any> {

  public input: InputDivider;
}

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    InputDividerComponent,
  ],
  declarations: [
    InputDividerComponent,
  ],
})
export class InputDividerModule {
}

export class InputDivider extends InputBase<string> {
  public component = InputDividerComponent;

  constructor(
    options: IInputBase<string>,
  ) {
    super(options);
  }

  public disable(form: FormGroup) {
  }

  public enable(form: FormGroup) {
  }

}
