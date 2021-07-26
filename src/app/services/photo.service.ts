import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Camera, CameraPhoto, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: Photo[] = [];

  public async addNewToGallery()
  {
    const capturedPhoto = await Camera.getPhoto(
      {
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      }
    );
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    Storage.set(
      {
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      }
    )
  }

  public async loadSaved()
  {
    const photoList = await Storage.get({
      key: this.PHOTO_STORAGE
    });
    this.photos = JSON.parse(photoList.value) || [];
    for(let photo of this.photos)
    {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });
      photo.webviewPath = `data:image/jpeg;base64,$(readFile.date)`;
    }
  }

  private async savePicture(cameraPhoto: CameraPhoto){
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    return {filepath: fileName, webviewPath: cameraPhoto.webPath}
  }

  private async readAsBase64(cameraPhoto: CameraPhoto)
  {
    const responce = await fetch(cameraPhoto.webPath);
    const blob = await responce.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    }
    reader.readAsDataURL(blob);
  });

  private PHOTO_STORAGE: string = "photos";

  constructor() { }
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
