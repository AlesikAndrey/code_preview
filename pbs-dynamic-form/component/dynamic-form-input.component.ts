import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { InputBase } from '../inputs';

@Component({
  selector: 'dynamic-form-input',
  template: `
    <dynamic-form-input-renderer
      [config]="{input: input, form: form, submitted: submitted, submitStream: submitStream}"
    ></dynamic-form-input-renderer>`,
})
export class DynamicFormInputComponent {
  @Input() public input: InputBase<any>;
  @Input() public form: FormGroup;
  @Input() public submitted: boolean;
  @Input() public submitStream: Observable<any>;

  constructor() {}

}
