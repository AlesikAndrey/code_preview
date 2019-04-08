import { Component, NgModule } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <button
      mat-icon-button
      type="button"
      (click)="input.clickHandler($event, input, form)"
      [disabled]="input.disabled">
      <mat-icon
        [style.color]="input.icon.color"
        class="material-icons s16 mat-24"
      >{{input.icon.name}}</mat-icon>
    </button>
  `,
})
export class InputIconButtonComponent
  extends IInputComponentBase<any> {

  public input: InputIconButton;
}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  entryComponents: [
    InputIconButtonComponent,
  ],
  declarations: [
    InputIconButtonComponent,
  ],
})
export class InputIconButtonModule {
}

export interface IInputIconButton extends IInputBase<any> {
  class?: string;
  clickHandler: ($event, input: InputIconButton, form: FormGroup) => void;
  icon: {
    name: string;
    color?: string;
  };
}

export class InputIconButton extends InputBase<any> {
  public icon: { name: string; color?: string; };

  public component = InputIconButtonComponent;

  public class?: string;
  public clickHandler: ($event, input: InputIconButton, form: FormGroup) => void;

  constructor(options: IInputIconButton) {
    super(options);
    this.class = options.class;
    this.clickHandler = options.clickHandler;
  }

  public disable(form: FormGroup) {
    this.disabled = true;
  }

  public enable(form: FormGroup) {
    this.disabled = false;
  }

}
