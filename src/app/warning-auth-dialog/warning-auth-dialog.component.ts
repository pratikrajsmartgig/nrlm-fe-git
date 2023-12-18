import { Component, OnInit, ViewChild } from '@angular/core';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { Router } from '@angular/router';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { UserServiceService } from '../services/user-service.service';
import { DatePipe } from '@angular/common';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';


@Component({
  selector: 'app-warning-auth-dialog',
  templateUrl: './warning-auth-dialog.component.html',
  styleUrls: ['./warning-auth-dialog.component.css']
})
export class WarningAuthDialogComponent{
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;

  show = false;
  PopupShown: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;
  auth: any | null;
  remarks:string=''

  constructor(
    private entityService: AddEntityServiceService,
    private router: Router,
    private userService: UserServiceService,
    private http: EntityScreenServiceService,
    private route: Router,
    public datepipe: DatePipe
    
  ) { 
    //  this.auth = localStorage.getItem('auth');
     console.log(this.auth);
  }
  passwordChngd:any;
  ngOnInit(){
    this.userId = localStorage.getItem('UserId');
    this.unitCode = localStorage.getItem('UnitCode');
    this.entityData = localStorage.getItem('entityData');
    this.auth = localStorage.getItem("auth");
  //  this.auth = localStorage.getItem('auth');
  }
  openDialog() {
    this.auth = localStorage.getItem('auth');
    //authorizeData
    console.log('its hitting openDialog')
      this.show = true;
  }
  
  closeDialog() {
      this.show = false;
  }

  Authorize(){
    let data= JSON.parse(localStorage.getItem('EntityCelldata')||"null")
    let Data ={
        unitCode: data.unit,
        currentStatus: data.status,
        remarks: this?.remarks,
        isReject: JSON.stringify(false)
    }
  
    this.entityService.authorizeNdRejectEntity(Data).subscribe(
      (res: any) => {
        console.log(res);
        if ((res.success = true)) {
          let authorizeEntityData = res;
          this.show = false;
          const message = "Authorised Successfully."
          localStorage.setItem("RateAllowedPopup",message);
          localStorage.setItem("PopupMaitainance",'EntityRA');
          this.errordialog?.openDialog();
         // this.router.navigate(['/entity-screen']);
        } else {
         // alert(res.message);
         localStorage.setItem("RateAllowedPopup",res.message);
         localStorage.setItem("PopupMaitainance",'NrlmUpload');
         this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        localStorage.setItem("RateAllowedPopup",err.error.message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
        //alert(err.error.message);
      }
    );
  }



  onReject(){
    this.show = false;
    localStorage.setItem("popupDelete", "rejectEntity");
    localStorage.setItem("EntityRemarks",this.remarks);
    this.deletedialog?.openDialog();

  //   console.log(this.remarks);
  //   let data= JSON.parse(localStorage.getItem('EntityCelldata')||"null")
  //   let Data ={
  //     unitCode: data.unit,
  //     currentStatus: data.status,
  //     remarks: this?.remarks,
  //     isReject: JSON.stringify(true)
  // }
   
  //   this.entityService.authorizeNdRejectEntity(Data).subscribe(
  //     (res: any) => {
  //       if ((res.success = true)) {
  //         let authorizeEntityData = res;
  //         this.show = false;
  //         const message = "Rejected Successfully."
  //         localStorage.setItem("RateAllowedPopup",message);
  //         localStorage.setItem("PopupMaitainance",'EntityRA');
  //         this.errordialog?.openDialog();
  //       //  this.router.navigate(['/entity-screen']);
  //       } else {
  //         alert(res.message);
  //       }
  //     },
  //     (err: any) => {
       
  //       alert(err.error.message);
  //     }
  //   );
  }

  remark:string=''
  sendRateUpdate(isReject: boolean) {
    let data = {
      userId: localStorage.getItem('UserID'),
      currentStatus:localStorage.getItem('UserStatus') ,
      remarks: this.remark,
      isReject: JSON.stringify(isReject),
    };
    console.log(data);
    this.userService.authorizeNdRejectUser(data).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          this.show = false;
          let authorizeUserData = res?.data;
          let message;
          if(isReject){
            message = "Rejected Successfully."
          }else{
            message = "Authorised Successfully"
          }
          localStorage.setItem("RateAllowedPopup",message);
          localStorage.setItem("PopupMaitainance",'userRA');
          this.errordialog?.openDialog();
          console.log('authorizeUserDataResponse', authorizeUserData);
         // this.router.navigate(['/user-data']);
        } else {
          //alert(res.message);
          this.show = false;
          localStorage.setItem("RateAllowedPopup",res.message);
          localStorage.setItem("PopupMaitainance",'userRAError');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
       // alert(err.error.message);
       this.show = false;
       localStorage.setItem("RateAllowedPopup",err.error.message);
       localStorage.setItem("PopupMaitainance",'userRAError');
       this.errordialog?.openDialog();
      }
    );
  }

  Rateremarks: string = '';
  sendRaUpdate(isReject: boolean) {
    const celldata = JSON.parse(localStorage.getItem('UnitCodeRate') || 'null');
    let EffectiveDates = celldata.qtrEnding;
    EffectiveDates = this.datepipe.transform(EffectiveDates,'dd-MM-yyyy');
    const body = {
      unitCode: celldata.unitCode,
      status: celldata.status,
      effectiveDate: EffectiveDates,
      rateType: celldata.rateTypeId,
      remarks: this.Rateremarks,
      isReject: JSON.stringify(isReject),
    };
  
    this.http.UpdateRate(body).subscribe(
      (res: any) => {
        if (res.success === true) {
          this.show = false;
          let authorizeUserData = res?.data;
          let message: any;
          if(isReject){
            message = "Rejected Successfully."
          }else{
            message = "Authorised Successfully"
          }
          localStorage.setItem("RateAllowedPopup",message);
          localStorage.setItem("PopupMaitainance",'rateRA');
          this.errordialog?.openDialog();
          //this.route.navigate(['/interest-rate-screen']);
        } else if (res.success === false) {
          // alert(res.message);
          // this.route.navigate(['/interest-rate-screen']);
          this.show = false;
          localStorage.setItem("RateAllowedPopup",res.message);
          localStorage.setItem("PopupMaitainance",'rateRAError');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        this.show = false;
        localStorage.setItem("RateAllowedPopup",err.error.message);
        localStorage.setItem("PopupMaitainance",'rateRAError');
        this.errordialog?.openDialog();
       // alert(err.error.message);
      }
    );
    // Reset the textarea value
     this.remarks = '';
  }
  

}
