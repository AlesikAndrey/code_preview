import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup } from '@angular/forms';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

export interface IInputButton extends IInputBase<any> {
  class?: string;
  additionalLabel?: string;
  clickHandler: ($event, input: InputButton, form: FormGroup) => void;
}

@Component({
  template: `
    <button
      mat-button
      type="button"
      (click)="input.clickHandler($event, input, form)"
      [disabled]="input.disabled"
    >
      <div fxLayout="row" fxLayoutAlign="center center">
        <mat-icon
          *ngIf="input.icon"
          [style.color]="input.icon.color"
          class="material-icons s16"
        >{{input.icon.name}}</mat-icon>
        <span fxFlex fxLayout="row" fxLayoutAlign="space-between center" class="title">
          <span>{{input.label}}</span>
          <span>{{input.additionalLabel}}</span>
        </span>
      </div>
    </button>
  `,
})
export class InputButtonComponent
  extends IInputComponentBase<any> {

  public input: InputButton;
}

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
  ],
  entryComponents: [
    InputButtonComponent,
  ],
  declarations: [
    InputButtonComponent,
  ],
})
export class InputButtonModule {
}

export class InputButton extends InputBase<any> {
  public component = InputButtonComponent;

  public class?: string;
  public additionalLabel?: string;
  public clickHandler: ($event, input: InputButton, form: FormGroup) => void;

  constructor(options: IInputButton) {
    super(options);
    this.class = options['class'];
    this.additionalLabel = options['additionalLabel'];
    this.clickHandler = options.clickHandler as ($event, input: InputButton, form: FormGroup) => void;
  }

  public disable(form: FormGroup) {
    this.disabled = true;
  }

  public enable(form: FormGroup) {
    this.disabled = false;
  }

}
