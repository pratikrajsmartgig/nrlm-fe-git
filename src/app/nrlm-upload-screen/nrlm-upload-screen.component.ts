import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions, PaginationChangedEvent,CellClickedEvent, GridReadyEvent,GridApi } from 'ag-grid-community';
import { IDropdownSettings } from "ng-multiselect-dropdown/multiselect.model";
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';

import { EntityScreenServiceService } from '../services/entity-screen-service.service';

// @ts-ignore
import printDoc from "src/assets/js/printDoc";
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { DatePipe } from '@angular/common';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-nrlm-upload-screen',
  templateUrl: './nrlm-upload-screen.component.html',
  styleUrls: ['./nrlm-upload-screen.component.css'],
  providers: [DatePipe]

  
})
export class NrlmUploadScreenComponent {

  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;

  selectedFyEndYear:any;
  selectedEndYear:any=[];
  startYears: any = [];
  endYears: number[] = [];
  years: number[] = [];
  fileInput: any;
  recordStatus: any = '';
  file: File | null = null;
  agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  showhide: boolean = true;
  tokenExpireyTime: any;
  tabEvent: any;
  viewDisabled: boolean = true;
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden: boolean = false;
  selectedFile: File | null = null;
  tooltip: any;
  fystart:any = '';
  checkCSV:boolean = true;
  fyend:any = '';
  unitsUploadData:any;
  sizeExceed:boolean =false;
  public pageSize = 20;
  // coldefs
  columnDefs: ColDef[] = [
    {
      headerName: 'File Name',
      field: 'fileName',
      tooltipField: 'filename',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'Bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'FY End',
      field: 'fyEnding',
      tooltipField: 'fyEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator,
      width:120
    },
    {
      headerName: 'Qtr End',
      field: 'qtrEnding',
      tooltipField: 'qtrEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      sortable: true, comparator: this.dateComparator2,
      width:120
    },
    {
      headerName: 'Uploaded By',
      field: 'uploadedBy',
      tooltipField: 'uploadedby',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Upload Status',
      field: 'statusDetails',
      tooltipField: 'statusDetails',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Total Records',
      field: 'totalCount',
      tooltipField: 'totalCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Success Records',
      field: 'successCount',
      tooltipField: 'successCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:160
    },
    {
      headerName: 'Error Records',
      field: 'failedCount',
      tooltipField: 'failedCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Uploaded Date Time',
      field: 'dateOfUpload',
      tooltipField: 'dateOfUpload',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Authorised By',
      field: 'authorizedBy',
      tooltipField: 'authorizedBy',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Authorised Date Time',
      field: 'authorizedDate',
      tooltipField: 'authorizedDate',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:220
    },
  ];

  columnDefs1: ColDef[] = [
    {
      headerName: 'File Name',
      field: 'fileName',
      tooltipField: 'filename',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'Bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'FY End',
      field: 'fyEnding',
      tooltipField: 'fyEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator,
      width:120
    },
    {
      headerName: 'Qtr End',
      field: 'qtrEnding',
      tooltipField: 'qtrEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator2,
      width:120
    },
    {
      headerName: 'Uploaded By',
      field: 'uploadedBy',
      tooltipField: 'uploadedby',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Upload Status',
      field: 'statusDetails',
      tooltipField: 'statusDetails',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Total Records',
      field: 'totalCount',
      tooltipField: 'totalCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Sucess Records',
      field: 'successCount',
      tooltipField: 'successCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'Error Records',
      field: 'failedCount',
      tooltipField: 'failedCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Uploaded Date-Time',
      field: 'uploadedDate',
      tooltipField: 'uploadedDate',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Authorised By',
      field: 'authorizedBy',
      tooltipField: 'authorizedBy',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Authorised Date Time',
      field: 'authorizedDate',
      tooltipField: 'authorizedDate',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:220
    },
  ];
  // dateComparator(date1: string, date2: string): number {
  //   const date1Timestamp = new Date(date1).getTime();
  //   const date2Timestamp = new Date(date2).getTime();

  //   if (date1Timestamp === date2Timestamp) {
  //     return 0;
  //   } else {
  //     return date1Timestamp > date2Timestamp ? 1 : -1;
  //   }
  // }
  // dateComparator(date1: Date, date2: Date): number {
  //   return date1.getTime() - date2.getTime();
  // }
  dateComparator(date1: string, date2: string): number {
    const date1Object = new Date(date1);
    const date2Object = new Date(date2);
    return date1Object.getTime() - date2Object.getTime();
  }
  dateComparator2(date1: string, date2: string): number {
    const date1Object = new Date(date1);
    const date2Object = new Date(date2);
    return date1Object.getTime() - date2Object.getTime();
  }
    // Custom date comparator function
    // customDateComparator(filterLocalDateAtMidnight:Date, cellValue:any) {
    //   const dateAsString = cellValue;
  
    //   if (dateAsString == null) {
    //     return 0;
    //   }
  
    //   const dateParts = dateAsString.split('/');
    //   const year = Number(dateParts[2]);
    //   const month = Number(dateParts[1]) - 1;
    //   const day = Number(dateParts[0]);
    //   const cellDate = new Date(year, month, day);
  
    //   if (cellDate < filterLocalDateAtMidnight) {
    //     return -1;
    //   } else if (cellDate > filterLocalDateAtMidnight) {
    //     return 1;
    //   }
    //   return 0;
    // }
  columnDefs2: ColDef[] = [
    {
      headerName: 'File Name',
      field: 'fileName',
      tooltipField: 'filename',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'Bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'FY End',
      field: 'fyEnding',
      tooltipField: 'fyEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator2,
      width:120
      // comparator: this.customDateComparator
    },
    {
      headerName: 'Qtr End',
      field: 'qtrEnding',
      tooltipField: 'qtrEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator,
      width:120
    },
    {
      headerName: 'Uploaded By',
      field: 'uploadedBy',
      tooltipField: 'uploadedby',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Upload Status',
      field: 'statusDetails',
      tooltipField: 'statusDetails',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Total Records',
      field: 'totalCount',
      tooltipField: 'totalCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Sucess Records',
      field: 'successCount',
      tooltipField: 'successCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'Error Records',
      field: 'failedCount',
      tooltipField: 'failedCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Uploaded Date-Time',
      field: 'dateOfUpload',
      tooltipField: 'dateOfUpload',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Authorised By',
      field: 'authorizedBy',
      tooltipField: 'authorizedBy',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Authorised Date Time',
      field: 'authorizedDate',
      tooltipField: 'authorizedDate',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:220
    },
  ];

  columnDefs3: ColDef[] = [
    {
      headerName: 'File Name',
      field: 'fileName',
      tooltipField: 'filename',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'Bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'FY End',
      field: 'fyEnding',
      tooltipField: 'fyEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator2,
      width:120
    },
    {
      headerName: 'Qtr End',
      field: 'qtrEnding',
      tooltipField: 'qtrEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    },
    {
      headerName: 'Uploaded By',
      field: 'uploadedBy',
      tooltipField: 'uploadedby',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator: this.dateComparator,
      width:150
    },
    {
      headerName: 'Upload Status',
      field: 'statusDetails',
      tooltipField: 'statusDetails',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Total Records',
      field: 'totalCount',
      tooltipField: 'totalCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Sucess Records',
      field: 'successCount',
      tooltipField: 'successCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'Error Records',
      field: 'failedCount',
      tooltipField: 'failedCount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Uploaded Date-Time',
      field: 'uploadedDate',
      tooltipField: 'uploadedDate',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Authorised By',
      field: 'authorizedBy',
      tooltipField: 'authorizedBy',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Authorised Date Time',
      field: 'authorizedDate',
      tooltipField: 'authorizedDate',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:220
    },
  ];
  gridOptions: GridOptions = {
    rowHeight: 20,
    columnDefs: this.columnDefs,
    defaultColDef: {
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
    // onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
    onGridReady: (params) => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  };
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,
    filter: 'agTextColumnFilter',
    sortable: true,
  };

  gridColumnApi: any;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  changeListener(fileInput: HTMLInputElement) {
    const files = fileInput.files;
    console.log(files);
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      //console.log("Selected File",this.selectedFile.size);
      // if(newSize)
      // console.log("FileSize",(this.selectedFile.size)/1000000000)
      // if((this.selectedFile.size)/(10)^9)
       this.checkCSV = this.selectedFile.name.endsWith('.csv');
      console.log(this.checkCSV);
      // if(!checkCSV){
      //   const message = "File format is not correct, Please upload file in .csv format."
      //   // localStorage.setItem("RateAllowedPopup",message);
      //   // localStorage.setItem("PopupMaitainance",'NrlmUpload');
      //   // this.spinner.hide()
      //   // this.errordialog?.openDialog(); 
      // }
      console.log('Selected File:', this.selectedFile.name);
    }
  }
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }

  disabled = false;
  selectedItems: any = [];
  constructor(private dateFormatService:DateFormatServiceService,private dateFormatServiceWithoutTime:DateFormatWithoutTimeService,private router: Router, private entityService: EntityScreenServiceService, 
    
    public dialog: MatDialog,

    public datepipe: DatePipe,
    private entityGridService: SharedEntityServiceService,
    private http: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    this.tokenExpireyTime = localStorage.getItem(
      'tokenExpirationTimeInMinutes'
    );
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.selectedEndYear = 2023;
    this.endYears = [];
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;
  uploadPermission:boolean = false;
  deleteView:boolean =false;
  fileView:boolean = false;
  uploadFileType:any;
  item:any;
  rolesToken:any = [];
  ngOnInit() {
        // localStorage.setItem('uploadFileType','closedAccount');
    this.uploadFileType = localStorage.getItem('uploadFileType');
   let item = localStorage.getItem('labelKeyOfSideNav');
   this.rolesToken = localStorage.getItem("TokenDetals");
   this.rolesToken = JSON.parse(this.rolesToken?this.rolesToken:'')
  console.log("RolesToken",this.rolesToken)
  this.rolesToken.qtrEndingDate;
  // this.selectedFyEndYear = this.rolesToken.fyEndingDate;
  // this.selectedFyEndYear = this.datepipe.transform(this.selectedFyEndYear,'dd MMM YYYY');
    this.item=item;


    
    if(this.uploadFileType === 'account' && item !=='20215' && item!=='20217') {
      this.getunits();
      // this.getFinYear()
      // this.updateEndYears()
      // this.getAccountssUploadedfiles();
      this.getAccountsUnits();
      this.getfinendingForpopup();
      // this.getAccountUploadedFilesAfterSubmit();
    }
    if(this.uploadFileType === 'nrlm'  && item!=='20215' && item!=='20217') {
      // this.getGridUploadedfiles();
      this.recordStatus = '99';
      this.getunits();
      this.getfinendingForpopup();
      // this.getFinYear();
      // this.getuploadedfiles();
    }

    if(  item =='20215'){
      this.getunits();
      this.getfinendingForpopup();
      // this.getaccountclosed();
      // this.getFinYear();
    }

    if(  item =='20217'){
      this.getunits();
      this.getfinendingForpopup();
      // this.getFinYear();
    }
    // this.editPermission = localStorage.getItem("editPermission")
    // this.editPermission = JSON.parse(this.editPermission?this.editPermission:'');
    console.log('this.tokenExpireyTime', this.tokenExpireyTime);
    let data: any = localStorage.getItem('sideNavbar');
    console.log('sideNavBarData', data);
    this.entitlements = JSON.parse(data ? data : '');
    console.log('Entitlements', this.entitlements);
    this.entitlements.forEach((elements: any) => {
      // debugger
      if (elements == 'View') {
        this.viewPermission = true;
      } else if (elements == 'Add') {
        this.AddPermission = true;
        this.changeLevelIden = false;
      } else if (elements == 'FileUpload') {
        this.uploadPermission = true;
      }  else if (elements == 'FileView') {
        this.fileView = true;
      }
      else if (elements == 'Edit') {
        this.EditPermission = true;
      }
      else if (elements == 'Delete') {
        this.deleteView = true;
      }  else if (elements == 'Authorize') {
        this.authorizePermission = true;
      }
      // Authorize
    });
    // localStorage.setItem('uploadFileType','account');
    // this.getqtrEnding()
    // this.getFinYear();
    // this.getunits();
    // this.getGridUploadedfiles()
    
    // this.updateEndYears();
    // this.onSelectFinancialYear()
  }

  viewEnity() {
    let accountDataStatusId:any;
    localStorage.setItem('uploadClosedDataStatusId',this.uploadClosedDataStatusId );

    localStorage.setItem('accountDataStatusId',accountDataStatusId );
    localStorage.setItem('entityData', 'viewData');
    // this.router.navigate(['/nrlm-upload-view-screen']);

    if(this.item=='20215'){
      this.router.navigate(['/view-accounts-closed']);

    }
    else{
      this.router.navigate(['/nrlm-upload-view-screen']);

    }
    // this.router.navigate(['/view-accounts-upload']);
  }
  viewEnityaccountClosed() {
    localStorage.setItem('uploadClosedDataStatusId',this.uploadClosedDataStatusId );
    localStorage.setItem('closedAccount', 'ClosedAccountView');
    // this.router.navigate(['/view-nrlm-upload']);
    this.router.navigate(['/nrlm-upload-view-screen']);
    // this.router.navigate(['/view-accounts-upload']);
  }
  viewAccountsEnity() {
    localStorage.setItem("accountsView",'uploadView');
    this.router.navigate(['/view-accounts-upload']);
  }

  viewclaimsaccount() {
    // this.claimsDataStatusId=this.celldata.claimsDataStatusId
    localStorage.setItem("claimsDataStatusId",this.celldata.claimsDataStatusId)
    this.router.navigate(['/view-claims']);
  }
  uploadFileData: any = [];

  // GetUploadFiles() {
  //   this.spinner.show();
  //   this.entityService.getUploadFiles().subscribe(
  //     (res: any) => {
  //       this.spinner.hide();
  //       console.log('UploadFileResponse', res);
  //       if (res) {
  //         this.uploadFileData = res?.data;
  //         console.log('uploadFileData', this.uploadFileData);
  //       }
  //     },
  //     (err: any) => {
  //       console.log('ErrorMessage', err.error.message);
  //     }
  //   );
  // }

  // upload files
  selectedFilename:any;
  uploadFile() {
    // this.spinner.show();
    if (this.selectedFile) {
      // let newSize = (this.selectedFile.size)/1000000000 ;
      // if(newSize >= 0.003) {
      // this.sizeExceed = true;
      // alert("Sizee Exceed")
      // }
       this.selectedFile.name;
      let selectedFile = this.selectedFile;
      let selectedFileName = this.selectedFile.name;
      let datas =  this.qtrselected;
      let isAllowed;
      this.qtrselected =  datas;
      let operation;
      if(this.uploadFileType=='nrlm'){
        operation = 1
      }
      if(this.uploadFileType=='account'){
        operation = 2;
      }
      if(this.item=='20215'){
        operation = 3;
      }
      if(this.item =='20217'){
        operation = 4;
      }
      this.qtrselected =  this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
      this.entityService.getuploadpermissionstatus(operation,this.recordStatus,this.qtrselected).subscribe((res: any)=>{

         console.log(res);
         isAllowed = res.data.isAllowed;
         let message = res.data.message;
         console.log(res);
         console.log(isAllowed);
         console.log(message);
  
         if(isAllowed == 1){
            this.LstUpdateQtrData = res.data;
             console.log("LastUpdatedQtrData",this.LstUpdateQtrData)
             let fileName: any = selectedFileName;
             var formdata = new FormData();
             formdata.append('inputFile', selectedFile, fileName);
             console.log(this.parentUnit, this.Level,formdata);
             this.spinner.show();
             let QtrEnd = this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
             let fyEnd = this.datepipe.transform(this.selectedFyEndDate,'dd-MM-yyyy');
             this.entityService.getUploadedFiles(this.recordStatus ,QtrEnd,fyEnd).subscribe(
               (res: any) => {
                 console.log('uploadedfiles', res);
                 //need o change from backend res.succes== true
                 if (res.success === true) {
                   // this.spinner.hide();
                   this.uploadedfiles = res?.data;
                   console.log("UploadedShGFiles",this.uploadedfiles);
                   this.ErrRejectRecord = this.uploadedfiles?.find((row: { uploadStatus: any }) => row?.uploadStatus === 'Rejected'|| row?.uploadStatus === 'R'||row?.uploadStatus === 'E' || row?.uploadStatus === 'Error' || row?.uploadStatus === 'P'|| row?.uploadStatus === 'S'|| row?.uploadStatus === 'A');
                   console.log("ErrRejectRecord",this.ErrRejectRecord);
                   console.log('getUploadedFiles', this.uploadedfiles);
                   if(this.ErrRejectRecord?.uploadStatus === 'Rejected'||this.ErrRejectRecord?.uploadStatus === 'R' || this.ErrRejectRecord?.uploadStatus === 'Error'|| this.ErrRejectRecord?.uploadStatus === 'E') {
                     this.entityService.DeleteuploadNrlm(this.ErrRejectRecord?.uploadShgCodesDataStatusId)
                     .subscribe(
                       (res: any) => {
                         if (res.success == true) {
                           this.entityService.uploadNrlmData(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                             (res: any) => {
                               console.log("Selected File Response:", res);
                               if(res.success == true) {
                                //  this.spinner.hide()
                                //  this.entityGridService.filter('Register click')
                                //  window.location.reload()
                                localStorage.setItem("RateAllowedPopup",res.message);
                                localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                                this.spinner.hide()
                                this.errordialog?.openDialog();
                               }
                               else if(res.success == false) {
                                //  alert(res.message);
                                //  this.spinner.hide()
                                //  window.location.reload()
                                alert("line 828")
                                localStorage.setItem("RateAllowedPopup",res.message);
                                localStorage.setItem("PopupMaitainance",'NrlmUpload');
                                this.spinner.hide()
                                this.errordialog?.openDialog();
                               }
                               else{
                                // alert(res.message)
                               }
                                 }    );
                         }
                       },
                     );
                   }
                   else if(this.ErrRejectRecord?.uploadStatus === 'A') {
                     this.spinner.show();
                     this.entityService.uploadNrlmData(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                       (res: any) => {
                         console.log("Selected File Response:", res);
                         if(res.success == true) {
                           this.spinner.hide();
                           localStorage.setItem("RateAllowedPopup",res.message);
                           localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                           this.errordialog?.openDialog();
                           this.entityGridService.filter('Register click')
                         //  window.location.reload()
                         }
                         else if(res.success == false) {
                          // alert(res.message);
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUpload');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                         //  window.location.reload()
                         }
                         else{
                          //  alert(res.message);
                          //  localStorage.setItem("RateAllowedPopup",res.message);
                          //  localStorage.setItem("PopupMaitainance",'NrlmUpload');
                          //  this.errordialog?.openDialog();
                         }
                           }    );
                   }
                   else if(this.ErrRejectRecord?.uploadStatus ==='S') {
                    //alert("File Already Exist Pending Authorisation");
                    const message = "File Already Exist Pending Authorisation"
                    localStorage.setItem("RateAllowedPopup",message);
                    localStorage.setItem("PopupMaitainance",'NrlmUpload');
                    this.spinner.hide();
                    this.errordialog?.openDialog();
                    // window.location.reload()
                  }
                  else if(this.ErrRejectRecord?.uploadStatus ==='P') {
                    //alert("File is being uploaded by another user");
                    const message = "File is being uploaded by another user";
                    localStorage.setItem("RateAllowedPopup",message);
                    localStorage.setItem("PopupMaitainance",'NrlmUpload');
                    this.spinner.hide();
                    this.errordialog?.openDialog();
                    // window.location.reload()
                  }
                  else {
                   // alert(res.message);
                   localStorage.setItem("RateAllowedPopup",res.message);
                   localStorage.setItem("PopupMaitainance",'NrlmUpload');
                   this.spinner.hide();
                   this.errordialog?.openDialog();
                    // window.location.reload()
                  }
                 }
                 if(res.success === false) {
                  if(this.ErrRejectRecord=== undefined) {
                    console.log("UploadedShGFiles",this.uploadedfiles);
                    console.log("ErrRejectRecord",this.ErrRejectRecord);
                    this.spinner.show()
                    this.entityService.uploadNrlmData(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                      (res: any) => {
                        this.spinner.show()
                        console.log("Selected File Response:", res);
                        if(res.success == true) {
                          // this.GetUploadFiles();
                          this.entityGridService.filter('Register click')
                          // this.spinner.hide()
                          //  window.location.reload()
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                        }
                       else if(res.success == false) {
                       //   alert(res.message);
                       localStorage.setItem("RateAllowedPopup",res.message);
                       localStorage.setItem("PopupMaitainance",'NrlmUpload');
                       this.spinner.hide()
                       this.errordialog?.openDialog();                
                        //window.location.reload()
                        }
                        else{
                          // alert(res.message)
                        }
                          }    );
                  }
                }
               },
               (err: any) => {
                 this.spinner.hide();
                 console.log('ErrorMessage', err.error.message);
               }
             );
         }else{
          localStorage.setItem("RateAllowedPopup",res.data.message);
          localStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.spinner.hide();
          this.errordialog?.openDialog();
         // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
         }
      });
    } else {
      console.log('No file selected!');
    }
  }
  uploadAccountFile() {
    // this.spinner.show();
    let QtrEnd = this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
    let fyEnd = this.datepipe.transform(this.selectedFyEndDate,'dd-MM-yyyy');
    if (this.selectedFile) {
      // let newSize = (this.selectedFile.size)/1000000000 ;
      // if(newSize >= 0.001) {
      // alert("File Size Exceed");
      // }
      let selectedFile = this.selectedFile;
      let selectedFileName = this.selectedFile.name;
      let datas =  this.qtrselected;
      let isAllowed;
      this.qtrselected =  datas;
      let operation;
      if(this.uploadFileType=='nrlm'){
        operation = 1
      }
      if(this.uploadFileType=='account'){
        operation = 2;
      }
      if(this.item=='20215'){
        operation = 3;
      }
      if(this.item =='20217'){
        operation = 4;
      }
      this.qtrselected =  this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
      this.entityService.getuploadpermissionstatus(operation,this.recordStatus,this.qtrselected).subscribe((res: any)=>{
         console.log(res);
         isAllowed = res.data.isAllowed;
         console.log(isAllowed);
  
         if(isAllowed == 1){
          let fileName: any = selectedFileName;
          var formdata = new FormData();
          formdata.append('inputFile', selectedFile, fileName);
          let QtrEnd = this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
          let fyEnd = this.datepipe.transform(this.selectedFyEndDate,'dd-MM-yyyy');
          this.entityService.getAccountsUploadedFilesAfterSubmit(this.recordStatus ,QtrEnd,fyEnd).subscribe(
            (res: any) => {
              // this.spinner.hide();
              console.log('uploadedfiles', res);
              if (res.success === true) {
                this.uploadedfiles = res?.data;
                console.log("UploadedShGFiles",this.uploadedfiles);
                this.ErrRejectRecord = this.uploadedfiles?.find((row: { uploadStatus: any }) => row?.uploadStatus === 'Rejected'|| row?.uploadStatus === 'R'||row?.uploadStatus === 'E' || row?.uploadStatus === 'Error' || row?.uploadStatus === 'P'|| row?.uploadStatus === 'S'|| row?.uploadStatus === 'A');
                console.log("ErrRejectRecord",this.ErrRejectRecord);
                if(this.ErrRejectRecord?.uploadStatus === 'Rejected' || this.ErrRejectRecord?.uploadStatus === 'R'|| this.ErrRejectRecord?.uploadStatus === 'Error' || this.ErrRejectRecord?.uploadStatus === 'E') {
                  // alert(this.ErrRejectRecord.uploadStatus)
                  console.log("ErrRejectedFileStts",this.ErrRejectRecord.uploadStatus);
                  console.log("ErrRejectedFile",this.ErrRejectRecord)
                  this.spinner.show();
                  this.entityService.DeleteuploadAccounts(this.ErrRejectRecord.accountDataStatusId)
                  .subscribe(
                    (res: any) => {
                      if (res.success == true) {
                        this.entityService.uploadAccountsData(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                          (res: any) => {
                            console.log("Selected File Response:", res);
                            if(res.success == true) {
                              this.spinner.hide();
                              // this.GetUploadFiles();
                              this.entityGridService.filter('Register click')
                             // window.location.reload()
                             localStorage.setItem("RateAllowedPopup",res.message);
                             localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                             this.spinner.hide()
                             this.errordialog?.openDialog();
                            }
                            else if(res.success == false) {
                              // alert(res.message);
                              // this.spinner.hide()
                              // window.location.reload()
                              localStorage.setItem("RateAllowedPopup",res.message);
                              localStorage.setItem("PopupMaitainance",'NrlmUpload');
                              this.spinner.hide()
                              this.errordialog?.openDialog();
                            }
                            else{
                              // alert(res.message)
                            }
                              }    );
                      }
                    },
                  );
                }
                else if(this.ErrRejectRecord?.uploadStatus==='A') {
                  console.log("UploadedShGFiles",this.uploadedfiles);
                  console.log("ErrRejectRecord",this.ErrRejectRecord);
                  this.spinner.show()
                  this.entityService.uploadAccountsData(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                    (res: any) => {
                      this.spinner.show()
                      console.log("Selected File Response:", res);
                      if(res.success == true) {
                        // this.GetUploadFiles();
                        // this.entityGridService.filter('Register click')
                        // this.spinner.hide()
                        // window.location.reload()
                        localStorage.setItem("RateAllowedPopup",res.message);
                        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                        this.spinner.hide()
                        this.errordialog?.openDialog();
                      }
                      else if(res.success == false) {
                        // alert(res.message);
                        // this.spinner.hide()
                        // window.location.reload()
                        localStorage.setItem("RateAllowedPopup",res.message);
                        localStorage.setItem("PopupMaitainance",'NrlmUpload');
                        this.spinner.hide()
                        this.errordialog?.openDialog();
                      }
                      else{
                        // alert(res.message)
                      }
                        }    );
                }
                else if(this.ErrRejectRecord?.uploadStatus ==='S') {
                  // alert("File Already Exist Pending Authorisation");
                  // window.location.reload();
                  const message = "File Already Exist Pending Authorisation";
                  localStorage.setItem("RateAllowedPopup",message);
                  localStorage.setItem("PopupMaitainance",'NrlmUpload');
                  this.spinner.hide()
                  this.errordialog?.openDialog();
                }
                else if(this.ErrRejectRecord?.uploadStatus ==='P') {
                  // alert("File is being uploaded by another user");
                  // window.location.reload();
                  const message = "File is being uploaded by another user";
                  localStorage.setItem("RateAllowedPopup",message);
                  localStorage.setItem("PopupMaitainance",'NrlmUpload');
                  this.spinner.hide()
                  this.errordialog?.openDialog();
                }
                else {
                  // alert(res.message);
                  // window.location.reload()
                  localStorage.setItem("RateAllowedPopup",res.message);
                  localStorage.setItem("PopupMaitainance",'NrlmUpload');
                  this.spinner.hide()
                  this.errordialog?.openDialog();
                }
              }
              if(res.success === false) {
                if(this.ErrRejectRecord=== undefined) {
                  console.log("UploadedShGFiles",this.uploadedfiles);
                  console.log("ErrRejectRecord",this.ErrRejectRecord);
                  this.spinner.show()
                  this.entityService.uploadAccountsData(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                    (res: any) => {
                      this.spinner.show()
                      console.log("Selected File Response:", res);
                      if(res.success == true) {
                        // this.GetUploadFiles();
                        this.entityGridService.filter('Register click')
                        // this.spinner.hide()
                        // window.location.reload()
                        localStorage.setItem("RateAllowedPopup",res.message);
                        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                        this.spinner.hide()
                        this.errordialog?.openDialog();
                      }
                      else if(res.success == false) {
                        // alert(res.message);
                        // this.spinner.hide()
                        localStorage.setItem("RateAllowedPopup",res.message);
                        localStorage.setItem("PopupMaitainance",'NrlmUpload');
                        this.spinner.hide()
                        this.errordialog?.openDialog();
                        // window.location.reload()
                      }
                      else{
                      //  alert(res.message)
                      }
                        }    );
                }
              }
            },
            (err: any) => {
              console.log('ErrorMessage', err.error.message);
            }
          );
         }else{
          localStorage.setItem("RateAllowedPopup",res.data.message);
          localStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.spinner.hide();
          this.errordialog?.openDialog();
         // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
         }
      });

    } else {
      console.log('No file selected!');
    }
  }

  uploadclosedAccounts() {
    // this.spinner.show();
    if (this.selectedFile) {




      let fileName: any = this.selectedFile.name;
      var formdata = new FormData();
      formdata.append('inputFile', this.selectedFile, fileName);
      // console.log(this.parentUnit, this.Level,formdata);
    console.log("ErrRejectRecord",this.ErrRejectRecord)
      if(this.selectedFile) {

        let datas =  this.qtrselected;
        let isAllowed;
        this.qtrselected =  datas;
        let operation;
        if(this.uploadFileType=='nrlm'){
          operation = 1
        }
        if(this.uploadFileType=='account'){
          operation = 2;
        }
        if(this.item=='20215'){
          operation = 3;
        }
        if(this.item =='20217'){
          operation = 4;
        }
        this.qtrselected =  this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
        this.entityService.getuploadpermissionstatus(operation,this.recordStatus,this.qtrselected).subscribe((res: any)=>{
           console.log(res);
           isAllowed = res.data.isAllowed;
           console.log(isAllowed);
    
           if(isAllowed == 1){
            let QtrEnd = this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
            let fyEnd = this.datepipe.transform(this.selectedFyEndDate,'dd-MM-yyyy');
            this.entityService.getclosedFiles(this.recordStatus ,QtrEnd,fyEnd).subscribe(
              (res: any) => {
                // this.spinner.hide();
                console.log('uploadedfiles', res);
                if (res.data != null) {
                  this.uploadedfiles = res?.data;
                  console.log("UploadedShGFiles",this.uploadedfiles);
                  this.ErrRejectRecord = this.uploadedfiles?.find((row: { uploadStatus: any }) => row?.uploadStatus === 'Rejected'|| row?.uploadStatus === 'R'||row?.uploadStatus === 'E' || row?.uploadStatus === 'Error'|| row?.uploadStatus === 'P'|| row?.uploadStatus === 'S'|| row?.uploadStatus === 'A');
                  console.log("ErrRejectRecord",this.ErrRejectRecord);
                  if(this.ErrRejectRecord?.uploadStatus === 'Rejected' || this.ErrRejectRecord?.uploadStatus === 'R'|| this.ErrRejectRecord?.uploadStatus === 'Error' || this.ErrRejectRecord?.uploadStatus === 'E') {
                    // alert(this.ErrRejectRecord.uploadStatus)
                    console.log("ErrRejectedFileStts",this.ErrRejectRecord.uploadStatus);
                    console.log("ErrRejectedFile",this.ErrRejectRecord)
                    this.spinner.show();
                    this.entityService.DeleteCloseduploadAccounts(this.ErrRejectRecord.uploadClosedDataStatusId)
                      .subscribe(
                        (res: any) => {
                          if (res.success == true) {
    
                            this.entityService.uploadclosedAccounts(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                              (res: any) => {
                                // this.spinner.show()
                                console.log("Selected File Response:", res);
                                if(res.success == true) {
                                  // this.GetUploadFiles();
                                  this.entityGridService.filter('Register click')
                                  // this.spinner.hide()
                                  // window.location.reload()
                                  localStorage.setItem("RateAllowedPopup",res.message);
                                  localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                                  this.spinner.hide()
                                  this.errordialog?.openDialog();
                                }
                                else if(res.success == false) {
                                  // alert(res.message);
                                  // this.spinner.hide()
                                  // window.location.reload()
                                  localStorage.setItem("RateAllowedPopup",res.message);
                                  localStorage.setItem("PopupMaitainance",'NrlmUpload');
                                  this.spinner.hide()
                                  this.errordialog?.openDialog();
                                }
                                else{
                                //  alert(res.message)
                                }
                                  }    );
                            window.location.reload()
                          }
                          if(res.success === false) {
                           // alert(res.message);
                           localStorage.setItem("RateAllowedPopup",res.message);
                           localStorage.setItem("PopupMaitainance",'NrlmUpload');
                           this.spinner.hide()
                           this.errordialog?.openDialog();
                          }
                          console.log('uploadedfiles', res);
                        },
                        (err: any) => {
                          console.log('ErrorMessage', err.error.message);
                        }
                      );
    
                  }
                  else if(this.ErrRejectRecord?.uploadStatus=== 'A') {
                    console.log("UploadedShGFiles",this.uploadedfiles);
                    console.log("ErrRejectRecord",this.ErrRejectRecord);
                    this.spinner.show()
                    this.entityService.uploadclosedAccounts(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                      (res: any) => {
                        // this.spinner.show()
                        console.log("Selected File Response:", res);
                        if(res.success == true) {
                          // this.GetUploadFiles();
                          this.entityGridService.filter('Register click')
                          // this.spinner.hide()
                          // window.location.reload()
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                        }
                        else if(res.success == false) {
                          // alert(res.message);
                          // this.spinner.hide()
                          // window.location.reload()
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUpload');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                        }
                        else{
                        //  alert(res.message)
                        }
                          }    );
                  }
                  else if(this.ErrRejectRecord?.uploadStatus ==='S') {
                    // alert("File Already Exist Pending Authorisation");
                    // window.location.reload();
                    const message = "File Already Exist Pending Authorisation";
                    localStorage.setItem("RateAllowedPopup", message);
                    localStorage.setItem("PopupMaitainance",'NrlmUpload');
                    this.spinner.hide()
                    this.errordialog?.openDialog();
                  }
                  else if(this.ErrRejectRecord?.uploadStatus ==='P') {
                    // alert("File is being uploaded by another user");
                    // window.location.reload()
                    const message = "File is being uploaded by another user"
                    localStorage.setItem("RateAllowedPopup", message);
                    localStorage.setItem("PopupMaitainance",'NrlmUpload');
                    this.spinner.hide()
                    this.errordialog?.openDialog();
                  }
                  else {
                    // alert(res.message);
                    // window.location.reload()
                    localStorage.setItem("RateAllowedPopup",res.message);
                    localStorage.setItem("PopupMaitainance",'NrlmUpload');
                    this.spinner.hide()
                    this.errordialog?.openDialog();
                  }
                }
                if(res.data === null) {
                  if(this.ErrRejectRecord=== undefined) {
                    console.log("UploadedShGFiles",this.uploadedfiles);
                    console.log("ErrRejectRecord",this.ErrRejectRecord);
                    this.spinner.show()
                    this.entityService.uploadclosedAccounts(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                      (res: any) => {
                        // this.spinner.show()
                        console.log("Selected File Response:", res);
                        if(res.success == true) {
                          // this.GetUploadFiles();
                          this.entityGridService.filter('Register click')
                          // this.spinner.hide()
                          // window.location.reload()
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                        }
                        else if(res.success == false) {
                          // alert(res.message);
                          // this.spinner.hide()
                          // window.location.reload()
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUpload');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                        }
                        else{
                        //  alert(res.message)
                        }
                          }    );
                  }
                }
              },
              (err: any) => {
                this.spinner.hide();
                alert(err.error.message)
                console.log('ErrorMessage', err.error.message);
              }
            );
           }else{
            localStorage.setItem("RateAllowedPopup",res.data.message);
            localStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
           // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
           }
        });
      }
      else {
        console.log('No file selected!');
      }
    }
  }

  uploadClaimUpload() {
    if (this.selectedFile) {
      let fileName: any = this.selectedFile.name;
      var formdata = new FormData();
      formdata.append('inputFile', this.selectedFile, fileName);
      // console.log(this.parentUnit, this.Level,formdata);
    console.log("ErrRejectRecord",this.ErrRejectRecord)
      if(this.selectedFile) {
        this.spinner.show();
        // if(this.recordStatus == '99') {
          // this.entityService.uploadclaimedAccounts(this.fyendyearpopup,this.qtrselected,formdata).subscribe(
          //   (res: any) => {
          //     // this.spinner.show()
          //     console.log("Selected File Response:", res);
          //     if(res.success == true) {
          //       // this.GetUploadFiles();
          //       this.entityGridService.filter('Register click')
          //       alert("File uploaded successfully!");
          //       this.spinner.hide()
          //       window.location.reload()
          //     }
          //     if(res.success == false) {
          //       alert(res.message);
          //       this.spinner.hide()
          //       window.location.reload()
          //     }
          //     else{
          //       alert(res.message)
          //     }
          //       }    );
        // }
        let datas =  this.qtrselected;
        let isAllowed;
        this.qtrselected =  datas;
        let operation;
        if(this.uploadFileType=='nrlm'){
          operation = 1
        }
        if(this.uploadFileType=='account'){
          operation = 2;
        }
        if(this.item=='20215'){
          operation = 3;
        }
        if(this.item =='20217'){
          operation = 4;
        }
        this.qtrselected =  this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
        this.entityService.getuploadpermissionstatus(operation,this.recordStatus,this.qtrselected).subscribe((res: any)=>{
           console.log(res);
           isAllowed = res.data.isAllowed;
           console.log(isAllowed);
    
           if(isAllowed == 1){
      let QtrEnd = this.datepipe.transform(this.selectedQtrEndDate,'dd-MM-yyyy');
      let fyEnd = this.datepipe.transform(this.selectedFyEndDate,'dd-MM-yyyy');
 this.entityService.getclaimsFiles(this.recordStatus ,QtrEnd,fyEnd).subscribe(
   (res: any) => {
     this.spinner.hide();
     console.log('uploadedfiles', res);
     if (res.success === true) {
       this.uploadedfiles = res?.data;
       console.log("UploadedShGFiles",this.uploadedfiles);
       this.ErrRejectRecord = this.uploadedfiles?.find((row: { uploadStatus: any }) => row?.uploadStatus === 'Rejected'|| row?.uploadStatus === 'R'||row?.uploadStatus === 'E' || row?.uploadStatus === 'Error'|| row?.uploadStatus === 'P'|| row?.uploadStatus === 'S'|| row?.uploadStatus === 'A');
       console.log("ErrRejectRecord",this.ErrRejectRecord);
       if(this.ErrRejectRecord?.uploadStatus === 'Rejected' || this.ErrRejectRecord?.uploadStatus === 'R'|| this.ErrRejectRecord?.uploadStatus === 'Error' || this.ErrRejectRecord?.uploadStatus === 'E') {
         // alert(this.ErrRejectRecord.uploadStatus)
         console.log("ErrRejectedFileStts",this.ErrRejectRecord.claimsDataStatusId);
         console.log("ErrRejectedFile",this.ErrRejectRecord)
         this.spinner.show();
         this.entityService.DeleteClaimsUpload(this.ErrRejectRecord.claimsDataStatusId).subscribe(
           (res: any) => {
             if (res.success == true) {
                   console.log("Selected File Response:", res);
                     this.entityService.uploadclaimedAccounts(this.recordStatus ,this.fyendyearpopup,this.qtrselected,formdata).subscribe(
                       (res: any) => {
                         console.log("Selected File Response:", res);
                         if(res.success == true) {
                           // this.GetUploadFiles();
                          // alert(res.message)
                           this.entityGridService.filter('Register click');
                           localStorage.setItem("RateAllowedPopup",res.message);
                           localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                           this.spinner.hide()
                           this.errordialog?.openDialog();
                          //  this.spinner.hide()
                          //  window.location.reload()
                         }
                         else if(res.success == false) {
                          //  alert(res.message);
                          //  this.spinner.hide()
                          //  window.location.reload()
                          localStorage.setItem("RateAllowedPopup",res.message);
                          localStorage.setItem("PopupMaitainance",'NrlmUpload');
                          this.spinner.hide()
                          this.errordialog?.openDialog();
                         }
                         else{
                          // alert(res.message)
                         }
                           }    );
             }
             else {
              //  alert(res.message);
              //  window.location.reload();
              localStorage.setItem("RateAllowedPopup",res.message);
              localStorage.setItem("PopupMaitainance",'NrlmUpload');
              this.spinner.hide()
              this.errordialog?.openDialog();
             }
           },
         );

       }
       else if(this.ErrRejectRecord?.uploadStatus=== 'A') {
         console.log("UploadedShGFiles",this.uploadedfiles);
         console.log("ErrRejectRecord",this.ErrRejectRecord);
         this.spinner.show()
         this.entityService.uploadclaimedAccounts(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
           (res: any) => {
             console.log("Selected File Response:", res);
             if(res.success == true) {
               // this.GetUploadFiles();
              //  this.entityGridService.filter('Register click')
              //  this.spinner.hide()
              //  window.location.reload()
              localStorage.setItem("RateAllowedPopup",res.message);
              localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
              this.spinner.hide();
              this.errordialog?.openDialog();
             }
             else if(res.success == false) {
              //  alert(res.message);
              //  this.spinner.hide()
              //  window.location.reload()
              localStorage.setItem("RateAllowedPopup",res.message);
              localStorage.setItem("PopupMaitainance",'NrlmUpload');
              this.spinner.hide();
              this.errordialog?.openDialog();
             }
             else{
              // alert(res.message)
             }
               }    );
       }
       else if(this.ErrRejectRecord?.uploadStatus ==='S') {
        // alert("File Already Exist Pending Authorisation");
        // window.location.reload()
        const message = "File Already Exist Pending Authorisation"
        localStorage.setItem("RateAllowedPopup",message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.spinner.hide();
        this.errordialog?.openDialog();
        
      }
      else if(this.ErrRejectRecord?.uploadStatus ==='P') {
        // alert("File is being uploaded by another user");
        // window.location.reload()
        const message = "File is being uploaded by another user";
        localStorage.setItem("RateAllowedPopup",message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.spinner.hide();
        this.errordialog?.openDialog();
      }
      else {
        // alert(res.message);
        // window.location.reload()
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.spinner.hide();
        this.errordialog?.openDialog();
      }
     }
     if(res.success === false) {
       if(this.ErrRejectRecord=== undefined) {
         console.log("UploadedShGFiles",this.uploadedfiles);
         console.log("ErrRejectRecord",this.ErrRejectRecord);
         this.spinner.show()
         this.entityService.uploadclaimedAccounts(this.recordStatus , this.fyendyearpopup,this.qtrselected,formdata).subscribe(
           (res: any) => {
             console.log("Selected File Response:", res);
             if(res.success == true) {
               // this.GetUploadFiles();
               this.entityGridService.filter('Register click')
              //  this.spinner.hide()
              //  window.location.reload()
              localStorage.setItem("RateAllowedPopup",res.message);
              localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
              this.spinner.hide();
              this.errordialog?.openDialog();
             }
             else if(res.success == false) {
              //  alert(res.message);
              //  this.spinner.hide()
              //  window.location.reload()
              localStorage.setItem("RateAllowedPopup",res.message);
              localStorage.setItem("PopupMaitainance",'NrlmUpload');
              this.spinner.hide();
              this.errordialog?.openDialog();
             }
             else{
             //  alert(res.message)
             }
               }    );
       }
     }
   },
   (err: any) => {
     console.log('ErrorMessage', err.error.message);
   }
 );
           }else{
            localStorage.setItem("RateAllowedPopup",res.data.message);
            localStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.spinner.hide();
            this.errordialog?.openDialog();
           // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
           }
        });
        // this.spinner.show()
      }
      else {
        console.log('No file selected!');
      }
    }
  }
  // select unit dropdown
  financialYear: any;
  getRecordStatus(event: any) {
    this.recordStatus = event.unit;
    this.selectedBank = this.recordStatus
    this.financialYear=  this.recordStatus;
    console.log("recordStatus", this.recordStatus);

  }
  uploadRecordStatus:any;
  selectedBank:any;
  getUploadRecordStatus() {
    this.uploadRecordStatus = this.selectedBank;
    this.financialYear=  this.uploadRecordStatus;
    console.log("uploadRecordStatus", this.uploadRecordStatus);

  }


  qtrselected:any='';
  LstUpdateQtrData:any;
  qtrEnding(){
    
    let datas =  this.qtrselected;
    let isAllowed;
    this.qtrselected =  datas;
    let operation;
    if(this.uploadFileType=='nrlm'){
      operation = 1
    }
    if(this.uploadFileType=='account'){
      operation = 2;
    }
    if(this.item=='20215'){
      operation = 3;
    }
    if(this.item =='20217'){
      operation = 4;
    }
    this.qtrselected =  this.datepipe.transform(datas,'dd-MM-yyyy');
    this.entityService.getuploadpermissionstatus(operation,this.recordStatus,this.qtrselected).subscribe((res: any)=>{
       console.log(res);
       isAllowed = res.data.isAllowed;
       console.log(isAllowed);

       if(isAllowed == 1){
        this.entityService.getUtilsLastUpdatedQtr(this.qtrselected,this.recordStatus).subscribe((res:any)=> {
          this.LstUpdateQtrData = res.data;
           console.log("LastUpdatedQtrData",this.LstUpdateQtrData)
          })
       }else{
        console.log("Not Allowed");
       }
    });



  }

  // file-Upload
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }
  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  //generate PDF
  generatePDF(_: any) {
    let printOptions = {
      PDF_HEADER_COLOR: '#f8f8f8',
      PDF_INNER_BORDER_COLOR: '#dde2eb',
      PDF_OUTER_BORDER_COLOR: '#babfc7',
      PDF_LOGO: '',
      PDF_PAGE_ORITENTATION: 'landscape',
      PDF_WITH_HEADER_IMAGE: false,
      PDF_WITH_FOOTER_PAGE_COUNT: true,
      PDF_HEADER_HEIGHT: 25,
      PDF_ROW_HEIGHT: 15,
      PDF_ODD_BKG_COLOR: '#fcfcfc',
      PDF_EVEN_BKG_COLOR: '#ffffff',
      PDF_WITH_CELL_FORMATTING: true,
      PDF_WITH_COLUMNS_AS_LINKS: true,
      PDF_SELECTED_ROWS_ONLY: false,
    };
    printDoc(printOptions, this.gridApi, this.gridColumnApi);
  }
  // download excel
  downloadExcel() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const exportParams = {
      fileName: `Files_${formattedDate}.csv`,
    };
    this.gridApi.exportDataAsCsv(exportParams);
  }

  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
  }
  onSearchChange($event: any, anything?: any) {
    console.log();
  }

  // onCell clicked
  showhided: boolean = false;
  celldata: any = [];
  uploadShgCodesDataStatusId: any;
  deletebutton:boolean=false
  checker:any;
  maker:any;
  uploadstatus:any
  uploadClosedDataStatusId:any;
  claimsDataStatusId:any;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    this.celldata = event.data;
    console.log("cellData",this.celldata);
    localStorage.setItem("SelectedCelldata",JSON.stringify(this.celldata));
    localStorage.setItem('idfordownload',this.celldata.uploadShgCodesDataStatusId)
localStorage.setItem('idfordownloadclaimsDataStatusId',this.celldata.claimsDataStatusId)
// alert(this.celldata.claimsDataStatusId)
    if(this.item=='20215'){
      console.log("CellData",this.celldata);
      let accountParentUnit = this.celldata.bank;
      accountParentUnit = accountParentUnit.split('-')
      accountParentUnit = accountParentUnit[0].trim();
      localStorage.setItem("ClosedAccountsBank",accountParentUnit);
this.uploadClosedDataStatusId=this.celldata.uploadClosedDataStatusId;
localStorage.setItem("uploadClosedDataStatusId",this.celldata.uploadClosedDataStatusId);
this.uploadClosedDataStatusId=event.data.uploadClosedDataStatusId;  
    localStorage.setItem('idfordownload',this.uploadClosedDataStatusId)

    }


    if(this.item=='20217'){
      this.claimsDataStatusId=this.celldata.claimsDataStatusId
      let bankCode = this.celldata?.bank?.split('-')[0];
      localStorage.setItem("bankCode",bankCode);
      localStorage.setItem("claimsDataStatusId",this.celldata.claimsDataStatusId)
    }
    localStorage.setItem("AccountsView",this.celldata.accountDataStatusId);
    let accountParentUnit = this.celldata.bank;
    accountParentUnit = accountParentUnit.split('-')
    accountParentUnit = accountParentUnit[0];
    localStorage.setItem("claimsDataStatusId",this.celldata.claimsDataStatusId)
    // alert(this.celldata.claimsDataStatusId)
    localStorage.setItem('upload_Details', JSON.stringify(event.data));
    localStorage.setItem('upload_accounts_Details', JSON.stringify(accountParentUnit));
    // authorization for checker maker and uploadstatus
    this.checker = localStorage.getItem('UserId')
    this.maker = event.data.maker
    console.log("CellData",this.celldata);
    this.uploadstatus = event.data.uploadStatus
    localStorage.setItem('upload_Details', JSON.stringify(event.data)); // don't change this 
    console.log(event.data);
    if(this.uploadstatus === 'Error' || this.uploadstatus ==='Rejected'){
      this.deletebutton=true
    }
    else{
      this.deletebutton=false

    }
    this.uploadShgCodesDataStatusId = event.data.uploadShgCodesDataStatusId;
    console.log("uploadAccountsDataStatusId",event.data.accountDataStatusId);
    localStorage.setItem('uploadAccountsDataStatusId',event.data.accountDataStatusId);
    localStorage.setItem('uploadShgCodesDataStatusId',this.uploadShgCodesDataStatusId);

    let unitCode = event.data.unit;
    this.disabledFields = false;
  }

  // file-download NRLM
  onBtnExport() {
      this.spinner.show();
      console.log('statusId', this.celldata.uploadShgCodesDataStatusId);
      let isCSV = true; 
      this.entityService
        .shgdownloadfile(this.celldata.uploadShgCodesDataStatusId, isCSV)
        .subscribe((res: any) => {
          console.log(res);
          const newFileExtension = isCSV ? 'csv' : 'xlsx';
          const mimeType = isCSV ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          const blob = new Blob([res.body], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileNameWithNewExtension = this.celldata.fileName.replace(/\.[^.]+$/, `.${newFileExtension}`);
          link.download = `${fileNameWithNewExtension}`;
          link.click();
          window.URL.revokeObjectURL(url);
          this.spinner.hide();
        });
    }
//File Download Accounts
onAccountBtnExport() {
  this.spinner.show();
  console.log('statusId', this.celldata.accountDataStatusId);
  this.entityService
    .accountdownloadfile(this.celldata.accountDataStatusId)
    .subscribe((res: any) => {
      console.log(res);
      const blob = new Blob([res.body], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.celldata.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      this.spinner.hide();
    });
}
onAccountcloseBtnExport() {
  this.spinner.show();
  console.log('statusId', this.celldata.accountDataStatusId);
  this.entityService
    .accountdownloadClose(this.celldata.uploadClosedDataStatusId)
    .subscribe((res: any) => {
    
      console.log(res);
      const blob = new Blob([res.body], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.celldata.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      this.spinner.hide();
    });

}

onclaimdataexport() {
  this.spinner.show();
  console.log('statusId', this.celldata.accountDataStatusId);
  this.entityService
    .claimsAccountDownload(this.celldata.claimsDataStatusId)
    .subscribe((res: any) => {
    
      console.log(res);
      const blob = new Blob([res.body], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.celldata.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      this.spinner.hide();
    });

}
  // getsUnits Info
  unitsData: any = [];
  getunits() {
    this.entityService.getUnitsInfo().subscribe(
      (res: any) => {
        if (res.success === true) {
          if(res?.data.length === 1) {
            this.unitsData = res?.data;
            this.unitsUploadData = res?.data;
            console.log('getUnits', this.unitsUploadData);
            console.log("UnitsData",this.unitsData)
            this.recordStatus = this.unitsData[0].unit;
            this.selectedBank = this.recordStatus;
          }
          else {
            this.entityService.getUnitsInfo().subscribe(
              (res: any) => {
                if (res.success === true) {
                  this.unitsUploadData = res?.data;
                  console.log('getUnits', this.unitsUploadData);
                }
              },
              (err: any) => {
                console.log('ErrorMessage', err.error.message);
              }
            );
            let allBank = {
              unit:'99',
              bank:'All'
            }
            this.unitsData = res?.data;
            this.unitsData.push(allBank);
            this.recordStatus = '99'
            console.log('getUnits', this.unitsData);
          }
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }
  fyendingDisabled:boolean=true
  getAccountsUnits() {
    this.entityService.getAccountsUnitsInfo().subscribe(
      (res: any) => {
        if (res.success === true) {
          this.unitsData = res?.data;
          console.log('getUnits', this.unitsData);
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }
  // getAccountsUnitsInfo()
  selectedQtrYear:any= [];
  updateEndYears() {
    // this.selectedEndYear='';
    this.endYears = [];
    let item =this.selectedFyEndYear;
    // let val=  item.map((dateString:any) => parseInt(dateString.split("-")[0]));;
    this.fystart= this.datepipe.transform(item,'dd-MM-YYYY')
    this.fyendingDisabled=false
    this.entityService.getQtYear(this.fystart).subscribe((res:any)=>{
      console.log(res);
      this.qtdata=res.data;
      this.selectedQtrYear = this.qtdata[0];
          })
    // console.log(val);
    console.log("default value",this.fystart);
    console.log(this.fystart);
// alert(this.fystart);
// alert(this.selectedEndYear)
// alert(this.fyend)
    // for (let year = Number(val)+1; year <= this.selectedEndYear; year++) {

    //   this.endYears.push(year);


   
    // }



  }


  // getFinYear(){
  //   this.entityService.getfinStartYear().subscribe((res:any)=>{
  //     console.log(res);

  //     // const yearArray = res.data.map((dateString:any) => parseInt(dateString.split("-")[0]));

  //     this.startYears= res.data;
  //     let StartYear =this.rolesToken.fyEndingDate;
  //     this.selectedFyEndYear = this.datepipe.transform(StartYear,'dd MMM YYYY')
  //     this.updateEndYears();
  //     console.log('this.startYears',this.startYears)
  //   })
  //   // this.onSelectFinancialYear();
  // }
  onSelectFinancialYear(){

    // let item =[this.selectedEndYear];
    // alert(item)
    // let val=  item.map((dateString:any) => parseInt(dateString.split("-")[0]));;

    this.fyend = this.datepipe.transform(this.selectedQtrYear,'dd-MM-YYY');
    console.log("FYEnd",this.fyend);
  }
  fyendyearpopup:any;
  qtdata:any=[]
  onSelectFinancialYearpopup(){
    let item:any;
     item =this.selectedFyEndDate;
      let selectedDate =   this.datepipe.transform(item, 'dd-MM-yyyy');
    this.fyendyearpopup = selectedDate;
    this.entityService.getQtYear(this.fyendyearpopup).subscribe((res:any)=>{
console.log(res);

this.uploadQtrData=res.data;
this.selectedQtrEndDate = this.uploadQtrData[0];
    })
    console.log("qtrDataa",this.fyend);
  }
  qtrData:any[]=[]
 getqtrEnding(){
    this.entityService.getqtrEnding().subscribe((res:any)=>{
      this.startYears=[res.data.pastYears]
      let start:any =[res.data.pastYears]
      let end:any = [res.data.curFyEnd]
      this.startYears = Array.from({ length: end - start + 1 }, (_, i) => end - i)
      let currfyend:any =res.data.curFyEnd
      // this.endYears = Array.from({ length: this.selectedFyEndYear -end + 1 }, (_, i) => this.selectedFyEndYear - i)
      // console.log('fyend',currfyend);
      // this.selectedFyEndYear = res.data.pastFyStart
      this.selectedEndYear = res.data.curFyEnd
      this. updateEndYears()
      this.onSelectFinancialYear()
      
      if (res.success === true) {

        let data=res?.data;
console.log("Dataaaaaaa",data)
        if(data.q1){
          let obj:any={
            'item':data.q1,
            'id':1
          }
          this.qtrData.push(obj)
        }

        if(data.q2){
          let obj:any={
            'item':data.q2
          }
          this.qtrData.push(obj)

        }


        if(data.q3){
          let obj:any={
            'item':data.q3
          }
          this.qtrData.push(obj)

        }

        if(data.q4){
          let obj:any={
            'item':data.q4
          }
          this.qtrData.push(obj)

        }
        // this.qtrData = res?.data;



        console.log("qtrData", this.qtrData);
      }
    },
      (err: any) => {
        console.log("ErrorMessage", err.error.message);
      }
    );
  } 
  // getUploadedFiles
  // getAccountsUploadedFilesAfterSubmit

  uploadedfiles: any = [];
  ErrRejectRecord:any;
  //Shg Upload Files
  getuploadedfiles() {
    console.log(this.recordStatus,this.fystart,this.fyend);
    this.fystart = this.datepipe.transform(this.selectedFyEndYear,'dd-MM-yyyy');
    this.fyend =  this.datepipe.transform(this.selectedQtrYear,'dd-MM-yyyy');
    this.spinner.show();
    if(this.recordStatus === '99') {
      this.entityService.getAllBanksUploadedFiles(this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            // alert(res.message)
            // this.getGridUploadedfiles();
            // window.location.reload()
            console.log('getUploadedFiles', this.uploadedfiles);
          }
          if( res.success === false) {
            this.uploadedfiles = [];
          }
  
          if(res.data == null){
  
            this.uploadedfiles = [];
  
          }
         
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    }
    else {
      this.entityService.getUploadedFiles(this.recordStatus,this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            // alert(res.message)
            // this.getGridUploadedfiles();
            // window.location.reload()
            console.log('getUploadedFiles', this.uploadedfiles);
          } else{
            // alert(res.message)
  
          }
  
          if(res.data == null){
  
            this.uploadedfiles = [];
  
          }
         
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    }
  }
  //get accounts upload file
  getAccountUploadedFilesAfterSubmit() {
    this.fystart = this.datepipe.transform(this.selectedFyEndYear,'dd-MM-yyyy');
    this.fyend =  this.datepipe.transform(this.selectedQtrYear,'dd-MM-yyyy');
    console.log(this.recordStatus,this.fystart,this.fyend);
    this.spinner.show();
    if(this.recordStatus=='99') {
      this.entityService.getAccountsUploadedFilesAllBanks(this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            console.log('getUploadedFiles', this.uploadedfiles);
          }
          if( res.success === false) {
            this.uploadedfiles = [];
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    } else {
      this.entityService.getAccountsUploadedFilesAfterSubmit(this.recordStatus,this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            // this.getGridUploadedfiles();
            // window.location.reload()
            console.log('getUploadedFiles', this.uploadedfiles);
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    }
  }
  getclosedaccountlist() {
    this.fystart = this.datepipe.transform(this.selectedFyEndYear,'dd-MM-yyyy');
    this.fyend =  this.datepipe.transform(this.selectedQtrYear,'dd-MM-yyyy');
    console.log(this.recordStatus,this.fystart,this.fyend);
    this.spinner.show();
    if(this.recordStatus === '99') {
      // getclosedFilesWithAllBanks
      this.entityService.getclosedFilesWithAllBanks(this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            // this.getGridUploadedfiles();
            // window.location.reload()
            console.log('getUploadedFiles', this.uploadedfiles);
          }
          if( res.success === false) {
            this.uploadedfiles = [];
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    }
    else {
      this.entityService.getclosedFiles(this.recordStatus,this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            // this.getGridUploadedfiles();
            // window.location.reload()
            console.log('getUploadedFiles', this.uploadedfiles);
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    }
  }



  getclaimedAccountlist() {
    this.fystart = this.datepipe.transform(this.selectedFyEndYear,'dd-MM-yyyy');
    this.fyend =  this.datepipe.transform(this.selectedQtrYear,'dd-MM-yyyy');
    console.log(this.recordStatus,this.fystart,this.fyend);
    this.spinner.show();
    if(this.recordStatus === '99') {
      // getclosedFilesWithAllBanks
      this.entityService.getAllclaimsFiles(this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            console.log('aaaaaagetUploadedFiles', this.uploadedfiles);
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    
    }
    else {
      this.entityService.getclaimsFiles(this.recordStatus,this.fyend,this.fyend).subscribe(
        (res: any) => {
          this.spinner.hide();
          console.log('uploadedfiles', res);
          if (res.success === true) {
            this.uploadedfiles = res?.data;
            // this.getGridUploadedfiles();
            // window.location.reload()
            console.log('gggggggetUploadedFiles', this.uploadedfiles);
          }
          if( res.success === false) {
            this.uploadedfiles = [];
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
    }
  }
// GridUploadedFiles
  getGridUploadedfiles() {
    this.spinner.show();
    this.entityService.getGridUploadedFiles().subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('uploadedfiles', res);
        if (res.success === true) {
          this.uploadedfiles = res?.data;
          console.log("UploadedShGFiles",this.uploadedfiles);
          // this.ErrRejectRecord = this.uploadedfiles.find((row: { uploadStatus: any }) => row.uploadStatus === 'Rejected'|| row.uploadStatus === 'Error');
          // console.log("ErrRejectRecord",this.ErrRejectRecord);
          // console.log('getUploadedFiles', this.uploadedfiles);
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }
  //GetAccountsUploadedFile

  getAccountssUploadedfiles() {
    this.spinner.show();
    this.entityService.getAccountsUploadedFiles().subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('uploadedfiles', res);
        if (res.success === true) {
          this.uploadedfiles = res?.data;
          // this.ErrRejectRecord = this.uploadedfiles.find((row: { uploadStatus: any }) => row.uploadStatus === 'Rejected'|| row.uploadStatus === 'R'|| row.uploadStatus === 'Error' || row.uploadStatus === 'E');
          // console.log("ErrRejectRecord",this.ErrRejectRecord);
          // console.log('getUploadedFiles', this.uploadedfiles);
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }

  getaccountclosed() {
    this.spinner.show();
    this.entityService.getclosedaccountdetails().subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('uploadedfiles', res);
        if (res.success === true) {
          this.uploadedfiles = res?.data;
          // this.ErrRejectRecord = this.uploadedfiles.find((row: { uploadStatus: any }) => row.uploadStatus === 'Rejected'|| row.uploadStatus === 'R'|| row.uploadStatus === 'Error' || row.uploadStatus === 'E');
          // console.log("ErrRejectRecord",this.ErrRejectRecord);
          // console.log('getUploadedFiles', this.uploadedfiles);
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }


  getclaimsData() {
    this.spinner.show();
    this.entityService.getAllclaimsFiles(this.fystart,this.fyend).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('uploadedfiles', res);
        if (res.success === true) {
          this.uploadedfiles = res?.data;
          console.log('getUploadedFiles', this.uploadedfiles);
        }
      },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }
  // getAccountsUploadedFiles()
  // getGridUploadedFiles()
  // delete uploaded files
  DeleteEntity() {
   console.log("its calling delete entity");
    localStorage.setItem('popupDelete', 'NRLMdelete');
    this.deletedialog?.openDialog();
    // const dialogRef =  this.dialog.open(WarningPopupComponent, {
    //   panelClass: 'AddUsersSuccessPop',
    //   hasBackdrop: true,
    //   backdropClass: 'backdropBackground',
    //   disableClose: false,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.getuploadedfiles();
    // });
   

  }
  DeleteClaimsUploadEntity() {

    localStorage.setItem('popupDelete', 'ClaimsUploaddelete');
    this.deletedialog?.openDialog();
    // const dialogRef =  this.dialog.open(WarningPopupComponent, {
    //   panelClass: 'AddUsersSuccessPop',
    //   hasBackdrop: true,
    //   backdropClass: 'backdropBackground',
    //   disableClose: false,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.getuploadedfiles();
    // });
   

  }
  DeleteAccountsData() {

    localStorage.setItem('popupDelete', 'Accountsdelete');
    this.deletedialog?.openDialog();
    // const dialogRef =  this.dialog.open(WarningPopupComponent, {
    //   panelClass: 'AddUsersSuccessPop',
    //   hasBackdrop: true,
    //   backdropClass: 'backdropBackground',
    //   disableClose: false,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   // this.getuploadedfiles();
    //   this.getAccountUploadedFilesAfterSubmit()
    // });
   

  }
  DeleteClosedAccountsData() {

    localStorage.setItem('popupDelete', 'ClosedAccountsdelete');
    this.deletedialog?.openDialog();
    // const dialogRef =  this.dialog.open(WarningPopupComponent, {
    //   panelClass: 'AddUsersSuccessPop',
    //   hasBackdrop: true,
    //   backdropClass: 'backdropBackground',
    //   disableClose: false,
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   // this.getuploadedfiles();
    //   // this.getAccountUploadedFilesAfterSubmit()
    //   this.getaccountclosed();
    // });
   

  }

  remarks: string = '';
  Authorize() {
    let uploaddetails = JSON.parse(
      localStorage.getItem('upload_Details') || 'null'
    );
    let isAuthorze = JSON.stringify(true);
    let parentUnitid = uploaddetails.parentUnitId;
    let remarks = this.remarks;
    this.spinner.show();
    this.entityService.Update_status( this.celldata.uploadShgCodesDataStatusId,isAuthorze, remarks).subscribe((res: any) => {
        if (res.success === true) {
          this.spinner.hide();
          localStorage.setItem("RateAllowedPopup",res.message);
          localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
          this.errordialog?.openDialog();
          console.log('Authorize Status', res);
          // window.location.reload();
        } else if (res.success === false) {
          this.spinner.hide();
          console.log('Authorize Status', res);
        }
      });
    // Reset the textarea value
    this.remarks = '';
  }
//AuthorizeAccount
    AuthorizeAccount() { 
  let uploaddetails = JSON.parse(
    localStorage.getItem('upload_accounts_Details') || 'null'
  );
  let isAuthorze = JSON.stringify(true);
  let parentUnitid = uploaddetails?.trim();
  let remarks = this.remarks;
this.spinner.show();
  this.entityService.update_account_status( this.celldata.accountDataStatusId,isAuthorze, remarks).subscribe((res: any) => {
      if (res.success === true) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
       // window.location.reload()
      } else if (res.success === false) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
      }
    });
  // Reset the textarea value
  this.remarks = '';
}
// AuthorizeClosedAccount()
AuthorizeClosedAccount() { 
  let uploaddetails = 
    // localStorage.setItem("ClosedAccountsBank",accountParentUnit);
    // localStorage.setItem("ClosedAccountsBank",accountParentUnit);
    localStorage.getItem('ClosedAccountsBank' || 'null'
  );
  let isAuthorze = JSON.stringify(true);
  let parentUnitid = uploaddetails?.trim();
  let remarks = this.remarks;
  this.spinner.show();
  this.entityService.update_closed_account_status( this.celldata.uploadClosedDataStatusId,isAuthorze,remarks).subscribe((res: any) => {
      if (res.success === true) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
       // window.location.reload()
      } else if (res.success === false) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
      }
    });
  // Reset the textarea value
  this.remarks = '';
}
// RejectClosedAccount
rejectClosedAccount() {
  let uploaddetails = this.celldata.uploadClosedDataStatusId;
  let isAuthorze = JSON.stringify(false);
  let parentUnitid = uploaddetails;
  let remarks = this.remarks;
  this.spinner.show();
  this.entityService.update_closed_account_status(parentUnitid,isAuthorze, remarks).subscribe((res: any) => {
    if (res.success === true) {
      this.spinner.hide();
      console.log('Authorize Status', res);
      localStorage.setItem("RateAllowedPopup",res.message);
      localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
      this.errordialog?.openDialog();
    //  window.location.reload()
    } else if (res.success === false) {
      this.spinner.hide();
      console.log('Authorize Status', res);
      localStorage.setItem("RateAllowedPopup",res.message);
      localStorage.setItem("PopupMaitainance",'NrlmUpload');
      this.errordialog?.openDialog();
    }
  });
  // Reset the textarea value
  this.remarks = '';
}

// AuthorizeClaimsUpload()
AuthorizeClaimsUpload() { 
  let uploaddetails = 
    // localStorage.getItem('ClosedAccountsBank' || 'null'
    localStorage.getItem("bankCode");
  let isAuthorze = JSON.stringify(true);
  let parentUnitid = uploaddetails?.trim();
  let remarks = this.remarks;
  this.spinner.show();
  this.entityService.update_claims_upload_status( this.celldata.claimsDataStatusId,isAuthorze,remarks).subscribe((res: any) => {
      if (res.success === true) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
       // window.location.reload()
      } else if (res.success === false) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
      }
    });
  // Reset the textarea value
  this.remarks = '';
}
// RejectClaimsUpload
rejectClaimsUpload() {
  let uploaddetails = this.celldata.claimsDataStatusId;
  let isAuthorze = JSON.stringify(false);
  let parentUnitid = uploaddetails;
  let remarks = this.remarks;
  this.spinner.show();
  this.entityService.update_claims_upload_status(parentUnitid,isAuthorze, remarks).subscribe((res: any) => {
    if (res.success === true) {
      this.spinner.hide();
      console.log('Authorize Status', res);
      localStorage.setItem("RateAllowedPopup",res.message);
      localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
      this.errordialog?.openDialog();
      //window.location.reload()
    } else if (res.success === false) {
      this.spinner.hide();
      console.log('Authorize Status', res);
      localStorage.setItem("RateAllowedPopup",res.message);
      localStorage.setItem("PopupMaitainance",'NrlmUpload');
      this.errordialog?.openDialog();
    }
  });
  // Reset the textarea value
  this.remarks = '';
}



// RejectAccount
rejectAccount() {
  let uploaddetails =
    localStorage.getItem('uploadAccountsDataStatusId');
  let isAuthorze = JSON.stringify(false);
  let parentUnitid = uploaddetails?.trim();
  console.log("Acountsss",parentUnitid)
  let remarks = this.remarks;
  this.spinner.show()
  this.entityService.update_account_status(parentUnitid,isAuthorze, remarks).subscribe((res: any) => {
    if (res.success === true) {
      this.spinner.hide();
      console.log('Authorize Status', res);
      localStorage.setItem("RateAllowedPopup",res.message);
      localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
      this.errordialog?.openDialog();
     // window.location.reload()
    } else if (res.success === false) {
      this.spinner.hide();
      console.log('Authorize Status', res);
      localStorage.setItem("RateAllowedPopup",res.message);
      localStorage.setItem("PopupMaitainance",'NrlmUpload');
      this.errordialog?.openDialog();
    }
  });
  // Reset the textarea value
  this.remarks = '';
}
  reject() {
    let uploaddetails = JSON.parse(
      localStorage.getItem('upload_Details') || 'null'
    );
    let isAuthorze = JSON.stringify(false);
    console.log("UploadDetails",uploaddetails)
    let parentUnitid = uploaddetails.uploadShgCodesDataStatusId;
    let remarks = this.remarks;
    this.spinner.show();
    this.entityService.Update_status(parentUnitid,isAuthorze, remarks).subscribe((res: any) => {
      if (res.success === true) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
       // window.location.reload()
      } else if (res.success === false) {
        this.spinner.hide();
        console.log('Authorize Status', res);
        localStorage.setItem("RateAllowedPopup",res.message);
        localStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
      }
    });
    // Reset the textarea value
    this.remarks = '';
  }
  SearchFilter() {
  }

  startYearspopup:any=[]
  selectedFyEndDate:any;
  selectedQtrEndDate:any;
  uploadQtrData:any=[];
  getfinendingForpopup(){
    this.entityService.getfyYearforpopup().subscribe((res:any)=>{
      console.log(res)
      this.startYearspopup=res.data;
      console.log("Responseee",this.startYearspopup)
      this.selectedFyEndDate = this.startYearspopup[0];
      this.selectedFyEndYear =  this.startYearspopup[0];
      // this.selectedFyEndDate = this.rolesToken.fyEndingDate;
      this.selectedFyEndDate =  this.datepipe.transform(this.selectedFyEndDate,'dd MMM YYYY');
      this.fyendyearpopup =  this.rolesToken.fyEndingDate;
      this.fyendyearpopup = this.datepipe.transform(this.fyendyearpopup,'dd-MM-YYYY');
      this.entityService.getQtYear(this.fyendyearpopup).subscribe((res:any)=>{
        console.log(res);
        this.qtdata=res.data;
        this.uploadQtrData = res.data;
        console.log("QtrData",this.qtdata)
        this.qtrselected = this.rolesToken.qtrEndingDate;
        this.qtrselected = this.datepipe.transform(this.qtrselected,'dd-MM-YYYY');
        this.selectedQtrEndDate = this.uploadQtrData[0];
        this.selectedQtrYear = this.qtdata[0];
        this.selectedQtrYear = this.datepipe.transform(this.selectedQtrYear,'dd MMM YYYY');
        if(this.uploadFileType === 'nrlm') {
          this.getuploadedfiles();
        }
        if(this.uploadFileType === 'account') {
          this.getAccountUploadedFilesAfterSubmit();
        }
        if(this.item =='20215') {
          this.getclosedaccountlist();
        }
        if(this.item =='20217') {
          this.getclaimedAccountlist();
        }
        // this.entityService.getUtilsLastUpdatedQtr(this.qtrselected,this.recordStatus).subscribe((res:any)=> {
        //   this.LstUpdateQtrData = res.data;
        //   console.log("LastUpdatedQtrData",this.LstUpdateQtrData)
        //       })
        this.selectedQtrEndDate = this.datepipe.transform(this.selectedQtrEndDate,'dd MMM YYYY');
            })

    })
  }

  navigateToBack(){
    if (this.uploadFileType == 'nrlm') {
      this.router.navigate(['nrlm-data-upload'])
    }
    else if(this.uploadFileType == 'account'){
      this.router.navigate(['accounts-data-upload'])
    }
    else if(this.item=='20215'){
      this.router.navigate(['closed-account-data'])
    }
    else if(this.item=='20217'){
      this.router.navigate(['claims-upload'])
    }
  }
}
