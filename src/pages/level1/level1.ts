import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-level1',
  templateUrl: 'level1.html'
})
export class Level1Page {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];
  myColour: string;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private media: Media,
              private file: File,
              private http: HTTP,
              public platform: Platform,) {
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['OK']
    });
    alert.present();
  }

  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.m4a';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.ogg';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    else {
      return false
    }
    this.audio.startRecord();
    this.recording = true;
    return true
  }

  stopRecord() {
    this.audio.stopRecord();
    this.audioList.push(this.audio);
    this.recording = false;
  }

  sendToASR(audio) {
    let audioContent;
    if (this.platform.is('ios')) {
      audioContent = this.file.readAsDataURL(this.file.documentsDirectory.replace(/file:\/\//g, ''), this.fileName);
    } else if (this.platform.is('android')) {
      audioContent = this.file.readAsDataURL(this.file.externalDataDirectory.replace(/file:\/\//g, ''), this.fileName);
    }
    audioContent.replace('data:audio/ogg; codecs=opus;base64,','');
  }

  playAudio(audio) {
    audio.play();
    audio.setVolume(0.8);
  }

  record() {
    if (this.recording) {
      this.myColour = 'primary';
      this.stopRecord();
      console.log('Stopped recording');
      this.playAudio(this.audioList[(this.audioList.length - 1)]);
    }
    else if (this.startRecord()) {
      this.myColour = 'danger';
      console.log('Starting to record');
    }
    else {
      this.showAlert('Failed to record audio')
    }
  }
}