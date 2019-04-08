import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { InputBase } from '../inputs';
import { DynamicFormSchema } from '../service/dynamic-form-schema';
import { InputControlService } from '../service/input-control.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'dynamic-form',
  template: `
    <div *ngFor="let field of schema.fields" class="form-row">
      <div
        *ngIf="field.length"
        fxLayout="row"
        fxLayout.lt-sm="column"
        fxLayout.lt-md="column"
        fxLayoutAlign="space-between center"
        fxLayoutAlign.lt-sm=""
        fxLayoutAlign.lt-md=""
        fxLayoutGap="10px"
        class="dynamic-form-row"
      >
        <div
          *ngFor="let subField of getNotHidden(field)"
          fxFlexOffset="{{ subField.offset }}"
          fxFlex="{{ subField.flex }}"
          fxFlex.lt-sm="flex"
          fxFlex.lt-md="flex"
        >
          <dynamic-form-input
            [input]="subField"
            [form]="form"
            [submitted]="submitted"
          ></dynamic-form-input>
        </div>
      </div>
      <div
        *ngIf="!field.length && !field.isHidden()"
        fxFlexOffset="{{ field.offset }}"
      >
        <dynamic-form-input
          [input]="field"
          [form]="form"
          [submitted]="submitted"
        ></dynamic-form-input>
      </div>
    </div>
`,
  providers: [InputControlService],
})
export class DynamicFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public schema: DynamicFormSchema;
  @Input() public model: any;
  @Output() public onChange: EventEmitter<FormChanges> = new EventEmitter();
  @Output() public onSubmit: EventEmitter<any> = new EventEmitter();
  @Input('form') public outerForm;

  protected form: FormGroup;
  private changesSubscription: Subscription;
  private submitSubscription: Subscription;
  public submitted = false;
  private innerModel;

  constructor(private ics: InputControlService) {
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes): void {
    if (changes.model) {
      this.innerModel = changes.model.currentValue;
    }
    if (changes.schema || changes.model) {
      if (this.changesSubscription) {
        this.changesSubscription.unsubscribe();
      }
      this.initForm();
    }
  }

  public ngOnDestroy(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    if (this.submitSubscription) {
      this.submitSubscription.unsubscribe();
    }
  }

  public getNotHidden(fields: InputBase<any>[]) {
    return _.filter(fields, (input) => !input.isHidden());
  }

  private initForm() {
    if (this.outerForm instanceof FormGroup) {
      this.ics.addControlsToForm(this.schema.fields, this.model, this.outerForm);
      this.form = this.outerForm;
    } else {
      this.form = this.ics.toFormGroup(this.schema.fields, this.model);
    }

    _.forEach(_.flattenDeep(this.schema.fields), (input: InputBase<any>) => {
      if (input.onChange) {
        this.form.controls[input.key].valueChanges.subscribe((changes) => {
          if (input.onChange && !_.isUndefined(changes)) {

            input.onChange(changes, this.form);
          }
        });
      }
    });

    this.changesSubscription = this.form.valueChanges.subscribe((changes) => {
      if (!deepEqual(this.innerModel || {}, changes)) {
        this.innerModel = changes;
        this.onChange.emit({
          changes: changes,
          form: this.form,
        });
      }
    });
  }
}

export interface FormChanges {
  changes: any;
  form: FormGroup;
}

// todo find another way to skip undefined field in form
const deepEqual = (first, second): boolean =>
  _.isEqual(JSON.parse(JSON.stringify(first)), JSON.parse(JSON.stringify(second)))
  ;
