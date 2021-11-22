import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function slideInAnimation(animationTime: number) {
  return trigger('slideIn', [
    transition('closed => opened', [
      style({ transform: 'translateX(100%)' }),
      animate(
        animationTime + 'ms ease-in',
        style({ transform: 'translateX(0%)' })
      ),
    ]),
    transition('opened => closed', [
      style({ transform: 'translateX(0%)' }),
      animate(
        animationTime + 'ms ease-in',
        style({ transform: 'translateX(100%)' })
      ),
    ]),
    state('opened', style({ transform: 'translateX(0%)' })),
    state('closed', style({ transform: 'translateX(100%)' })),
  ]);
}
