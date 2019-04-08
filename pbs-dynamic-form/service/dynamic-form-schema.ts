import * as _ from 'lodash';
import { Many } from 'lodash';

import { InputBase } from '../inputs';

export class DynamicFormSchema {
  public fields: Array<Many<InputBase<any>>>;

  constructor(fields: Array<Many<InputBase<any>>>) {
    this.fields = fields;
  }

  public getByKey(key: string): InputBase<any> {
    return _.find(_.flattenDeep(this.fields), (input: InputBase<any>) => input.key === key) as InputBase<any>;

  }
}
