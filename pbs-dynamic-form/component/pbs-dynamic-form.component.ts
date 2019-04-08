import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import {isError, isLoading, isNotAsked, isValidLoaded, RemoteData} from '../../remote-data';
import { DynamicFormSchema } from '../service/dynamic-form-schema';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'pbs-dynamic-form',
  template: `
      <dynamic-form
          [schema]="schema"
          [model]="model"
          [form]="form"
      ></dynamic-form>
    `,
})
export class PbsDynamicFormComponent<T> implements OnChanges {

  @Input()
  public data: RemoteData<T>;

  @Input()
  public schema: DynamicFormSchema;

  @Input()
  public form: FormGroup;

  @Input()
  public model: Partial<T> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      const value = changes.data.currentValue;
      if (isError(value)) {
        dynamicFormErrorHandler(this.schema, this.form, value.errorMessage);
      } else if (isLoading(value) || isNotAsked(value)) {
      } else if (isValidLoaded(value)) {
        this.model = value;
      } else {
        throw new Error('Unexpected RemoteData');
      }
    }
  }
}


export const dynamicFormErrorHandler =
  (schema: DynamicFormSchema, form: FormGroup, err: any) => {
      if (err.status === 422) {
        const formErrors = err.error.violations;

        formErrors.forEach((error) => {
          const fieldName = error.field;
          const control: AbstractControl = form.controls[fieldName];
          const input = schema.getByKey(fieldName);
          input.setError({incorrect: error.message});
          control.setErrors({incorrect: true});
          control.markAsTouched();
        })

      }
      return [];
    }
