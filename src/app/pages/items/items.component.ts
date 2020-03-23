import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {AddItemComponent} from './add-item/add-item.component';
import {SeoService} from '../../providers/seo.service';
import {DbService} from '../../providers/db.service';
import {ItemModel} from '../../models/data';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  items: ItemModel[] = [];

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private storage: AngularFireStorage,
              public seo: SeoService, private db: DbService) { }

  ngOnInit() {
    this.seo.setAdminTitle('Items');
    // get items
    this.db.getItems()
        .subscribe(items => {
          this.items = items;
        });
  }
  async addItemModal() {
    const modal = await this.modalController.create({
      component: AddItemComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }
  /*edit item*/
  async editItem(index: number) {
    const modal = await this.modalController.create({
      component: AddItemComponent,
      backdropDismiss: false,
      componentProps: {
        editItem: this.items[index]
      }
    });
    return await modal.present();
  }
  /* delete item*/
  async deleteItem(index: number) {
    const item = this.items[index];
    const alert = await this.alertController.create({
      header: 'Delete ' + item.name + '?',
      message: 'This action is not reversible',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            // delete item from db
            this.db.deleteItem(item.id);
            // delete image
            this.storage.storage.refFromURL(item.imageUrl).delete();
          }
        }
      ]
    });

    await alert.present();
  }
}
