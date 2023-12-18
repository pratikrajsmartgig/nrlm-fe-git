import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-status-dialog',
  templateUrl: './upload-status-dialog.component.html',
  styleUrls: ['./upload-status-dialog.component.css']
})
export class UploadStatusDialogComponent implements OnInit {
 
  show = false;
  PopupShown: any | null;
  uploadStatus: any | null;
  entitymessage: any | null;

  constructor(
    private router: Router,
  ) {
    // this.uploadStatus = localStorage.getItem('uploadStatus');
    console.log(this.uploadStatus);
   }

  ngOnInit(){
    // this.uploadStatus = localStorage.getItem('uploadStatus');
    console.log(this.uploadStatus);
  }
  openDialog() {
    this.uploadStatus = localStorage.getItem('uploadStatus');
    this.entitymessage =  localStorage.getItem('entityuploadMessage');
    console.log('its hitting openDialog');
    console.log(this.uploadStatus);
      this.show = true;
  }
  
  closeDialog() {
      this.show = false;
      window.location.reload();
  }

}
