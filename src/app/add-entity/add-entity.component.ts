import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
// import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { WarningAuthDialogComponent } from '../warning-auth-dialog/warning-auth-dialog.component';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.css']
})
export class AddEntityComponent {
  @ViewChild(WarningAuthDialogComponent) warningdialog: WarningAuthDialogComponent | undefined;
  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;
  selectedCar!: number;
  unitCode: any;
  gridData: any = [];
  entityData: any;
  UnitCode: any;
  Level: any;
  parentUnit: any;
  unitName: any;
  IFSC: any;
  state: any;
  district: any;
  pincode: any;
  email: any;
  recordStatus: any;
  levelsData: any = [];
  parentLevelsData: any = [];
  statesData: any = [];
  districtsData: any = [];
  recordStatusData: any = [];
  addEntityForm!: FormGroup;
  addEntityData: any;
  Status: any;
  editEntityData: any = [];
  isAdd:boolean = true;
  hideDelete:boolean = false;
  changeLevelIden:boolean =  false;
  dissbleBtn:boolean =  false;
  mode: any;
  HOCheck: boolean = false;
  constructor(private entityService: AddEntityServiceService, private router: Router,public dialog: MatDialog, private activeRoute :ActivatedRoute) {
  }
  @ViewChild(NgSelectComponent)
  ngSelectComponent!: NgSelectComponent;
  ngOnInit() {
    this.entityData = localStorage.getItem("entityData");
    this.unitCode = localStorage.getItem("UnitCode");
    if(this.unitCode ==='HO'){
      this.HOCheck = true;
    }
    this.Status = localStorage.getItem("Status")
    this.UnitCode = localStorage.getItem("UnitCode");
    this.Status = localStorage.getItem("Status");
    let AuthStatus =  localStorage.getItem("AuthStatus");
    this.getStatesData();
    if (this.entityData == "addData") {
      this.isAdd = true;
      this.changeLevelIden =  false;
      this.recordStatus ='A';
      this.getRecordStatusData();
      this.getLevelsData();
    }
    if (this.entityData == "editData") {
      this.isAdd = false;
     this.getEditEntityData();
      this.getRecordStatusData();
      this.getLevelsData();
    }
    if(AuthStatus == 'Authorized') {
      this.hideDelete = true;
      this.getLevelsData();
    }
    else if(this.entityData == "deleteData"){
      this.isAdd = false;
      this.dissbleBtn = true;
      this.getEditEntityData();
      this.getRecordStatusData();
      this.getLevelsData();
    }
    else if(this.entityData == "authorizeData"){
      this.isAdd = false;
      this.dissbleBtn = true;
      this.getEditEntityData();
      this.getRecordStatusData();
      this.getLevelsData();
    }
    this.activeRoute.queryParamMap.subscribe((data:any)=>{
      this.mode = data.params.mode      
    })
    // this.changeLevel();
  }

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  getLevelsData() {
    //alert(this.changeLevelIden);
    this.entityService.getLevels(this.changeLevelIden).subscribe((res: any) => {
    console.log(res.data);
      if (res) {
        if(this.unitCode == 'HO'){
          this.levelsData = [{level: 1, levelName: 'Head Office'}]
        }else{
          this.levelsData = res?.data;
        }
        }
         // this.levelsData.pop();      }
      console.log(this.levelsData);
    },
      (err: any) => {
     
      }
    );
  }
  combinedArray:any = [];
  changeLevel(event:any) {
     this.parentUnit = '';
    // let level = event.level;
    this.Level = event.level;
    if(this.Level == 1) {
      this.parentUnit = 0
      
    }
  
    if(this.Level !== 1) {
      this.entityService.getParentLevels(this.Level).subscribe((res: any) => {
       
        if (res) {
          this.parentLevelsData = res?.data;
          let combinedIdValue = this.parentLevelsData.map((item:any) => `${item.unitCode}-${item.unit}`);
          console.log("CombinedIdValue",combinedIdValue);
          let combinedIdArray = this.parentLevelsData.map((item:any) => item.unitCode);
          console.log("CombinedIdArray",combinedIdArray);
    // Combine arrays into an array of objects
  this.combinedArray = combinedIdValue.map((value: any, index: string | number) => ({ unit: value, unitCode: combinedIdArray[index] }));
        
        }
      },
        (err: any) => {
         
        }
      );
    }
  }
  getParentLevel(event: any) {
        this.parentUnit = event.unitCode;
        
  }
  unitCodeEntered(event: any) {
    this.UnitCode = event.target.value;
   
  }
  unitNameEntered(event: any) {
    this.unitName = event.target.value;
    
  }
  IFSCEntered(event: any) {
    this.IFSC = event.target.value;
   
  }
  getStatesData() {
    this.entityService.getStates().subscribe((res: any) => {
   
      if (res) {
        this.statesData = res?.data;
       
      }
    },
      (err: any) => {
        
      }
    );
  }
  selectedState(event: any) {
    this.district = '';
 
    let selectedStatee = event.state_code;
    // this.district = event.state_code;
    this.entityService.getDistricts(selectedStatee).subscribe((res: any) => {
     
      if (res) {
        this.districtsData = res?.data;
       
      }
    },
      (err: any) => {
       
      }
    );
  }
  selectedDistrict(event: any) {
  
    this.district = event.districtCode
  }
  pincodeEntered(event: any) {
    this.pincode = event.target.value;
    
  }
  emailEntered(event: any) {
    this.email = event.target.value;
    
  }
  getRecordStatusData() {
    this.entityService.getEntityStatus(this.isAdd).subscribe((res: any) => {
    
      if (res) {
        this.recordStatusData = res?.data;
       console.log(res);
      }
    },
      (err: any) => {
       
      }
    );
  }
  SaveData() {
    let data = {
      unitCode: this.UnitCode,
      parentUnitCode: this.parentUnit,
      ifsc: this.IFSC,
      unitName: this.unitName,
      level: this.Level,
      stateCode: this.state,
      districtCode: this.district,
      pincode: this.pincode,
      email: this.email,
      entityStatus: this.recordStatus
    }
    this.entityService.addEntity(data).subscribe((res: any) => {
      if (res.success = true) {
        this.addEntityData = res?.data;
      
        this.router.navigate(['/entity-screen'])
      }
      else {
        alert(res.message);
      }
    },
      (err: any) => {
       
        alert(err.error.message)
      }
    );
  }
  SaveEditData() {
    if (this.unitCode != '') {
      let data = {
        parentUnitCode: this.parentUnit,
        ifsc: this.IFSC,
        unitName: this.unitName,
        level: this.Level,
        stateCode: this.state,
        districtCode: this.district,
        pincode: this.pincode,
        email: this.email,
        entityStatus: this.recordStatus
      }
      this.entityService.SaveEditDataFromUnitCode(this.unitCode, this.Status, data).subscribe((res: any) => {
        if (res.success == true) {
          this.editEntityData = res?.data;
         
          this.router.navigate(['/entity-screen'])
        }
        if(res.success == false) {
          alert(res.message);
          this.router.navigate(['/entity-screen'])
        }
      },
        (err: any) => {
         
          alert(err.error.message)
          // this.router.navigate(['/entity-screen'])
        }
      );
    }
  }
  deleteEntityData() {
    if (this.unitCode != '') {
      this.entityService.deleteEntityDataByUnitCode(this.unitCode).subscribe((res: any) => {
        if (res.success = true) {
          let DeleteEntityData = res?.data;
         
          this.router.navigate(['/entity-screen'])
        }
        else {
          alert(res.message);
        }
      },
        (err: any) => {
          
          alert(err.error.message)
          this.router.navigate(['/entity-screen'])
        }
      );
    }
  }
  deletePopup(){
    localStorage.setItem("popupDelete","deleted");
    const pop = localStorage.getItem("popupDelete");
    console.log(pop);
  //  this.dialog.open(WarningPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false})
   this.deletedialog?.openDialog();
  }
  // authorizePopup(){
  //   // localStorage.setItem("RecordStatus",this.recordStatus);
  //   localStorage.setItem("popupShown","authorized");
  //   localStorage.setItem("RejectedStatus",JSON.stringify(false))
  //   // this.dialog.open(WarningPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false})
  // }
  // RejectedPopup(){
  //   localStorage.setItem("RecordStatus",this.recordStatus);
  //   localStorage.setItem("popupShown","authorized");
  //   localStorage.setItem("RejectedStatus",JSON.stringify(true))
  //   this.dialog.open(WarningPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false})
  // }
  reset() {
    this.Level = ''
    this.parentUnit = '';
    this.unitName = '';
    this.IFSC = '';
    this.state = '';
    this.district = '';
    this.pincode = '';
    this.email = '';
    this.recordStatus = '';
    this.ngSelectComponent.handleClearClick();
  }
  getEditEntityData() {
    console.log(this.unitCode);
    if (this.unitCode != '') {
      this.entityService.getViewDataFromUnitCode(this.unitCode, this.Status).subscribe((res: any) => {
      console.log(res);
        if (res.success == true) {
          this.gridData = res?.data;
         console.log("gridData", this.gridData);
          this.UnitCode = this.gridData?.unit;
          this.Level = Number(this.gridData?.level);
          if(this.Level == 2)  {
            this.changeLevelIden = false;
          } else {
            this.changeLevelIden = true;

          }
         if(this.Level == 1){
           this.entityService.getLevels(this.Level).subscribe((res: any)=>{
            console.log(res);
           })
         }
         if(this.Level !== 1){
          this.entityService.getParentLevels(this.Level).subscribe((res: any) => {
           
            if (res) {
              this.parentLevelsData = res?.data;
              let combinedIdValue = this.parentLevelsData.map((item:any) => `${item.unitCode}-${item.unit}`);
              console.log("CombinedIdValue",combinedIdValue);
              let combinedIdArray = this.parentLevelsData.map((item:any) => item.unitCode);
              console.log("CombinedIdArray",combinedIdArray);
        // Combine arrays into an array of objects
      this.combinedArray = combinedIdValue.map((value: any, index: string | number) => ({ unit: value, unitCode: combinedIdArray[index] }));
             
            }
          },
            (err: any) => {
             
            }
          );
          console.log("GridData",this.gridData)
          this.parentUnit = this.gridData?.parent_unit;
         }
       
          this.unitName = this.gridData?.unit_name;
          this.IFSC = this.gridData?.ifsc;
          this.state = String(this.gridData?.stateCode);
          // alert(this.state)
          this.entityService.getDistricts(this.state).subscribe((res: any) => {
           
            if (res) {
              this.districtsData = res?.data;
              
            }
          },
            (err: any) => {
             
            }
          );
          this.district = String(this.gridData?.districtCode);
          this.pincode = this.gridData?.pincode;
          this.email = this.gridData?.emailId;
          this.recordStatus = this.gridData?.entity_status;
        }
      },
        (err: any) => {
         
        }
      );
    }
  }
  back() {
    this.router.navigate(['/entity-screen'])
  }

  remarks:string=''
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
        if ((res.success = true)) {
          let authorizeEntityData = res;
        
          this.router.navigate(['/entity-screen']);
        } else {
          alert(res.message);
        }
      },
      (err: any) => {
     
        alert(err.error.message);
      }
    );
  }
  reject(){
    let data= JSON.parse(localStorage.getItem('EntityCelldata')||"null")
    let Data ={
      unitCode: data.unit,
      currentStatus: data.status,
      remarks: this?.remarks,
      isReject: JSON.stringify(true)
  }
   
    this.entityService.authorizeNdRejectEntity(Data).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          let authorizeEntityData = res;
      
          this.router.navigate(['/entity-screen']);
        } else {
          alert(res.message);
        }
      },
      (err: any) => {
       
        alert(err.error.message);
      }
    );
  }

  authPopup(){
   localStorage.setItem('auth','Authorise');
   this.warningdialog?.openDialog();
  }

  rejectPopup(){
    localStorage.setItem('auth','Reject');
    this.warningdialog?.openDialog();
  }
  
}
