import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController, ToastController} from '@ionic/angular';
import {SeoService} from '../../../providers/seo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryModel, ItemModel} from '../../../models/data';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {DbService} from '../../../providers/db.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  uploadPercent: Observable<number>;
  editItem: ItemModel;
  downloadURL: Observable<string>;
  itemForm: FormGroup;
  image: any;
  imagePath;
  categories: CategoryModel[] = [];

  constructor(private modalCtrl: ModalController,
              private seo: SeoService,
              private db: DbService,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private storage: AngularFireStorage,
              private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      category: ['', Validators.required],
      units: 'EA',
      unitPrice: ['', Validators.required]
    });
    // get image path, so would be constant so long as the modal is open,
    // if you generate it on upload, you risk uploading multiple files for the same item
    this.imagePath = this.makeId();
  }

  ngOnInit() {
    if (!this.editItem) {
      this.seo.setAdminTitle('Add Items');
    } else  {
      this.seo.setAdminTitle('Edit ' + this.editItem.name);
      // if edit item specified patch form
      this.itemForm.patchValue(this.editItem);
      // set image
      this.image = this.editItem.imageUrl;
    }
    /*this.db.getCategories()
        .subscribe(cats => {
          this.categories = cats;
        });*/
  }
  /* when image is imported*/
  onImageImported($event) {
    this.image = $event.target.files[0];
    this.uploadFile(this.image);
  }
  /* dismiss modal*/
  dismissModal() {
    this.seo.setAdminTitle('Items');
    this.modalCtrl.dismiss();
  }
  /*save item modal*/
  async save() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
    // construct item object
    const item: ItemModel = {
      name: this.itemForm.value.name,
      category: this.itemForm.value.category,
      unitPrice: this.itemForm.value.unitPrice,
      units: this.itemForm.value.units,
      imageUrl: this.itemForm.value.imageUrl,
      orderCount: 0,
      date: new Date()
    };
    // show loader
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();
    // add or update depending on edit item
    if (!this.editItem) {
      // add to db
      this.db.addItem(item)
          .then(() => {
            this.dismissModal();
            // reset image path
            this.imagePath = this.makeId();
          }).catch(err => {
        this.showToastError(err.message, 3500);
      }).finally(() => {
        loading.dismiss();
      });
    } else {
      // update item
      this.db.updateItem(this.editItem.id, item)
          .then(() => {
            this.dismissModal();
            // reset image path
            this.imagePath = this.makeId();
          }).catch(err => {
        this.showToastError(err.message, 3500);
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
  /*upload*/
  uploadFile(file) {
    const fileRef = this.storage.ref(this.imagePath);
    if (!this.editItem) {
      const task = this.storage.upload(this.imagePath, file);
      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL()
                .subscribe(url => this.itemForm.patchValue({imageUrl: url}));
          } )
      ).subscribe();
    } else {
      if (!this.editItem.imageUrl) {
        const task = this.storage.upload(this.imagePath, file);
        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        // get notified when the download URL is available
        task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL()
                  .subscribe(url => this.itemForm.patchValue({imageUrl: url}));
            } )
        ).subscribe();
        return;
      }
      this.storage.storage.refFromURL(this.editItem.imageUrl).put(file);
    }
  }
  /*make id for image uploads*/
  makeId(length = 7) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
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
