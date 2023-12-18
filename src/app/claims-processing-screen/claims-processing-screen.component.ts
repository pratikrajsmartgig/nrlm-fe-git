import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CellClickedEvent, FirstDataRenderedEvent, GridReadyEvent, GridApi, } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
// @ts-ignore
import printDoc from 'src/assets/js/printDoc';
import { DatePipe } from '@angular/common';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';
import { WarningLogDialogComponent } from '../warning-log-dialog/warning-log-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-claims-processing-screen',
  templateUrl: './claims-processing-screen.component.html',
  styleUrls: ['./claims-processing-screen.component.css']
})

export class ClaimsProcessingScreenComponent {

  @ViewChild(WarningLogDialogComponent) warningdialog: WarningLogDialogComponent | undefined;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild('myModal') modal: ElementRef | undefined;
  now: any;
  bankCode: any = [];
  FYstart: any;
  FYend: any;
  selectedYear!: number;
  years: number[] = [];
  range = [];
  display = true;
  fileInput: any;

  file: File | null = null;
  @ViewChild('agGrid')
  isOpen = true;
  agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  myForms!: FormGroup;
  bankSelect!: FormGroup
  tokenExpireyTime: any;
  formGroup!: FormGroup;
  select: any = [];
  levelsData: any = [];
  tabEvent: any;
  viewDisabled: boolean = true;
  selectedLevelData: any = [];
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden: boolean = false;
  showComponent: any;
  uploadPermission: boolean = false;
  fileView: boolean = false;
  fyend: any = '';
  loginUserId: any;
  entityStatus: any;
  makerId: any;
  StatusName: any = [];
  rolesToken:any= [];
  newMaker:any;
  showDelete:boolean =false;
 

 
  toppingList = [
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr Ending' },
    { field: 'bank', label: 'Bank' },
    { field: 'claimsCount', label: 'Claims Count'},
    {field: 'statusDesc', label: 'Status'},
    {field: 'maker', label:'Maker'},
    {field: 'checker', label: 'Checker'},
    {field: 'makerTime', label: 'Maker Time'},
    {field: 'checkerTime', label: 'Checker Time'}
  ];
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
  columnDefs: ColDef[] = [
    {
      headerName: 'FY Ending',
      field: 'fyEnding',
      tooltipField: 'fyending',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      // floatingFilter: true,
      width: 110,
      comparator:this.dateComparator2
    },

    {
      headerName: 'Qtr Ending',
      field: 'qtrEnding',
      tooltipField: 'qtrEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      filter: 'agDateColumnFilter',
      // floatingFilter: true,
      resizable: true,
      width: 110,
      comparator:this.dateComparator
    },
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'bank',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 120,

    },
    {
      headerName: 'Claims Count',
      field: 'claimsCount',
      tooltipField: 'claimscount',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 130

    },
    {
      headerName: 'Status',
      field: 'overallStatus',
      tooltipField: 'overallStatus',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 200

    },
    {
      headerName: 'Maker',
      field: 'maker',
      tooltipField: 'maker',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 110

    },
    {
      headerName: 'Checker',
      field: 'checker',
      tooltipField: 'checker',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 110

    },
    {
      headerName: 'Maker Time',
      field: 'makerTime',
      tooltipField: 'makerTime',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 130

    },
    {
      headerName: 'Checker Time',
      field: 'checkerTime',
      tooltipField: 'checkerTime',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 140

    },
  ];

  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: {
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },

    onGridReady: (params) => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  };
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,
    filter: 'agTextColumnFilter',
    // flex: 8,
    // resizable: true,
    sortable: true,
  };
  gridColumnApi: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  public pageSize = 20;
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }
  disabled = false;
  selectedItems: any = [];
  constructor(private dateFormatService:DateFormatServiceService,private dateFormatServiceWithoutTime:DateFormatWithoutTimeService, private entityGridService: SharedEntityServiceService,private modalService: NgbModal, private fb: FormBuilder, public dialog: MatDialog, private router: Router, private entityService: EntityScreenServiceService, 
    private datePipe: DatePipe, private renderer: Renderer2, private spinner:NgxSpinnerService) {
    this.tokenExpireyTime = localStorage.getItem(
      'tokenExpirationTimeInMinutes'
    );
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsBank: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;


  qtrselected: any = ''
  qtrEnding(data: any) {
    let datas = this.selectedQtrEnding;
    let item = this.datePipe.transform(datas, 'dd-MM-yyyy');
    //console.log("Dataaaa", item);
    this.qtrselected = item;
  }
  fyendyearpopup: any;
  qtdata: any = []
  onSelectFinancialYearpopup() {
    let fyEnd =this.selectedFyEnding;
    let selectedDate = this.datePipe.transform(fyEnd, 'dd-MM-yyyy');
    this.fyendyearpopup = selectedDate;
    this.entityService.getQtYear(this.fyendyearpopup).subscribe((res: any) => {
      //console.log(res);
      this.qtdata = res.data
      console.log("QTRENd",this.qtdata);
      this.qtrselected = this.qtdata[0];
      this.selectedQtrEnding = this.qtdata[0];
      this.qtrselected = this.datePipe.transform(this.qtrselected,"dd-MM-YYYY")
      // this.getClaimsProcessGridData()
    })
    //console.log("qtrDataa", this.fyend);
  }

  qtrData: any[] = []
  getqtrEnding() {
    this.entityService.getqtrEnding().subscribe((res: any) => {
      this.startYears = [res.data.pastYears]
      let start: any = [res.data.pastYears]
      let end: any = [res.data.curFyEnd]
      this.startYears = Array.from({ length: end - start + 1 }, (_, i) => end - i)
      let currfyend: any = res.data.curFyEnd
      this.selectedStartYear = res.data.pastFyStart
      this.selectedEndYear = res.data.curFyEnd


      if (res.success === true) {

        let data = res?.data;
        //console.log("Dataaaaaaa", data)
        if (data.q1) {
          let obj: any = {
            'item': data.q1,
            'id': 1
          }
          this.qtrData.push(obj)
        }

        if (data.q2) {
          let obj: any = {
            'item': data.q2
          }
          this.qtrData.push(obj)

        }


        if (data.q3) {
          let obj: any = {
            'item': data.q3
          }
          this.qtrData.push(obj)

        }

        if (data.q4) {
          let obj: any = {
            'item': data.q4
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
  ngOnInit() {
    this.getunits();
    this.getfinendingForpopup();
  // this.getClaimsProcessGridData();
  this.rolesToken = localStorage.getItem("TokenDetals");
  this.rolesToken = JSON.parse(this.rolesToken?this.rolesToken:'')
 //console.log("RolesToken",this.rolesToken)
  //  console.log("this.tokenExpireyTime", this.tokenExpireyTime)
    let data: any = localStorage.getItem("sideNavbar");
  //  console.log('sideNavBarData', data);
    this.loginUserId = localStorage.getItem("loginUserId")
  //  console.log("LoginUSer", this.loginUserId);
    this.entitlements = JSON.parse(data ? data : '')
    this.entitlements.forEach((elements: any) => {
      // debugger
      if (elements == 'View') {
        this.viewPermission = true;
      }
      if (elements === 'Delete') {
        this.showDelete = true;
      }
      else if (elements == 'Add') {
        this.AddPermission = true;
      }
      else if (elements == 'Edit') {
        this.EditPermission = true;
        localStorage.setItem("showEdit",JSON.stringify(this.EditPermission));
        localStorage.setItem("showDelete",JSON.stringify(this.showDelete));
        if (this.EditPermission == true) {
          localStorage.setItem("EditPermission", "EditTrue");
        }

      }
      else if (elements === 'Authorize') {
        this.authorizePermission = true;
      }
      else if (elements == 'FileUpload') {
        this.uploadPermission = true;
      }
      else if (elements == 'FileView') {
        this.uploadPermission = true;
      }
      // Authorize

    })
    //console.log("Entitlements", this.entitlements)

    this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: [''],
    });
    this.bankSelect = this.fb.group({
      bank: ['']
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'field',
      textField: 'label',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: -1,
      enableCheckAll: true,
      itemsShowLimit: 2,
    };
    //Bank Dropdown
    // this.dropdownSettingsBank = {
    //   singleSelection: false,
    //   idField: 'unit',
    //   textField: 'unitName',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   limitSelection: -1,
    //   enableCheckAll: true,
    //   itemsShowLimit: 1,
    // };
    // this.setForm()
    this.selectedItemsArray.push('Unit');

    this.myForms.patchValue({
      name: this.toppingList,
    });


    // this.getSghCodes()
    // this.resetPinned();
    // this.bankSelect.patchValue({
    //   bank: this.unitsData
    // })
  }
  selectedStartYear: any
  selectedEndYear: any
  startYears: number[] = [];
  endYears: number[] = [];
  fyStart: any = ''
  fyEnd: string = '';
  recordStatus: any = '';

//Financial year ending
  startYearspopup: any = [];
  selectedFyEnding:any;
  selectedQtrEnding:any;
  getfinendingForpopup() {
    this.entityService.getfyYearforpopup().subscribe((res: any) => {
      console.log(res)
      this.startYearspopup = res.data;
      this.fyendyearpopup = this.startYearspopup[0];
      this.selectedFyEnding = this.datePipe.transform(this.fyendyearpopup,'dd MMM YYYY');
      this.fyendyearpopup = this.datePipe.transform(this.fyendyearpopup, 'dd-MM-yyyy');
      this.entityService.getQtYear(this.fyendyearpopup).subscribe((res: any) => {
        console.log(res);
  
        this.qtdata = res.data
        console.log("QtrData",this.qtdata)
        this.qtrselected = this.rolesToken.qtrEndingDate;
      this.selectedQtrEnding = this.datePipe.transform(this.qtrselected,'dd MMM YYYY');
        this.qtrselected = this.datePipe.transform(this.qtrselected,"dd-MM-YYYY")
        this.getClaimsProcessGridData()
      })
    })
  }

  ToggleHideShow() {
    this.showhide = !this.showhide;
    this.gridColumnApi.setColumnsVisible(['Unit'], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
    this.entityGridService.listen().subscribe((m: any) => {
      console.log('RefreshData', m);
      setTimeout(() => { }, 2000);
    });
  }
 // select unit dropdown
 financialYear: any;
 bankStatus:any;
 //get Record Status
 getRecordStatus(event: any) {
   this.recordStatus = event.unitCode;
   this.bankStatus = ''
   if(this.recordStatus === '99') {
    let bankLevel = 3;
    this.entityService.getClaimsDropDownInfo(bankLevel).subscribe((res: any) => {
      if (res.success == true) {
        if(res?.data.length === 1) {
          this.banksData = res?.data;
          this.bankStatus = this.banksData[0].unitCode;
          this.forAddBanksDropdown = res?.data;
          if(this.forAddBanksDropdown.length === 1) {
            this.addBanksStatus = this.forAddBanksDropdown[0].unitCode
          }

        } 
        else {
          this.forAddBanksDropdown = res?.data;
          let allbanks = {
            unitCode:'99',
            unitName:'All'
          }
          this.banksData = res?.data;
          console.log("RegionData",this.banksData);
          this.banksData.push(allbanks);
          console.log("RegionData",this.banksData);
          this.bankStatus ='99';
        }
      }
    },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
   }
else {
  this.entityService.getBankDropDownInfo(this.recordStatus).subscribe(
    (res: any) => {
      console.log(res);
      if (res.success === true) {
        if (res.data.length > 1) {
          let allBanks = {
            unitCode: '99',
            unitName: 'All'
          };
          this.bankStatus = '99';
          this.banksData = [allBanks, ...res.data];
        } else {
          this.banksData = res.data;
          this.bankStatus = res.data[0].unitCode;
        }
      }
    },
    (err: any) => {
      console.log('ErrorMessage', err.error.message);
    }
  );
}
  //  this.financialYear=  this.recordStatus;
  //  console.log("recordStatus", this.recordStatus);
 }
 //getAddRecord Status
 addRecordStatus:any ;
 addBanksStatus:any ;

 getAddRecordStatus(event: any) {
  this.addRecordStatus = event.unitCode;
  this.addBanksStatus = '';

  this.entityService.getBankDropDownInfo(this.addRecordStatus).subscribe((res: any) => {
    console.log(res);

    if (res.success == true) {
      this.forAddBanksDropdown = res.data;
      if (res.data.length == 1) {
        this.addBanksStatus = res?.data[0].unitCode;
      } 
    }
  },
  (err: any) => {
    console.log('ErrorMessage', err.error.message);
  });
}

 //Select Bank Status
 getBankStatus(event: any) {
  this.bankStatus = event.unitCode;
  // this.financialYear=  this.recordStatus;
  // console.log("recordStatus", this.recordStatus);
}
// addBanksStatus
getAddBankStatus(event:any) {
  this.addBanksStatus =event.unitCode;
}
  // getsUnits Info
  unitsData: any = [];
  unitsData1: any = [];
  bankListArray: any = [];
  bankAllArray: any[] = [];
  banksData:any = [];
  ClaimsProcessData:any = [];
  forAddBanksDropdown:any = [];
  getunits() {
    let regionLevel =2;
    this.entityService.getClaimsDropDownInfo(regionLevel).subscribe((res: any) => {
      console.log("Response",res)
      if (res.success === true) {
        if(res?.data.length === 1) {
          this.unitsData = res?.data;
          this.unitsData1 = res?.data;
          console.log("Region",this.unitsData)
          this.recordStatus = this.unitsData[0].unitCode; 
          this.addRecordStatus = this.unitsData1[0].unitCode;
        }
        else {
          this.entityService.getClaimsDropDownInfo(regionLevel).subscribe((res:any)=>{
            this.unitsData1 = res?.data
          })
          let Regions = {
            unitCode:'99',
            unitName:'All'
          }
          this.unitsData = res?.data;
          console.log("RegionData",this.unitsData);
          this.unitsData.push(Regions);
          console.log("RegionData",this.unitsData);
          this.recordStatus ='99';
          // this.addRecordStatus = '99';
        }

        let localdata = res.data;
        this.bankListArray = localdata.map((data: { unitCode: any; unitName: any; }) => {
          return { unit: data.unitCode, unitName: data.unitName };
        });
        this.bankListArray.push()
        this.bankListArray.forEach((element: { unit: any; }) => {
          return this.bankAllArray.push(element.unit);
        })
        console.log("BankListArray", this.bankAllArray);
      }
    },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
    let bankLevel = 3;
    this.entityService.getClaimsDropDownInfo(bankLevel).subscribe((res: any) => {
      if (res.success === true) {
        if(res?.data.length === 1) {
          this.banksData = res?.data;
          this.bankStatus = this.banksData[0].unitCode;
          this.forAddBanksDropdown = res?.data;
          if(this.forAddBanksDropdown.length === 1) {
            this.addBanksStatus = this.forAddBanksDropdown[0].unitCode
          }

        } 
        else {
          this.entityService.getClaimsDropDownInfo(bankLevel).subscribe((res:any)=>{
            this.forAddBanksDropdown = res?.data;
          })
          let allbanks = {
            unitCode:'99',
            unitName:'All'
          }
          this.banksData = res?.data;
          //console.log("RegionData",this.banksData);
          this.banksData.push(allbanks);
          //console.log("RegionData",this.banksData);
          this.bankStatus ='99';
        }
        // let localdata = res.data;
        // this.bankListArray = localdata.map((data: { unitCode: any; unitName: any; }) => {
        //   return { unit: data.unitCode, unitName: data.unitName };
        // });
        // this.bankListArray.push()
        // this.bankListArray.forEach((element: { unit: any; }) => {
        //   return this.bankAllArray.push(element.unit);
        // })
        // console.log("BankListArray", this.bankAllArray);
      }
    },
      (err: any) => {
        console.log('ErrorMessage', err.error.message);
      }
    );
  }
getClaimsProcessGridData() {
  let cProLeLevel = 0 ;
  // alert(this.fyendyearpopup)
  // alert(this.qtrselected)
  let qtrselectedd = this.datePipe.transform(this.selectedQtrEnding,"dd-MM-yyyy")
  this.entityService.getClaimsProcessingInfo(this.fyendyearpopup,qtrselectedd,cProLeLevel).subscribe((res:any)=> {
    if(res)  {
      this.ClaimsProcessData = res.data;
      console.log("ClaimsData",this.ClaimsProcessData);
    }
  })
}
  // getUploadedFiles
  uploadedfiles: any = [];
  submit() {
    // this.filterData();
    this.entityService.getShgCodesByYear(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
      console.log('filteredData', res);
      this.getSghCodes()
    });
  }
  // getsghcodes by year
  getsghCodesbyYear() {
    // console.log(this.bankCode, this.fyStart, this.fyEnd);
    // this.entityService.getShgCodesByYear(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
    //   this.sghCodes = res.data;
    //   console.log(res.data);
    // })
    this.spinner.show();
    let cProLeLevel = 0;
    if(this.recordStatus ==='99' && this.bankStatus === '99') {
      let qtrEndingss= this.datePipe.transform(this.selectedQtrEnding,'dd-MM-yyyy')
      this.entityService.getClaimsProcessingInfo(qtrEndingss,qtrEndingss,cProLeLevel).subscribe((res:any)=> {
        if(res)  {
          this.spinner.hide();
          this.ClaimsProcessData = res.data;
          console.log("ClaimsData",this.ClaimsProcessData);
        }
      })
    }
    if(this.recordStatus !=='99' && this.bankStatus === '99') {
      let qtrEndingss= this.datePipe.transform(this.selectedQtrEnding,'dd-MM-yyyy')
      this.entityService.getClaimsProcessingInfoWithParentUnitCode(this.recordStatus,this.fyendyearpopup,qtrEndingss,cProLeLevel).subscribe((res:any)=> {
        if(res)  {
          this.spinner.hide();
          this.ClaimsProcessData = res.data;
          console.log("ClaimsData",this.ClaimsProcessData);
        }
      })
    }
    if(this.recordStatus ==='99' && this.bankStatus !== '99') {
      let qtrEndingss= this.datePipe.transform(this.selectedQtrEnding,'dd-MM-yyyy')
      this.entityService.getClaimsProcessingInfoWithUnitCode(this.bankStatus,this.fyendyearpopup,qtrEndingss,cProLeLevel).subscribe((res:any)=> {
        if(res)  {
          this.spinner.hide();
          this.ClaimsProcessData = res.data;
          console.log("ClaimsData",this.ClaimsProcessData);
        }
      })
    }
    if(this.recordStatus !=='99' && this.bankStatus !== '99') {
      let qtrEndingss= this.datePipe.transform(this.selectedQtrEnding,'dd-MM-yyyy')
      this.entityService.getClaimsProcessingInfoWithUnitCodeNdparentUnit(this.recordStatus,this.bankStatus,this.fyendyearpopup,qtrEndingss,cProLeLevel).subscribe((res:any)=> {
        if(res)  {
          this.spinner.hide();
          this.ClaimsProcessData = res.data;
          console.log("ClaimsData",this.ClaimsProcessData);
        }
      })
    }
  }


  // submitAccountsUpload
  submitAccountsData() {
  }

  // getShgCodes
  sghCodes: any = []
  getSghCodes() {
    this.entityService.getShgCodes().subscribe((res: any) => {
      console.log('ShgCodes', res);
      if (res.success === true) {
        this.sghCodes = res?.data
        // console.log(this.sghCodes);
      }
    }, (err: any) => {
      console.log('ErrorMessage', err.error.message);
    }
    )
  }

  // download pdf
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
  onBtnExport() {
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

  // dropdown
 
  showhide: boolean = true;
  ColumnSelect(selectedField: any) {
    let item = selectedField.field;
    this.showhide = true;
    this.gridColumnApi.setColumnsVisible([item], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnDeSelect(selectedField: any) {
    let item = selectedField.field;
    this.showhide = false;
    this.gridColumnApi.setColumnsVisible([item], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnDeSelectOrAll(selectedFields: any) {
    let itemss = selectedFields.map((x: { field: any }) => x.field);
    this.showhide = false;
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnSelectOrAll(selectedFields: any) {
    let itemss = selectedFields.map((x: { field: any }) => x.field);
    this.showhide = true;
    let items = ['Bank', 'FY Ending', 'Qtr End', 'Total Records'];
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  //Bank Selector

  BankSelect(selectedField: any) {
    this.bankCode = selectedField.unit;
    this.gridApi.sizeColumnsToFit();
  }
  BankDeSelect(selectedField: any) {
    this.bankCode = selectedField.unit;
    this.gridApi.sizeColumnsToFit();
  }
  BankDeSelectOrAll() {
    this.bankCode = [];
    this.gridApi.sizeColumnsToFit();
  }
  BankSelectOrAll() {
    this.bankCode = this.bankAllArray;
    this.gridApi.sizeColumnsToFit();
  }

  // pinning list
  leftPinnedColumns: string[] = [];
  rightPinnedColumns: string[] = [];
  toppingListLeft: any[] = [
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr Ending' },
    { field: 'bank', label: 'Bank' },
    { field: 'claimsCount', label: 'Claims Count'},
    {field: 'statusDesc', label: 'Status'},
    {field: 'maker', label:'Maker'},
    {field: 'checker', label: 'Checker'},
    {field: 'makerTime', label: 'Maker Time'},
    {field: 'checkerTime', label: 'Checker Time'}

  ];
  toppingListRight: any[] = [
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr Ending' },
    { field: 'bank', label: 'Bank' },
    { field: 'claimsCount', label: 'Claims Count'},
    {field: 'statusDesc', label: 'Status'},
    {field: 'maker', label:'Maker'},
    {field: 'checker', label: 'Checker'},
    {field: 'makerTime', label: 'Maker Time'},
    {field: 'checkerTime', label: 'Checker Time'}

  ];

  onItemSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    console.log('Itemmm', item);
    if (type == 'left') {
      this.leftPinnedColumns.push(item);
      this.toppingListRight = this.toppingListRight.filter(
        (x: any) => x.field != item
      );

      // this.toppingListRight.pop(item)
    } else {
      this.rightPinnedColumns.push(item);
      this.toppingListLeft = this.toppingListLeft.filter(
        (x: any) => x.field != item
      );
    }

    this.updatedColumnPinned();
  }
  onItemDeSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    let obj: any = { field: selectedField.field, label: selectedField.label };
    if (type == 'left') {
      this.leftPinnedColumns = this.leftPinnedColumns.filter((x) => x != item);
      // debugger;
      this.toppingListRight.push(obj);
    } else {
      this.rightPinnedColumns = this.rightPinnedColumns.filter(
        (x) => x != item
      );
      this.toppingListLeft.push(obj);
    }
    this.updatedColumnPinned();

    // this.showhide = false;
    // this.gridColumnApi.setColumnsVisible([item], this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  onItemDeSelectOrAll(items: any, type: string) {
    // this.showhide = false;
    // let itemss = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];
    // itemss.forEach((item: any) => {
    //   if (item == 'Pin Code') {
    //     item = 'Pin_Code'
    //   }
    //   if (item == 'Unit Name') {
    //     item = 'Unit_Name'
    //   }
    //   if (item == 'Parent Unit') {
    //     item = 'Parent_Unit'
    //   }
    //   if (item == 'Maker time') {
    //     item = 'maker_time'
    //   }
    //   if (item == 'Checker Time') {
    //     item = 'checker_time'
    //   }
    //   if (item == 'Record Status') {
    //     item = 'Record_status'
    //   }
    // })
    // this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  onItemSelectOrAll(itemss: any, type: string) {
    // itemss.forEach((item: any) => {
    //   if (item == 'Pin Code') {
    //     item = 'Pin_Code'
    //   }
    //   if (item == 'Unit Name') {
    //     item = 'Unit_Name'
    //   }
    //   if (item == 'Parent Unit') {
    //     item = 'Parent_Unit'
    //   }
    //   if (item == 'Maker time') {
    //     item = 'maker_time'
    //   }
    //   if (item == 'Checker Time') {
    //     item = 'checker_time'
    //   }
    //   if (item == 'Record Status') {
    //     item = 'Record_status'
    //   }
    // })
    // console.log('onItemSelect', itemss);
    // this.showhide = true;
    // let items = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];
    // this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  updatedColumnPinned() {
    let state: any = [];
    this.leftPinnedColumns.forEach((columnField) => {
      state.push({ colId: columnField, pinned: 'left' });
    });

    this.rightPinnedColumns.forEach((columnField) => {
      state.push({ colId: columnField, pinned: 'right' });
    });

    this.gridColumnApi.applyColumnState({
      state: state,
      defaultState: { pinned: null },
    });
  }
  // resetPinned() {
  //   this.gridOptions.columnApi!.applyColumnState({
  //     state: [
  //       { colId: 'Unit', pinned: 'left' },
  //       { colId: 'IFSC', pinned: 'left' },
  //       { colId: 'age', pinned: 'left' },
  //       { colId: 'total', pinned: 'right' },
  //     ],
  //     defaultState: { pinned: null },
  //   });
  // }

  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
  }

  celldata: any


  downloadRecord() {
    let isView = JSON.stringify(false)
    let fyEnd = this.datePipe.transform(this.celldata.fyEnding, 'dd-MM-yyyy')
    let qtrEnd = this.datePipe.transform(this.celldata.qtrEnding, 'dd-MM-yyyy')
    console.log(this.celldata.bankCode, fyEnd, qtrEnd, isView)
    this.entityService.downloadshgCodes(this.celldata.bankCode, fyEnd, qtrEnd, isView).subscribe((res: any) => {
      const blob = new Blob([res.body], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.celldata.bank;
      link.click();
      window.URL.revokeObjectURL(url);
    })
  }


  // icon functionality
  viewEnity() {
    localStorage.setItem('ClaimsAuth', JSON.stringify(true));
    localStorage.setItem('ClaimsView', JSON.stringify(false));
    localStorage.setItem('ComeFromEdit',JSON.stringify(false));
    localStorage.setItem('ComeFromAuth',JSON.stringify(false));
    localStorage.setItem('ComeFromView',JSON.stringify(true));
    this.router.navigate(['/add-claims-processing']);
  }
  addEntity() {
// alert(this.addRecordStatus);
// alert(this.addBanksStatus);
// alert(this.fyendyearpopup);
// alert(this.qtrselected)
    // localStorage.setItem('entityData', 'addData');
    this.spinner.show();
    this.entityService.AddClaimsProcessing(this.addBanksStatus,this.fyendyearpopup,this.qtrselected).subscribe((res:any)=>{
      if(res.success == true) {
        this.spinner.hide();
        const modalElement: HTMLElement = this.modal?.nativeElement;
        modalElement.classList.remove('show');
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.style.display = 'none';
        
        const modalBackdrops = document.getElementsByClassName('modal-backdrop');
        // Remove all backdrop elements
        while (modalBackdrops.length > 0) {
          document.body.removeChild(modalBackdrops[0]);
        }
        this.spinner.hide();
        document.body.classList.remove('modal-open');
        const message = "Claims Added Successfully";
        localStorage.setItem("RateAllowedPopup",message);
        localStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
        // console.log("Add Response",AddResponse);
        // window.location.reload()
      }
if(res.success == false) {

const modalElement: HTMLElement = this.modal?.nativeElement;
modalElement.classList.remove('show');
modalElement.setAttribute('aria-hidden', 'true');
modalElement.style.display = 'none';

const modalBackdrops = document.getElementsByClassName('modal-backdrop');
// Remove all backdrop elements
while (modalBackdrops.length > 0) {
  document.body.removeChild(modalBackdrops[0]);
}
this.spinner.hide();
document.body.classList.remove('modal-open');
localStorage.setItem("RateAllowedPopup",res.message);
localStorage.setItem("PopupMaitainance",'NrlmUpload');
this.errordialog?.openDialog();
}
    });
  //  AddClaimsProcessing
    
  }

  EditEntityDialog(){
    
    localStorage.setItem("entityData", "claimsProcessing");
    this.warningdialog?.openDialog();
  }
  EditEntity() {
    let auth = false;
    localStorage.setItem('entityData', 'editData');
    localStorage.setItem("ComeFromEdit",JSON.stringify(true));
    // this.celldata?.pending
    localStorage.setItem("Pending",this.celldata?.pending);
    localStorage.setItem('ClaimsAuth', JSON.stringify(false));
    localStorage.setItem('ClaimsView',JSON.stringify(true))
    localStorage.setItem('ComeFromView',JSON.stringify(false));
    this.router.navigate(['/add-claims-processing']);
  }
  DeleteEntity() {
    localStorage.setItem('entityData', 'deleteData');
    this.router.navigate(['/add-entity']);
  }
  AuthorizeEntity() {
    localStorage.setItem('ClaimsAuth', JSON.stringify(true));
    localStorage.setItem('ClaimsView',JSON.stringify(true));
    localStorage.setItem("ComeFromAuth",JSON.stringify(true));
    localStorage.setItem('ComeFromView',JSON.stringify(false));
    this.router.navigate(['/add-claims-processing']);
  }
  UploadEntity() {
    localStorage.setItem('entityData', 'authorizeData');
    localStorage.setItem("editPermission", JSON.stringify(this.EditPermission))
    localStorage.setItem('uploadFileType', 'nrlm');
    this.router.navigate(['/nrlm-upload-screen']);
  }

  // cell clicked
  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    console.log(event);
    this.celldata = event?.data;
    this.makerId = this.celldata?.maker;
    if(this.makerId === null) {
    this.newMaker = 'null';    
    }
    else {
   this.newMaker ='notnull'
    }
    this.makerId = this.makerId?.split('-')[0];
    console.log("CellData",this.celldata)
    localStorage.setItem("ClaimsProcessCellData",JSON.stringify(this.celldata));
    let effectiveDate = this.celldata?.qtrEnding;
    effectiveDate = this.datePipe.transform(effectiveDate,'dd-MM-YYYY')
    localStorage.setItem("EffectiveData",effectiveDate);
  }

  closeModal(){
    window.location.reload()
  }

}


