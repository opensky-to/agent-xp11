import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[opensky-styling]'
})
export class StylingDirective {
  @HostBinding('style.background-color')
  backgroundColor = 'yellow';

  constructor() { }

}
