import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'objectUrl'
})
export class ObjectUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any): any {
    if (!value) {
      return 'assets/images/default-user-avatar.png';
    }
    return typeof value === 'object' ? this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(value)) : value;
  }

}
