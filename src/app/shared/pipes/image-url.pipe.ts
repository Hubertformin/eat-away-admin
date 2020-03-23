import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value : 'assets/images/default-user-avatar.png';
  }

}
