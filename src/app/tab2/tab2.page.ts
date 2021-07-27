import { Component } from '@angular/core';
import { Photo, PhotoService } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService, public actionSheetContoller: ActionSheetController) {}

  addPhotoToGallery()
  {
    this.photoService.addNewToGallery();
  }
  public async showActionSheet(photo: Photo, position: number)
  {
    const actionSheet = await this.actionSheetContoller.create({
      header: 'Фото',
      buttons:[{
        text: 'Удалить',
        role: 'destructive',
        icon: 'trash',
        handler: () => {this.photoService.deletePicture(photo, position);}
      },
      {
        text: 'Отменить',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }
  async ngOnInit(){
    await this.photoService.loadSaved();
  }
}
