import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import {CellClickedEvent,FirstDataRenderedEvent,GridReadyEvent,GridApi,} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
// @ts-ignore
import printDoc from 'src/assets/js/printDoc';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';

@Component({
  selector: 'app-claims-upload',
  templateUrl: './claims-upload.component.html',
  styleUrls: ['./claims-upload.component.css']
})
export class ClaimsUploadComponent {
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
  bankSelect!:FormGroup
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
  showComponent:any;
  uploadPermission:boolean = false;
  fileView:boolean = false;
  columnDefs: ColDef[] = [
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      // floatingFilter: true,
      minWidth:400,
    },
    {
      headerName: 'FY End',
      field: 'fyEnding',
      tooltipField: 'fyEnding',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      filter: 'agDateColumnFilter',
      // floatingFilter: true,
      suppressSizeToFit: true,
      resizable: true,width: 200,
      // valueFormatter: (params) => {
      //   const date = new Date(params.value);
      //   const year = date.getFullYear();
      //   return year.toString();
      // }
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
      filter: 'agDateColumnFilter',
      // floatingFilter: true,
      resizable: true,
      width: 200
    },
    {
      headerName: 'Total Records',
      field: 'totalRecords',
      tooltipField: 'totalRecords',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 300
      
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
    // onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
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
  constructor(private dateFormatService:DateFormatServiceService,private dateFormatServiceWithoutTime:DateFormatWithoutTimeService,private entityGridService: SharedEntityServiceService,private spinner:NgxSpinnerService, private fb: FormBuilder,public dialog: MatDialog,private router: Router,public datepipe: DatePipe,private entityService: EntityScreenServiceService,private datePipe: DatePipe){
    this.tokenExpireyTime = localStorage.getItem(
      'tokenExpirationTimeInMinutes'
    );
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.selectedEndYear = 2023;
    // this.endYears = [];
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsBank: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;
  // AccountsUpload

  // localStorage.setItem("ShowComponent","NRLMDataUpload");
// ngDoCheck() {
//   let item = localStorage.getItem('labelKeyOfSideNav')
//   alert(item)
// }
  ngOnInit() {
 // this.getSghCodes();
  
// this.bankCode = 0
    // this.EndYears();
    // this.uploadFileType = localStorage.getItem('uploadFileType');
   let item = localStorage.getItem('labelKeyOfSideNav')
  //  console.log('this.tokenExpireyTime', this.tokenExpireyTime);
    let data: any = localStorage.getItem('sideNavbar');
  //  console.log('sideNavBarData', data);
    this.getunits();
    this.entitlements = JSON.parse(data ? data : '');
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
      }  else if (elements == 'Edit') {
        this.EditPermission = true;
      } else if (elements == 'Authorize') {
        this.authorizePermission = true;
        this.changeLevelIden = false;
      }
      // Authorize
    });
   // console.log('Entitlements', this.entitlements);

    this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: [''],
    });
    this.bankSelect = this.fb.group({
      bank:['']
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'field',
      textField: 'label',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: -1,
      enableCheckAll: true,
      // selectedItems: 2,
      itemsShowLimit: 2,
    };
    //Bank Dropdown
    this.dropdownSettingsBank = {
      singleSelection: false,
      idField: 'unit',
      textField: 'unitName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: -1,
      enableCheckAll: true,
      // selectedItems: 2,
      itemsShowLimit: 1,
    };
    // this.setForm()
    this.selectedItemsArray.push('Unit');

    this.myForms.patchValue({
      name: this.toppingList,
    });
  
    // alert(this.toppingList[0])
    // this.getSghCodes()
    this.getstartdate()
    // this.updateEndYears();
    setTimeout(() => {
      this.getClaimsUploadbyYear();
    }, 2000);
    this.resetPinned();
    this.bankSelect.patchValue({
      bank:this.unitsData
    })
  }
  selectedStartYear:any
  selectedEndYear:any
  startYears: number[] = [];
  endYears: number[] = [];
  fyStart:any=''
  fyEnd:string=''



  // start year dropdown
  getstartdate(){
    this.entityService.getfinStartYear().subscribe((res:any)=>{
    //  console.log(res);

      // const yearArray = res.data.map((dateString:any) => parseInt(dateString.split("-")[0]));

      this.startYears= res.data;
      this.selectedStartYear = this.startYears[0];
      this. updateEndYears();
      console.log('this.startYears',this.startYears)
    })
      this. EndYears() ;
  }
  EndYears(){

    let item =[this.selectedEndYear]
    //let val=  item.map((dateString:any) => parseInt(dateString.split("-")[0]));;

    // this.fyEnd = '31-03-'+val
    // console.log(this.fyEnd);
    this.fyEnd = this.selectedEndYear;
    this.fyEnd = String(this.datePipe.transform(this.fyEnd,'dd-MM-YYYY'))
    
  }
  updateEndYears() {
    // this.endYears = [];
    // let val =this.selectedStartYear;
    // // console.log(val);
    // this.fyStart= '01-04-'+this.selectedStartYear;
    // console.log("default value",this.fyStart);
    //   for (let year = Number(val)+1; year <= this.selectedEndYear; year++) {

    //     this.endYears.push(year);

    //   }


      this.selectedEndYear=''
      this.endYears = [];
      let item =this.selectedStartYear;
      // let val=  item.map((dateString:any) => parseInt(dateString.split("-")[0]));;
      
      this.fyStart= this.datepipe.transform(this.selectedStartYear,'dd-MM-YYYY')
      // this.fyendingDisabled=false
      // console.log(val);
      console.log("default value",this.fyStart);
     // console.log(this.fyStart);
  
      this.entityService.getFinalYear(this.fyStart).subscribe((res:any):any=>{
  
        console.log(res)
        const yearArray = res.data.map((dateString:any) => parseInt(dateString.split("-")[0]));
        
        this.endYears=res.data; 
        this.selectedEndYear = this.endYears[0];
        this.fyEnd = this.selectedEndYear;
        this.fyEnd = String(this.datepipe.transform(this.fyEnd, 'dd-MM-yyyy'));
        console.log("FYStart",this.fyStart)
        console.log("FYEND",this.fyEnd);
        // this.getClaimsUploadbyYear();
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
    //  console.log('RefreshData', m);
      setTimeout(() => {}, 2000);
    });
  }
  
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  // get bankcode
  getbankCode(event: any) {
    this.bankCode = event.unit;
  //  console.log('recordStatus', this.bankCode);
  }
 
  // getsUnits Info
  unitsData: any = [];
  bankListArray:any = [];
  bankAllArray:any[] = [];
  getunits() {
    this.entityService.getUnitsInfo().subscribe((res: any) => {
        // console.log(res);
        if (res.success === true) {
          if(res?.data.length === 1) {
            this.unitsData = res?.data;
            this.bankCode = this.unitsData[0].unit
          }
          else {
            let allData = {
              unit:'99',
              bank:'All'
            }
            this.unitsData = res?.data;
            this.unitsData.push(allData);
            this.bankCode = '99';
            this.bankSelect.patchValue({
              bank:this.unitsData
            })
          //  console.log('getUnits', this.unitsData);
          }

          let localdata = res.data;
          this.bankListArray = localdata.map((data: { unit: any; unitName: any; }) => {
            return { unit: data.unit, unitName  : data.unitName };
          });
          this.bankListArray.push()
          this.bankListArray.forEach((element: { unit: any; }) => {
            return this.bankAllArray.push(element.unit);
          })   
        //  console.log("BankListArray",this.bankAllArray);
        }
      },
      (err: any) => {
      //  console.log('ErrorMessage', err.error.message);
      }
    );
  }

  // getUploadedFiles
  uploadedfiles: any = [];
  submit() {
    // this.filterData();
    this.entityService.getShgCodesByYear(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
          console.log('filteredData', res);
          this.getSghCodes()
        //   if (res.success === true) {
        //     this.uploadedfiles = res?.data;
        //     console.log('filteredData', this.uploadedfiles);
        //   }
        // },
        // (err: any) => {
        //   console.log('ErrorMessage', err.error.message);
        // }
    });
  }
  // getsghcodes by year
  getClaimsUploadbyYear(){
    this.spinner.show();
    if(this.bankCode === '99') {
      console.log(this.fyStart,this.fyEnd);
      this.entityService.getAllClaimsUploadByYear(this.fyStart,this.fyEnd).subscribe((res:any)=>{
        this.spinner.hide();
        this.sghCodes = res.data;
        console.log(res.data);
      })
    }
    else {
      console.log(this.bankCode,this.fyStart,this.fyEnd);
      this.entityService.getClaimsUploadByYear(this.bankCode,this.fyStart,this.fyEnd).subscribe((res:any)=>{
        this.spinner.hide();
        this.sghCodes = res.data;
        console.log(res.data);
      })
    }
  }


  // submitAccountsUpload
  submitAccountsData() {
    alert("Helloo")
  }

  // getShgCodes
  sghCodes:any=[]
  getSghCodes(){
    this.entityService.getClaimsUnitsInfo().subscribe((res:any)=>{
      console.log('ShgCodes',res);
      if(res.success===true){
        this.sghCodes= res?.data
         console.log(this.sghCodes);
      }
    },(err: any) => {
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
  toppingList = [
    { field: 'Bank', label: 'Bank' },
    { field: 'FY Ending', label: 'FY Ending' },
    { field: 'Qtr End', label: 'Qtr End' },
    { field: 'Total Records', label: 'Total Records' },
  ];
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
    let items = ['Bank','FY Ending','Qtr End','Total Records'];
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
    { field: 'bank', label: 'Bank' },
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr End' },
    { field: ' totalRecords', label: 'Total Records' },
    
  ];
  toppingListRight: any[] = [
    { field: 'bank', label: 'Bank' },
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr End' },
    { field: ' totalRecords', label: 'Total Records' },
   
  ];

  onItemSelect(selectedField: any, type: string) {
    let item = selectedField.field;
   // console.log('Itemmm', item);
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
    // this.showhide = true;
    // this.gridColumnApi.setColumnsVisible([item], this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  onItemDeSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    let obj: any = { field: selectedField.field, label: selectedField.label };
    if (type == 'left') {
      this.leftPinnedColumns = this.leftPinnedColumns.filter((x) => x != item);
   
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
  resetPinned() {
    this.gridOptions.columnApi!.applyColumnState({
      state: [
        { colId: 'Unit', pinned: 'left' },
        { colId: 'IFSC', pinned: 'left' },
        { colId: 'age', pinned: 'left' },
        { colId: 'total', pinned: 'right' },
      ],
      defaultState: { pinned: null },
    });
  }

  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
  //  console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
  }
  
  celldata:any


  downloadRecord(){
    let isView =JSON.stringify(false)
    let fyEnd =this.datePipe.transform(this.celldata.fyEnding,'dd-MM-yyyy')
    let qtrEnd = this.datePipe.transform(this.celldata.qtrEnding,'dd-MM-yyyy')
  //  console.log(this.celldata.bankCode,fyEnd,qtrEnd,isView)
    this.spinner.show();
    this.entityService.downloadClaimsUploadData(this.celldata.bankCode,fyEnd,qtrEnd,isView).subscribe((res:any)=>{
      const blob = new Blob([res.body], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.celldata.bank;
      link.click();
      window.URL.revokeObjectURL(url);
      this.spinner.hide()
    })
  }


  // icon functionality
  viewEnity() {
    let fyEnd:any =this.datePipe.transform(this.celldata.fyEnding,'dd-MM-yyyy')
    let qtrEnd:any = this.datePipe.transform(this.celldata.qtrEnding,'dd-MM-yyyy');
    localStorage.setItem('fyEndUser',fyEnd)
    localStorage.setItem('qtrEndUser',qtrEnd)
    localStorage.setItem('accountqtrEnd',qtrEnd)
localStorage.setItem('qtrEndUser',qtrEnd)
// alert(fyEnd)
// alert(qtrEnd)
    localStorage.setItem('entityData', 'viewData');
    this.router.navigate(['/main-view-claims']);
  }
  addEntity() {
    localStorage.setItem('entityData', 'addData');
    this.router.navigate(['/add-entity']);
  }
  EditEntity() {
    localStorage.setItem('entityData', 'editData');
    this.router.navigate(['/add-entity']);
  }
  DeleteEntity() {
    localStorage.setItem('entityData', 'deleteData');
    this.router.navigate(['/add-entity']);
  }
  AuthorizeEntity() {
    localStorage.setItem('entityData', 'authorizeData');
    this.router.navigate(['/add-entity']);
  }
  UploadEntity() {
    localStorage.setItem('entityData', 'authorizeData');
    localStorage.setItem("editPermission",JSON.stringify(this.EditPermission))
    localStorage.setItem('uploadFileType','claimsUpload');
    this.router.navigate(['/nrlm-upload-screen']);
  }

  // cell clicked
  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
   // console.log(event);
    this.celldata =event.data;
    localStorage.setItem('bankCodeUser',event.data.bankCode)
    // alert(event.data.bankCode);
    let unitCode = event.data.unit;
    this.disabledFields = false;
   // console.log('UnitCOde', unitCode);
    localStorage.setItem('UnitCode', unitCode);
    localStorage.setItem('Status', event.data.status);
    localStorage.setItem('AuthStatus', event.data.Status);

    
    localStorage.setItem('claimsfyEnding', event.data.fyEnding);
    localStorage.setItem('claimsqtrEnding', event.data.qtrEnding);

  }

}
