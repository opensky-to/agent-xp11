import { Directive } from '@angular/core';
import { StylingDirective } from './styling.directive';

@Directive({
  selector: '[opensky-primary]'
})
export class PrimaryDirective extends StylingDirective {
  backgroundColor = '#05826c';
}
