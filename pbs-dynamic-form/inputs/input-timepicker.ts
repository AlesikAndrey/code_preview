import {Component, ElementRef, NgModule, OnInit, ViewChild} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';
import { Angular5TimePickerModule } from 'angular5-time-picker';
import {MatInputModule} from '@angular/material';

@Component({
  template: `
{{input.label}}
    <mat-form-field [formGroup]="form">
      <input #input matInput [matTimepicker]="picker" placeholder="{{label}}">
      <mat-timepicker-toggle matSuffix [for]="picker" (userTimeChange)="submit()"></mat-timepicker-toggle>
      <mat-timepicker #picker color="primary" [userTime]="config"></mat-timepicker>
    </mat-form-field>
  `,
})
export class InputTimepickerComponent
  extends IInputComponentBase<any> implements OnInit {

  @ViewChild('input')
  public inputEl: ElementRef;

  public input: InputTimepicker;
  public config = {format: 24, hour: 0, minute: 0};
  public label;


  ngOnInit(): void {
    this.setValue(this.form.value[this.input.key]);
    this.label = this.input.label;
    this.form.valueChanges.subscribe(value => {
      this.setValue(value[this.input.key]);
    });
  }

  public submit() {
    setTimeout(() => this.form.controls[this.input.key].patchValue(this.inputEl.nativeElement.value.trim()), 300);
  }

  private setValue(value: string) {
    if (value) {
      const time = value.split(':');
      this.config = {format: 24, hour: parseFloat(time[0]), minute: parseFloat(time[1])};
    } else {
      this.config = {format: 24, hour: 0, minute: 0};
    }
  }
}

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatInputModule,

    Angular5TimePickerModule,
  ],
  entryComponents: [
    InputTimepickerComponent,
  ],
  declarations: [
    InputTimepickerComponent,
  ],
})
export class InputTimepickerModule {
}

export interface IInputTimepicker extends IInputBase<string> {
  config?: IInputTimepickerConfig;
}

export interface IInputTimepickerConfig extends IInputBase<string> {
  hour?: string;
  minute?: string;
}

export class InputTimepicker extends InputBase<string> {
  public type: string;
  public component = InputTimepickerComponent;

  config?: IInputTimepickerConfig;

  constructor(
    options: IInputTimepicker,
  ) {
    super(options);
    this.config = options.config;
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }

}
