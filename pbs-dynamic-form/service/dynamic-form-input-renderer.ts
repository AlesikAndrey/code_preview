import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';


@Directive({ selector: 'dynamic-form-input-renderer' })
export class DynamicFormInputRendererDirective implements OnChanges, OnDestroy {

  public html: string;

  @Input() public config: any;

  public cmpRef: ComponentRef<any>;

  constructor(
    private vcRef: ViewContainerRef,
    private componentResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {
  }

  public ngOnChanges() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }

    const factory = this.componentResolver.resolveComponentFactory(this.config.input.component);

    this.cmpRef = this.vcRef.createComponent(factory, 0, this.injector, []);
    this.cmpRef.instance.input = this.config.input;
    this.cmpRef.instance.form = this.config.form;
    this.cmpRef.instance.submitted = this.config.submitted;
  }

  public ngOnDestroy() {
    if (this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
