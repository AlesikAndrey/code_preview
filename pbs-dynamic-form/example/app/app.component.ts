import {Component, ViewEncapsulation} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import { ITreeItem } from '../../../combobox';
import { AccountHierarchyGeneratorService } from '../../../combobox/hierarchy-generator.service';
import { RemoteError } from '../../../remote-data';

import { DynamicFormSchema } from '../../';
import {
  InputButton,
  InputCheckbox,
  InputCombobox,
  InputCurrency,
  InputDatepicker,
  InputDateRange, InputDivider, InputEmails,
  InputHierarchicalCombobox,
  InputIconButton, InputPhone, InputMultiplePhones,
  InputSelect,
  InputTagSelector,
  InputText,
  InputTextarea, InputTimepicker,
} from '../../inputs';
import {InputColorpicker} from '../../inputs/input-colorpicker';
import {InputAutocomplete} from "../../inputs/input-autocomplete";
import {Observable} from "rxjs";
import {Loading} from "../../../remote-data/remote-data";
import {InputNumber} from "../../inputs/input-number";
import {InputDuration} from '../../inputs/input-duration';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AccountHierarchyGeneratorService],
})
export class AppComponent {
  public form = new FormGroup({});

  public data$ = new Subject();

  public schema = new DynamicFormSchema([
    [
      new InputText({
        key: 'text',
        label: 'Enter text',
        required: true,
      }),
      new InputCurrency({
        key: 'currency',
        label: 'Currency',
        required: true,
      }),
      new InputNumber({
        key: 'number',
        label: 'Number',
        required: true,
      })
    ],
    [
      new InputDivider({
        key: '',
        label: 'Test label'
      })
    ],
    [
      new InputMultiplePhones({
        key: 'phones',
        label: 'Phones',
        required: true,
      }),
      new InputEmails({
        key: 'emails',
        label: 'Emails',
        required: true,
      }),
      new InputDatepicker({
        key: 'date',
        label: 'Enter date',
        required: true,
      }),
      new InputDateRange
      ({
        key: 'daterange',
        label: 'Daterange',
      }),
    ],
    [
      new InputDivider({
        key: '',
        label: ''
      })
    ],
    [
      new InputSelect({
        key: 'select',
        label: 'Select value',
        options: [
          {
            key: 'test1',
            value: 'test1',
          },
          {
            key: 'test2',
            value: 'test2',
          },
        ],
      }),
      new InputCombobox({
        key: 'combobox',
        label: 'Select value',
        itemKey: 'id',
        displayField: 'lastName',
        onAddItem: () => console.log('add callback'),
        collection: this.http.get('/assets/example3.json').map((response: Response) => response.json()),
        onSelectedItem: (item, form) => {
          console.log('combobox: on selected item');
          console.log(item);
          console.log(form);
        },
        listItemTemplate: (item) => {
          return `
            <div class="title">${item.lastName}</div>
            <div class="subtitle">${item.nationality}</div>
          `;
        },
        filterFunc: (item, filter) => {
          return (item.lastName.toLowerCase() + item.nationality.toLowerCase()).indexOf(filter.toLowerCase()) >= 0;
        }
      }),
      new InputHierarchicalCombobox({
        key: 'hierarchycalCombobox',
        label: 'Select value',
        displayField: 'name',
        isItemSelectable: (item: ITreeItem<any>) => item.type !== 'accountType',
        onAddItem: () => console.log('add callback'),
        collection: this.accountHierarchyGeneratorService.getExample1$(),
      }),
    ],
    [
      new InputButton({
        key: 'button',
        label: 'Disable datepicker',
        icon: {
          name: 'label',
          color: 'rgb(255, 152, 0)',
        },
        clickHandler: ($event, input, model) => {
          this.schema.getByKey('date').disable(this.form);
          console.log(model);
        },
      }),
      new InputIconButton({
        key: 'iconButton',
        label: 'Enable datepicker',
        icon: {
          name: 'undo',
          color: 'rgb(255, 152, 0)',
        },
        clickHandler: ($event, input, model) => {
          this.schema.getByKey('date').enable(this.form);
          console.log(model);
        },
      }),
      new InputCheckbox({
        key: 'checkbox',
        label: 'Hide date',
        onChange: (value, form: FormGroup) => {
          if (value) {
            this.schema.getByKey('date').hide = true;
          } else {
            this.schema.getByKey('date').hide = false;
          }
        },
      }),
      new InputCheckbox({
        key: 'checkbox2',
        label: 'Disable checkbox',
        onChange: (value, form: FormGroup) => {
          if (value) {
            this.schema.getByKey('checkbox').disable(form);
          } else {
            this.schema.getByKey('checkbox').enable(form);
          }
        },
      }),
      new InputTimepicker({
        key: 'time',
        label: 'Choose time',
      })
    ],
    [
      new InputTextarea({
        key: 'textarea',
        label: 'Textarea',
        height: '250px'
      }),
    ],
    [
      new InputColorpicker({
        key: 'colorpicker',
        label: 'Colorpicker',
      }),
      new InputTagSelector({
        key: 'tagSelector',
        label: 'Tag Selector',
        itemKey: 'id',
        displayField: 'lastName',
        onAddItem: () => console.log('add callback'),
        collection: this.http.get('/assets/example3.json').map((response: Response) => response.json()),
      }),
      new InputAutocomplete({
        key: 'autocomplete',
        label: 'autocomplete',
        keyField: 'id',
        displayField: 'lastName',
        onAddItem: () => console.log('add callback'),
        dataSource: (value: string, page: number): any => {
          console.log('autocomplete: dataSource. Page: ' + page + '. value: ' + value);
          return this.http
            .get('/assets/example3.json')
            .map((response: Response) => response.json())
            .map(list => list.filter(i => i.lastName.toLowerCase().indexOf(value.toLowerCase()) >= 0))
            .map(list => list.slice(page * 10, page * 10 + 10))
            .delay(1000)
            .startWith(new Loading())
          ;
        },
        getItem: (key: any): any => {
          console.log('autocomplete: get item. key: ' + key);
          return this.http
            .get('/assets/example3.json')
            .map((response: Response) => response.json())
            .map(list => list.find(i => i.id === key))
            .delay(1000)
            .startWith(new Loading())
          ;
        },
        getItemHtml: (item) =>  item.lastName + '<span style="float: right">custom text</span>',
        onSelectedItem: (item, form) => {
          console.log('autocomplete: on selected item');
          console.log(item);
          console.log(form);
        }
      }),
      new InputPhone({
        key: 'phone',
        label: 'Phone',
        required: true,
        separateDialCode: true,
      }),
      new InputDuration({
        key: 'duration',
        label: 'Duration',
        withoutSeconds: true,
      }),

    ],
  ]);

  public formModel: any = {
    text: 'Simpson',
    combobox: 8,
    hierarchycalCombobox: '99404b79-bf83-4819-9ff8-a28bfe9d3bda',
    textarea: 'some',
  };

  private data = {};

  private valid = false;

  constructor(
    private http: Http,
    private accountHierarchyGeneratorService: AccountHierarchyGeneratorService,
  ) {
  }

  public setModel() {
    this.formModel = {
      text: 'New value',
      date: '2018-05-06',
      select: 'test1',
      emails: [
        {
          "type": "Рабочий",
          "email": "work@gmail.com"
        },
        {
          "email": "home@bk.ru",
        }
      ],
      combobox: 7,
      hierarchycalCombobox: 'fc41bb67-0510-4231-aa25-397262f98f7d',
      daterange: {from: '2017-09-20', to: '2017-11-16'},
      autocomplete: 3,
      number: '123.32',
      time: '14:26',
      phone: '+12015558976',
      duration: '11:30'
    };
  }

  public setBackendErrorsToAll() {
    this.data$.next(new RemoteError({
      status: 422,
      error: {
        violations: [
          {
            field: 'select',
            message: 'can\'t be null',
          },
          {
            field: 'hierarchycalCombobox',
            message: 'can\'t be null',
          },
          {
            field: 'combobox',
            message: 'can\'t be null',
          },
          {
            field: 'combobox2',
            message: 'can\'t be null',
          },
          {
            field: 'combobox3',
            message: 'can\'t be null',
          },
          {
            field: 'combobox4',
            message: 'can\'t be null',
          },
          {
            field: 'text',
            message: 'can\'t be null',
          },
          {
            field: 'currency',
            message: 'can\'t be null',
          },
          {
            field: 'date',
            message: 'can\'t be null',
          },
          {
            field: 'textarea',
            message: 'can\'t be null',
          },
          {
            field: 'autocomplete',
            message: 'can\'t be null',
          },
          {
            field: 'phone',
            message: 'can\'t be null',
          },
        ]
      }
    }));
  }

  public setBackendErrors() {
    this.data$.next(new RemoteError({
      status: 422,
      error: {
        violations: [
          {
            field: 'select',
            message: 'can\'t be null',
          },
          {
            field: 'combobox',
            message: 'can\'t be null',
          },
          {
            field: 'currency',
            message: 'can\'t be null',
          },
          {
            field: 'date',
            message: 'can\'t be null',
          },
          {
            field: 'autocomplete',
            message: 'can\'t be null',
          },
        ]
      }
    }));
  }


  public setVoidModel() {
    console.log(this.form.controls['text']);
    this.formModel = {text: 'New value'};
  }

  public setComboValue() {
    this.formModel = { ...this.formModel, combobox: 9 };
  }

  private onFormChange = (changes) => {
    setTimeout(() => this.data = changes, 0);
  };

  private onFormSubmit = (model) => {
    console.log(model);
  };
}
