import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Many } from 'lodash';

import {InputBase, InputDivider} from '../inputs';

@Injectable()
export class InputControlService {

  public toFormGroup(inputs: Array<Many<InputBase<any>>>, model: any): FormGroup {
    const group: any = {};

    inputs.forEach((input: Many<InputBase<any>>) => {
      if (_.isArray(input)) {
        input.forEach((subInput: InputBase<any>) => {
          group[subInput.key] = this.createControl(subInput, model);
        });
      } else {
        if (!(input instanceof InputDivider)) {
          group[(input as InputBase<any>).key] = this.createControl((input as InputBase<any>), model);
        }
      }
    });
    return new FormGroup(group);
  }

  public addControlsToForm(inputs: Array<Many<InputBase<any>>>, model: any, form: FormGroup) {
    inputs.forEach((input: Many<InputBase<any>>) => {
      if (_.isArray(input)) {
        input.forEach((subInput: InputBase<any>) => {
          this.applyChangesToForm(form, model, subInput);
        });
      } else {
        this.applyChangesToForm(form, model, input);
      }
    });
  }

  private applyChangesToForm(form, model, input) {
    if (form.controls[input.key]) {
      if (model) {
        form.controls[input.key].setValue(model[input.key]);
      }
    } else {
      if (!(input instanceof InputDivider)) {
        form.addControl(input.key, this.createControl(input, model));
      }
    }
  }

  private createControl(input: InputBase<any>, model: any): FormControl {
    const disabled = input.disabled instanceof Function ? input.disabled() : input.disabled;
    const modelValue = model ? model[input.key] : '';
    if (!input.value && modelValue !== '') {
      input.value = modelValue;
    }
    const state = {
      value: input.value,
      disabled: disabled,
    };

    return new FormControl(state);
  }
}
