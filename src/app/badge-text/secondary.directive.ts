import { Directive } from '@angular/core';
import { StylingDirective } from './styling.directive';

@Directive({
  selector: '[opensky-accent]'
})
export class SecondaryDirective  extends StylingDirective{
  backgroundColor = '#ff8c00';
}
