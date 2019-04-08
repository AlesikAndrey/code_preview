import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';

export class IInputComponentBase<T> {
  public input: IInputBase<T>;
  public form: FormGroup; // @TODO
  public submitted; // @TODO
}

export interface IInputBase<T> {
  key: string;
  label: string;
  value?: T;
  cssClass?: any;
  required?: boolean | (() => boolean);
  disabled?: boolean | (() => boolean);
  addNewClick?: () => void;
  hide?: (() => boolean) | boolean;
  order?: number;
  icon?: {
    name: string;
    color?: string;
  };
  flex?: string;
  offset?: string;
  onChange?: (value: any, form: FormGroup) => void;
}

export abstract class InputBase<T> {
  public key: string;
  public label: string;
  public value?: T;
  public required?: boolean | (() => boolean);
  public disabled?: boolean | (() => boolean);
  public cssClass?: any;
  public addNewClick?: () => void;
  public hide?: boolean | (() => boolean);
  public order: number;
  public icon: { name: string; color?: string; } | undefined;
  public flex?: string;
  public offset?: string;
  public form?;
  public errors?: {[errorType: string]: string};
  public onChange?: (value: any, form: FormGroup) => void;

  public abstract disable(form: FormGroup);

  public abstract enable(form: FormGroup);

  constructor(options: IInputBase<T>) {
    this.value = options.value;
    this.key = options.key;
    this.label = options.label;
    this.icon = options.icon;
    this.flex = options.flex || '';
    this.offset = options.offset || '';
    this.hide = options.hide;
    this.required = options.required;
    this.disabled = options.disabled;
    this.addNewClick = options.addNewClick;
    this.cssClass = options.cssClass;
    this.order = options.order === undefined ? 1 : options.order;
    this.onChange = options.onChange;
  }

  public isHidden(): boolean {
    return this.hide instanceof Function ? this.hide() : this.hide || false;
  }

  public setError(error) {
    this.errors = error;
  }

  public getErrorMessage = (errors): string => {
    if (this.errors && this.errors[_.keys(errors)[0]]) {
      return this.errors[_.keys(errors)[0]];
    }
    return 'Unknown error';
  }

}
