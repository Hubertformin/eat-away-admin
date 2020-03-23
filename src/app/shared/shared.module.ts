import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import { LocaleCurrencyPipe } from './pipes/locale-currency.pipe';
import {ImageUrlPipe} from './pipes/image-url.pipe';
import {ObjectUrlPipe} from './pipes/object-url.pipe';



@NgModule({
  declarations: [
      LocaleCurrencyPipe,
      ImageUrlPipe,
      ObjectUrlPipe
  ],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
  ],
    exports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        LocaleCurrencyPipe,
        ImageUrlPipe,
        ObjectUrlPipe
    ]
})
export class SharedModule { }
