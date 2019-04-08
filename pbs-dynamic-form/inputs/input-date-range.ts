import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DateRangeModule } from '../../daterange';
import { IDateRangeOption } from '../../daterange/component/date-range.component';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <div [formGroup]="form">
      <date-range
        [formControlName]="input.key"
        [label]="input.label"
        [options]="input.options"
        [shortView]="input.shortView"
      ></date-range>
    </div>
  `,
})
export class InputDateRangeComponent
  extends IInputComponentBase<any> {

  public input: InputDateRange;
}

@NgModule({
  imports: [
    ReactiveFormsModule,

    DateRangeModule,
  ],
  entryComponents: [
    InputDateRangeComponent,
  ],
  declarations: [
    InputDateRangeComponent,
  ],
})
export class InputDateRangeModule {
}

export interface IInputDateRange extends IInputBase<string> {
  options?: IDateRangeOption[];
  shortView?: boolean;
}

export class InputDateRange extends InputBase<string> {
  public type: string;
  public component = InputDateRangeComponent;

  public options?: IDateRangeOption[];
  public shortView?: boolean;

  constructor(
    options: IInputDateRange,
  ) {
    super(options);
    this.options = options.options;
    this.shortView = options.shortView;
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }

}
