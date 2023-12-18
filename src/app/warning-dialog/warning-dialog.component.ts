import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { Router } from '@angular/router';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent implements OnInit {
  @Output() claimPEvent = new EventEmitter<string>();
  show = false;
  PopupDelete: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;
  selectedCellData: any | null;
  userStatus: any | null;
  selectedUserCellData: any;
  closedAccountId:any;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  constructor(
    private addEntityService: AddEntityServiceService,
    private http: EntityScreenServiceService,
    private entityService: EntityScreenServiceService,
    private router: Router,
    private SharedEntityService: SharedEntityServiceService,
    private addentityService: AddEntityServiceService
  ) { 
    //  this.PopupDelete = localStorage.getItem('popupDelete');
    // console.log(this.PopupDelete);
  }

  ngOnInit(){
   //this.PopupDelete = localStorage.getItem('popupDelete');
    // this.userId = localStorage.getItem('UserId');
    this.unitCode = localStorage.getItem('UnitCode');
    this.entityData = localStorage.getItem('entityData');
    console.log(this.PopupDelete);
  }
  openDialog() {
    this.PopupDelete = localStorage.getItem('popupDelete');
    this.selectedCellData = localStorage.getItem('cellData');
    this.userId = localStorage.getItem('UserID');
    this.userStatus = localStorage.getItem('UserStatus');
    if (this.PopupDelete == 'UserUploadDeleted') {
      this.selectedUserCellData = localStorage.getItem('userUploadData');
      this.selectedUserCellData = JSON.parse(this.selectedUserCellData);
      console.log("SeletedUserData", this.selectedUserCellData)
    }
    this.selectedCellData = JSON.parse(this.selectedCellData)
      this.show = true;
  
  }
  
  closeDialog() {
      this.show = false;
      window.location.reload();
  }

  deleteEntityData() {
    if (this.unitCode != '') {
      this.addEntityService.deleteEntityDataByUnitCode(this.unitCode).subscribe(
        (res: any) => {
          if ((res.success = true)) {
            let DeleteEntityData = res?.data;
            console.log('DeleteEntityDataResponse', DeleteEntityData);
            this.router.navigate(['/entity-screen']);
         
          } else {
            alert(res.message);
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
          alert(err.error.message);
          this.router.navigate(['/entity-screen']);
         
        }
      );
    }
  }
  deleteUserData() {
    if (this.userId != '') {
      console.log(this.userId);
      this.addEntityService.deleteUserData(this.userId).subscribe(
        (res: any) => {
          console.log(res);
          if ((res.success = true)) {
            let DeleteEntityData = res?.data;
            console.log('DeleteEntityDataResponse', DeleteEntityData);
            this.router.navigate(['/user-data']);
            // this.dialogRef.close();
          } else {
            alert(res.message);
            console.log("response",res)
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
          alert(err.error.message);
          this.router.navigate(['/entity-screen']);
          // this.dialogRef.close();
        }
      );
    }
  }

  gobackUserScreen() {
    // this.router.navigate(['/add-user-data']);
    this.show = false;
  }

  DeleteEntityUpload() {

    this.addEntityService.DeleteUploadedFile(this.selectedCellData.entityDataStatusId).subscribe(
      (res: any) => {
        console.log("Selected File Response:", res);
        if (res.success === true) {
          this.router.navigate(['./entity-upload-screen'])
          window.location.reload();
          this.SharedEntityService.filter('Register click')
        }
      },
      (err: any) => {
        if (err.error && err.error.message) {
          console.log("Error:", err.error.message);
        } else {
          console.log("Error:", err);
        }
      }
    );
  }

  DeleteUserUpload() {
    this.addEntityService.delete(this.selectedUserCellData.userDataStatusId).subscribe((response: any) => {
      console.log(response);
      if (response.success == false) {
        this.router.navigate(['./user-upload'])
        window.location.reload();
        this.SharedEntityService.filter('Register click')
      }

    },
      (err: any) => {
        if (err.error && err.error.message) {
          console.log("Error:", err.error.message);
        } else {
          console.log("Error:", err);
        }
      }
    );
  } 

  
  DeleteNRLMUpload() {
    let uploadShgCodesDataStatusId = localStorage.getItem('uploadShgCodesDataStatusId')
    this.entityService
      .DeleteuploadNrlm(uploadShgCodesDataStatusId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
         
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
  DeleteAccountsUpload() {
    let uploadAccountCodesDataStatusId = localStorage.getItem('uploadAccountsDataStatusId');
    this.entityService
      .DeleteuploadAccounts(uploadAccountCodesDataStatusId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
         
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
  DeleteClosedAccountsUpload() {
    this.closedAccountId = localStorage.getItem("uploadClosedDataStatusId");
    this.entityService
      .DeleteCloseduploadAccounts(this.closedAccountId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
         
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
  DeleteClaimsUpload() { 
    this.closedAccountId = localStorage.getItem("claimsDataStatusId");
    this.entityService
      .DeleteClaimsUpload(this.closedAccountId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
        
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }

  deleteClaimsProccessingData(){
    this.router.navigate(['/claims-processing-screen']);
    this.claimPEvent.emit();
    // window.location.reload();

  }
  remarks: any;
  rejectEntity(){
    this.remarks = localStorage.getItem('EntityRemarks')

    let data= JSON.parse(localStorage.getItem('EntityCelldata')||"null")
    let Data ={
      unitCode: data.unit,
      currentStatus: data.status,
      remarks: this?.remarks,
      isReject: JSON.stringify(true)
  }
   
    this.addentityService.authorizeNdRejectEntity(Data).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          let authorizeEntityData = res;
          this.show = false;
          const message = "Rejected Successfully."
          localStorage.setItem("RateAllowedPopup",message);
          localStorage.setItem("PopupMaitainance",'EntityRA');
          this.errordialog?.openDialog();
        //  this.router.navigate(['/entity-screen']);
        } else {
          alert(res.message);
        }
      },
      (err: any) => {
       
        alert(err.error.message);
      }
    );
  }
  closeEntityDialog(){
    this.show = false
  }
}
