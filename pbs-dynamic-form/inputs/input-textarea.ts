import {Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { IInputComponentBase } from './input-base';

import {IInputText, InputText} from './input-text';

@Component({
  template: `
    <mat-form-field [formGroup]="form">
       <textarea
               matInput
               #textareaInput
               [formControlName]="input.key"
               [id]="input.key"
               placeholder="{{input.label}}"></textarea>
        <mat-error class="required">{{input.label}} is required.</mat-error>
    </mat-form-field>
  `,
})
export class InputTextareaComponent
  extends IInputComponentBase<any>
  implements OnInit{

  @ViewChild('textareaInput')
  public textArea: ElementRef;

  public input: InputTextarea;

  public ngOnInit() {
    this.textArea.nativeElement.style.height = this.input.height;
  }
}

@NgModule({
  imports: [
    MatInputModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    InputTextareaComponent,
  ],
  declarations: [
    InputTextareaComponent,
  ],
})
export class InputTextareaModule {
}

export interface IInputTextarea extends IInputText {
  height?: string;
}

export class InputTextarea extends InputText {
  public type: string;
  public component = InputTextareaComponent;

  public height: string;

  constructor(
    options: IInputTextarea,
  ) {
    super(options);
    this.height = options.height ? options.height : '200px';
  }
}

