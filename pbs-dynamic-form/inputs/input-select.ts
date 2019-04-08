import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule } from '@angular/material';
import * as _ from 'lodash';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { IInputBase, IInputComponentBase, InputBase } from './input-base';

@Component({
  template: `
    <mat-form-field [formGroup]="form" class="pbs-dynamic-form-select">
      <mat-select
        [placeholder]="input.label"
        [formControlName]="input.key"
      >
        <mat-option *ngFor="let option of input.options | async" [value]="option.key">
          {{ option.value }}
        </mat-option>
      </mat-select>
      <mat-error>{{input.getErrorMessage(form.controls[input.key].errors)}}</mat-error>
    </mat-form-field>
  `,
})
export class InputSelectComponent
  extends IInputComponentBase<any> {

  public input: InputSelect;
}

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    InputSelectComponent,
  ],
  declarations: [
    InputSelectComponent,
  ],
})
export class InputSelectModule {
}

export interface IInputSelect extends IInputBase<string> {
  multiple?: boolean;
  selectAll?: boolean;
  options: Observable<Array<{ key: string | number, value: string }>> | Array<{ key: string | number, value: string }>;
}

export class InputSelect extends InputBase<string> {
  public component = InputSelectComponent;

  public multiple?: boolean;
  public selectAll?: boolean;
  public options: Observable<Array<{ key: string | number, value: string }>>;

  private globalOption = { key: 'all', value: 'All' };
  private lastModel: string[];
  private currentModel: string[];

  constructor(
    options: IInputSelect,
  ) {

    super(options);

    this.multiple = options.multiple || false;
    this.selectAll = options.selectAll || false;
    const optionsKey = 'options';
    this.options = _.isArray(options[optionsKey])
      ? Observable.of(options[optionsKey])
      : Observable.from(options[optionsKey] as any) as any;

    this.options.map((data) => {
      if (this.multiple && this.selectAll) {
        data.unshift(this.globalOption);
      }
      return data;
    });
  }

  public click(model: string[]) {
    this.currentModel = model;

    const changes = this.getChanges();
    this.lastModel = _.clone(model);

    if (this.isGlobalClicked(changes)) {
      this.deselectAllItems();
      this.selectGlobal();
    } else {
      if (this.isGlobalSelected()) {
        this.deselectGlobal();
      }
      if (!model.length) {
        this.selectGlobal();
      }
    }
  }

  private getChanges(): string {
    return _.head(_.difference(this.currentModel, this.lastModel)) as string;
  }

  private deselectAllItems(): void {
    this.currentModel.length = 0;
  }

  private selectGlobal(): void {
    if (!this.isGlobalSelected()) {
      this.currentModel.push(this.globalOption.key);
    }
  }

  private deselectGlobal(): void {
    this.currentModel.shift();
  }

  private isGlobalSelected(): boolean {
    return _.includes(this.currentModel, this.globalOption.key);
  }

  private isGlobalClicked(changes: string): boolean {
    return changes === this.globalOption.key;
  }

  public disable(form: FormGroup) {
    form.controls[this.key].disable();
  }

  public enable(form: FormGroup) {
    form.controls[this.key].enable();
  }

}
