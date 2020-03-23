import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {CategoryModel, DevicesModel, ItemModel, OrderModel, OrderStats, SaleStatus, UserModel} from '../models/data';
import {map} from 'rxjs/operators';
import * as firebase from 'firebase/app';
const increment = firebase.firestore.FieldValue.increment(1);

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private usersCollection: AngularFirestoreCollection<UserModel>;
  private itemsCollection: AngularFirestoreCollection<ItemModel>;
  private categoryCollection: AngularFirestoreCollection<CategoryModel>;
  private ordersCollection: AngularFirestoreCollection<OrderModel>;
  private devicesCollection: AngularFirestoreCollection<DevicesModel>;
  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection('users');
    this.itemsCollection = afs.collection('items');
    this.categoryCollection = afs.collection('categories');
    this.ordersCollection = afs.collection('orders');
    this.devicesCollection = afs.collection('devices');
  }
  /*
  * Get ref
  * */
  get ref() {
    return this.afs;
  }
  /*
  * Get categories
  * */
  getCategories() {
      return this.categoryCollection.valueChanges();
  }
  /*
  * Add item
  * */
  addItem(item: ItemModel) {
    // add category, if it doesn't exist
    const categoryId: string = item.category.trim().toLocaleLowerCase().split(' ').join('');
    this.afs.firestore.doc('/categories/' + categoryId).get()
        .then(docSnapshot => {
          if (!docSnapshot.exists) {
            // add to db
            this.categoryCollection.doc(categoryId).set({name: item.category, items: 1});
          } else {
              this.categoryCollection.doc(categoryId).update({items: increment});
          }
        }).catch(err => console.error(err));
    // add items..
    return this.itemsCollection.add(item);
  }
  /*
  * update item
  * */
  updateItem(id: string, item: ItemModel) {
    // add category, if it doesn't exist
    const categoryId: string = item.category.trim().toLocaleLowerCase().split(' ').join('');
    this.afs.firestore.doc('/categories/' + categoryId).get()
        .then(docSnapshot => {
          if (!docSnapshot.exists) {
            // add to db
            this.categoryCollection.doc(categoryId).set({name: item.category, items: 1});
          } else {
              this.categoryCollection.doc(categoryId).update({items: increment});
          }
        }).catch(err => console.error(err));
    // add items..
    return this.itemsCollection.doc(id).update(item);
  }
  /* get items*/
  getItems(limit = 15) {
    return this.afs.collection('items', ref => ref.orderBy('name').limit(limit))
        .snapshotChanges()
        .pipe(map(actions => actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data() as ItemModel;
          const timestamp = action.payload.doc.get('date');
          data.date = timestamp.toDate();
          return {id, ...data};
        })));
  }/* delete item*/
    deleteItem(id: string) {
        return this.itemsCollection.doc(id).delete();
    }
    /*
    * get orders stats*/
    getOrderStats() {
        return this.afs.collection<OrderStats>('orderStats').doc('order_stat')
            .snapshotChanges()
            .pipe(map(action => {
                const id = action.payload.id;
                const data = action.payload.data() as OrderStats;
                return {id, ...data};
            }));
    }
    /*
    * update orders stats*/
    incrementOrderStats(totalAmount: number) {
        return this.afs.collection<OrderStats>('orderStats').doc('order_stat')
            .update({
                totalAmount: firebase.firestore.FieldValue.increment(totalAmount),
                totalOrders: increment
            });
    }
  /*
  * Add order
  * */
  addOrder(order: OrderModel) {
    return this.ordersCollection.add(order);
  }
  /*get all orders*/
  getOrders() {
    return this.ordersCollection
        .snapshotChanges()
        .pipe(map(actions => actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data() as OrderModel;
          const timestamp = action.payload.doc.get('date');
          data.date = timestamp.toDate();
          return {id, ...data};
        })));
  }
  /*get orders by customer id*/
  getOrdersByCustomerId(customerId, limit = 15) {
    return this.afs.collection<OrderModel>('orders', ref =>
        ref.where('customerId', '==', customerId).orderBy('date', 'desc').limit(limit))
        .snapshotChanges()
        .pipe(map(actions => actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data() as OrderModel;
          const timestamp = action.payload.doc.get('date');
          data.date = timestamp.toDate();
          return {id, ...data};
        })));
  }
  /* get orders by status */
  getOrdersByStatus(status: SaleStatus, limit = 15) {
    return this.afs.collection<OrderModel>('orders', ref =>
        ref.where('status', '==', status).orderBy('date', 'desc').limit(limit))
        .snapshotChanges()
        .pipe(map(actions => actions.map(action => {
          const id = action.payload.doc.id;
          const data = action.payload.doc.data() as OrderModel;
          const timestamp = action.payload.doc.get('date');
          data.date = timestamp.toDate();
          return {id, ...data};
        })));
  }
  /*
  * Update order
  * */
  updateOrder(order: OrderModel) {
    return this.ordersCollection.doc(order.id).update(order);
  }
  /*
  * Delete order
  * */
  deleteOrder(id: string) {
    return this.ordersCollection.doc(id).delete();
  }
}
