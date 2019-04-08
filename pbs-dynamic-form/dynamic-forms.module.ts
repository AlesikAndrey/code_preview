import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DynamicFormInputComponent } from './component/dynamic-form-input.component';
import { DynamicFormComponent } from './component/dynamic-form.component';
import { PbsDynamicFormComponent } from './component/pbs-dynamic-form.component';
import {
  InputAutocompleteModule,
  InputButtonModule,
  InputCheckboxModule,
  InputColorpickerModule,
  InputComboboxModule,
  InputCurrencyModule,
  InputDatepickerModule,
  InputDateRangeModule,
  InputDividerModule, InputEmailsModule,
  InputHierarchicalComboboxModule,
  InputIconButtonModule,
  InputMultiplePhonesModule,
  InputNumberModule,
  InputPhoneModule,
  InputSelectModule,
  InputTagSelectorModule,
  InputTextareaModule,
  InputDurationModule,
  InputTextModule, InputTimepickerModule,
} from './inputs';
import { DynamicFormInputRendererDirective } from './service/dynamic-form-input-renderer';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,

    InputAutocompleteModule,
    InputButtonModule,
    InputCheckboxModule,
    InputComboboxModule,
    InputCurrencyModule,
    InputDatepickerModule,
    InputDateRangeModule,
    InputHierarchicalComboboxModule,
    InputIconButtonModule,
    InputSelectModule,
    InputTagSelectorModule,
    InputTextareaModule,
    InputTextModule,
    InputColorpickerModule,
    InputMultiplePhonesModule,
    InputNumberModule,
    InputDividerModule,
    InputTimepickerModule,
    InputEmailsModule,
    InputPhoneModule,
    InputDurationModule,
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormInputComponent,
    DynamicFormInputRendererDirective,
    PbsDynamicFormComponent,
  ],
  entryComponents: [
    DynamicFormComponent,
    DynamicFormInputComponent,
    PbsDynamicFormComponent,
  ],
  exports: [
    DynamicFormComponent,
    DynamicFormInputComponent,
    PbsDynamicFormComponent,
  ],
})
export class DynamicFormsModule {
}
