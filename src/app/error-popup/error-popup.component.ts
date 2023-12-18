import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})

export class ErrorPopupComponent {
  constructor( private dialogRef: MatDialogRef<ErrorPopupComponent>,    private router: Router) {}
  addRatePopupData:any;
  nrlmUpload:any;
  ngOnInit() {
   this.addRatePopupData =  localStorage.getItem("RateAllowedPopup");
   console.log(this.addRatePopupData);
   this.nrlmUpload =   localStorage.getItem("PopupMaitainance");
   console.log(this.nrlmUpload);
  }
  closepopup() {
    this.dialogRef.close();
  }
  gobackUploadUserScreen() {
    window.location.reload();
    this.router.navigate(['/interest-rate-screen']);
    this.dialogRef.close();
  }
  gobackNrlmUploadScreen() {
    window.location.reload();
    this.router.navigate(['/nrlm-upload-screen']);
    localStorage.setItem("PopupMaitainance",'');
    this.dialogRef.close();
  }
}
