import { Component, OnInit } from '@angular/core';
import {SeoService} from '../../providers/seo.service';
import {DbService} from '../../providers/db.service';
import {OrderModel, OrderStats, SaleStatus} from '../../models/data';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orderStats: OrderStats = {totalAmount: 0, totalOrders: 0};
  selectedTab: SaleStatus = 'PENDING';
  currentOrders: OrderModel[] = [];
  selectedOrder: OrderModel;
  authState: {admin: boolean};

  constructor(private seo: SeoService,
              private toastController: ToastController,
              private db: DbService, private alertController: AlertController) { }

  ngOnInit() {
    this.seo.setAdminTitle('Orders');
    // get stats
    this.db.getOrderStats()
        .subscribe(stats => this.orderStats = stats);
    // get orders
    this.db.getOrdersByStatus('PENDING', 15)
        .subscribe(orders => this.currentOrders = orders);
    // get auth state
    this.authState = JSON.parse(sessionStorage.getItem('au'));
  }

  segmentChanged($event) {
    this.selectedOrder = null;
    this.selectedTab = $event.detail.value.toUpperCase();
    this.db.getOrdersByStatus(this.selectedTab, 15)
       .subscribe(orders => this.currentOrders = orders);
  }
  /*select order*/
  selectOrder(index: number) {
    this.selectedOrder = this.currentOrders[index];
  }

  setStatus(status: SaleStatus) {
    this.selectedOrder.status = status;
    this.db.updateOrder(this.selectedOrder)
        .then(() => {
          if (status === 'COMPLETED') {
            this.db.incrementOrderStats(this.selectedOrder.totalAmount)
                .then(() => {
                  this.selectedOrder = null;
                }).catch(err => {
                  this.showToastError('Error, Please try again later', 3500);
            });
          }
        });
  }

  async deleteOrder(id: string) {
    const alert = await this.alertController.create({
      header: 'Delete this order?',
      message: 'This action is not reversible',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Okay',
          handler: () => {
            // delete order from db
            this.db.deleteOrder(id)
                .catch(err => {
                  this.showToastError('Unable to delete this order', 3500);
                });
          }
        }
      ]
    });
    await alert.present();
  }
  /*show notification*/
  /*
  * show toast error
  * */
  private async showToastError(message: string, duration = 2000) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      color: 'danger',
      duration
    });
    await toast.present();
  }
}
