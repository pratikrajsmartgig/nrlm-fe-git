import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {
  @Output() claimPEvent = new EventEmitter<string>();
  show = false;
  PopupDelete: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;
  addRatePopupData: any | null;
  nrlmUpload: any | null;
  claimSaved:any | null;
  claimSuccess : any | null;
 
  constructor(
    private router: Router,public dialog: MatDialog,
  ) {
    //  this.PopupDelete = localStorage.getItem('popupDelete');
    // console.log(this.PopupDelete);
  }
 
  ngOnInit(){
   //this.PopupDelete = localStorage.getItem('popupDelete');
  //  this.addRatePopupData =  localStorage.getItem("RateAllowedPopup");
  //  console.log(this.addRatePopupData);
  //  this.nrlmUpload =   localStorage.getItem("PopupMaitainance");
  //  console.log(this.nrlmUpload);
  }
  AccountLocked:any;
  AccountLockedMsg:any;
  loginSamePasswordPopup:any;
  openDialog() {
 
    this.PopupDelete = localStorage.getItem('popupDelete');
    this.addRatePopupData =  localStorage.getItem("RateAllowedPopup");
    this.nrlmUpload =   localStorage.getItem("PopupMaitainance");
    this.claimSaved = localStorage.getItem("ClaimsSaved")
    this.claimSuccess= localStorage.getItem("claimSaved")
    this.AccountLocked =  localStorage.getItem("AccountLocked");
    this.AccountLockedMsg =  localStorage.getItem('errorMessage');
    this.loginSamePasswordPopup = localStorage.getItem("LoginPassWord")
    this.show = true;
      console.log("PopupData",this.claimSaved);
    console.log(this.nrlmUpload);
  }
  redirectDashboard(){
 this.dialog.closeAll();
 localStorage.removeItem("AccountLocked")
//  window.location.reload();
  }
  redirecttoResetPassword(){
    this.show = false;
    this.dialog.open(ForgotPasswordComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
    localStorage.removeItem("LoginPassWord")
  }
  closeDialog() {
      this.show = false;
      localStorage.removeItem("PopupMaitainance")
      window.location.reload();
  }
 
  redirectEntity(){
    this.router.navigate(['/entity-screen']);
  }
 
  redirectUser(){
    this.router.navigate(['/user-data']);
  }
 
  redirectRate(){
    this.router.navigate(['/interest-rate-screen']);
  }
 
  redirectHome(){
    this.show = false;
    this.router.navigate(['/home']);
    localStorage.removeItem('nrlmUpload');
    this.claimPEvent.emit();
  }
 
  redirectClaimsProccessing(){
    this.router.navigate(['/claims-processing-screen'])
    // localStorage.removeItem("RateAllowedPopup");
    localStorage.removeItem("PopupMaitainance");
    localStorage.removeItem("claimSaved");
  }
}