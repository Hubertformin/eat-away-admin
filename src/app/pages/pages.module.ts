import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {SharedModule} from '../shared/shared.module';
import {ItemsComponent} from './items/items.component';
import {OrdersComponent} from './orders/orders.component';
import {AddItemComponent} from './items/add-item/add-item.component';


@NgModule({
  declarations: [PagesComponent, ItemsComponent, OrdersComponent, AddItemComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
      SharedModule
  ],
  entryComponents: [AddItemComponent]
})
export class PagesModule { }
