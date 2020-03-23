import { Pipe, PipeTransform } from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({
  name: 'localeCurrency'
})
export class LocaleCurrencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return new CurrencyPipe('en-CM').transform(value, 'XAF', 'symbol');
  }

}
