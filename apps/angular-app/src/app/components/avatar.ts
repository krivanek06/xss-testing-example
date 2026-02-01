import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [SafeHtmlPipe, NgClass],
  template: `
    @if (isSvg()) {
      <div
        [ngClass]="cssClasses()"
        class="overflow-hidden [&>svg]:w-full [&>svg]:h-full"
        [innerHTML]="src() | safeHtml"></div>
    } @else {
      <img [src]="src() || fallbackUrl" [alt]="alt()" [ngClass]="cssClasses()" class="object-cover" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('Avatar');
  readonly cssClasses = input<string>('w-10 h-10 rounded-full border border-gray-200');
  readonly fallbackUrl = 'https://i.pravatar.cc/150?u=default';

  readonly isSvg = computed(() => {
    const val = this.src();
    if (typeof val !== 'string') {
      return false;
    }

    const trimmed = val.trim().toLowerCase();
    // check <svg> and the XML declaration
    return trimmed.startsWith('<svg') || trimmed.startsWith('<?xml');
  });

  constructor() {
    effect(() => console.log('Avatar src changed:', this.src()));
  }
}
