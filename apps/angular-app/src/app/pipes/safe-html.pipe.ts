// pipes/safe-html.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    // 🚨 DANGER: Trusts any HTML, including <script> tags and event handlers
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
