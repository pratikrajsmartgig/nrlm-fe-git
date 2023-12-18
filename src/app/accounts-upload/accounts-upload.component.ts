import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CellClickedEvent, FirstDataRenderedEvent, GridReadyEvent, GridApi, } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
// @ts-ignore
import printDoc from 'src/assets/js/printDoc';
import { DatePipe } from '@angular/common';
import { NgxSpinner, NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';

@Component({
  selector: 'app-accounts-upload',
  templateUrl: './accounts-upload.component.html',
  styleUrls: ['./accounts-upload.component.css']
})
export class AccountsUploadComponent {
  now: any;
  bankCode: any;
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
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      minWidth: 300,
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
      suppressSizeToFit: true,
      resizable: true, width: 250,
      comparator:this.dateComparator
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
      resizable: true,
      width: 250,
      comparator:this.dateComparator2
    },
    {
      headerName: 'Total Records',
      field: 'totalRecords',
      tooltipField: 'totalRecords',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
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
  public pageSize = 20;
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }
  disabled = false;
  selectedItems: any = [];
  constructor(private dateFormatService:DateFormatServiceService,private dateFormatServiceWithoutTime:DateFormatWithoutTimeService,private entityGridService: SharedEntityServiceService, private spinner: NgxSpinnerService, private fb: FormBuilder, public dialog: MatDialog, private router: Router, private entityService: EntityScreenServiceService, private datePipe: DatePipe) {
    this.tokenExpireyTime = localStorage.getItem(
      'tokenExpirationTimeInMinutes'
    );
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;

  ngOnInit() {
    let data: any = localStorage.getItem('sideNavbar');
    this.entitlements = JSON.parse(data ? data : '');
    this.entitlements.forEach((elements: any) => {
      if (elements == 'View') {
        this.viewPermission = true;
      } else if (elements == 'Add') {
        this.AddPermission = true;
        this.changeLevelIden = false;
      } else if (elements == 'FileUpload') {
        this.uploadPermission = true;
      } else if (elements == 'FileView') {
        this.fileView = true;
      } else if (elements == 'Edit') {
        this.EditPermission = true;
      } else if (elements == 'Authorize') {
        this.authorizePermission = true;
        this.changeLevelIden = false;
      }
    });
    this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: [''],
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
    this.selectedItemsArray.push('Unit');
    this.myForms.patchValue({
      name: this.toppingList,
    });
    this.getunits();
    this.getstartdate();
   
    setTimeout(()=>{
      this.getAccountCodesbyYear();
    },2000)
    this.resetPinned();
    // this.updateEndYears();
  }
  selectedStartYear: any
  selectedEndYear: any
  startYears: number[] = [];
  endYears: number[] = [];
  fyStart: string = ''
  fyEnd: string = ''



  // start year dropdown
  getstartdate() {
    this.entityService.getfinStartYear().subscribe((res: any) => {
      this.startYears = res.data;
      this.selectedStartYear = this.startYears[0];
      this.updateEndYears();
    })
  }
  EndYears() {


    // let val = item.map((dateString: any) => parseInt(dateString.split("-")[0]));
    
    // console.log('val',val);
   // this.fyEnd = '31-03-' + val
  // this.fyEnd = formattedDate;
  
  this.fyEnd = this.selectedEndYear;
  this.fyEnd = String(this.datePipe.transform(this.fyEnd,'dd-MM-YYYY'))
  }
  updateEndYears() {
    this.selectedEndYear = ''
    this.endYears = [];
    let item = [this.selectedStartYear]
    let val = item.map((dateString: any) => parseInt(dateString.split("-")[0]));;
    this.fyStart = this.selectedStartYear;
    this.fyStart = String(this.datePipe.transform(this.fyStart, 'dd-MM-YYY'))
    this.entityService.getFinalYear(this.fyStart).subscribe((res: any): any => {
      const yearArray = res.data.map((dateString: any) => parseInt(dateString.split("-")[0]));

      this.endYears = res.data;
      this.selectedEndYear = this.endYears[0];
      this.fyEnd = String(this.datePipe.transform(this.selectedEndYear, 'dd-MM-YYYY'));
     // this.getAccountCodesbyYear();
      // if (this.bankCode === '99') {
      //   this.getAccountCodesbyYear();
      // }
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
      setTimeout(() => { }, 1000);
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
  }

  // getsUnits Info
  unitsData: any = [];
  getunits() {
    this.entityService.getUnitsInfo().subscribe((res: any) => {
      // console.log(res);
      if (res.success === true) {
        if(res?.data.length === 1) {
          this.unitsData = res?.data;
          this.bankCode = this.unitsData[0].unit;
        }
        else {
          let allbank = {
            unit: '99',
            bank: 'All'
          }
          this.unitsData = res?.data;
          this.unitsData.push(allbank);
          this.bankCode = '99';
        }
      }
    },
      (err: any) => {
      }
    );
  }

  // getUploadedFiles
  uploadedfiles: any = [];
  submit() {
    // this.filterData();
    this.entityService.getShgCodesByYear(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
      this.getSghCodes()
    });
  }
  // getsghcodes by year
  getAccountCodesbyYear() {
    this.spinner.show();
    if (this.bankCode === '99') {
      console.log(this.fyEnd);
      this.entityService.getAccountsCodesAllBanksByYear(this.fyStart, this.fyEnd).subscribe((res: any) => {
        this.spinner.hide();
        console.log(res.data);
        this.accountsData = res.data;
      })
    }
    else {
      this.entityService.getAccountsCodesByYear(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
        this.spinner.hide();
        this.accountsData = res.data;
      })
    }
  }


  // submitAccountsUpload
  submitAccountsData() {
    alert("Helloo")
  }

  // getShgCodes
  accountsData: any = []
  getSghCodes() {
    this.entityService.getAccountUpload().subscribe((res: any) => {
      if (res.success === true) {
        this.accountsData = res?.data
      }
    }, (err: any) => {
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
    let items = ['Bank', 'FY Ending', 'Qtr End', 'Total Records'];
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  // pinning list
  leftPinnedColumns: string[] = [];
  rightPinnedColumns: string[] = [];
  toppingListLeft: any[] = [
    { field: 'bank', label: 'Bank' },
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr End' },
    { field: 'totalRecords', label: 'Total Records' },

  ];
  toppingListRight: any[] = [
    { field: 'bank', label: 'Bank' },
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr End' },
    { field: 'totalRecords', label: 'Total Records' },

  ];

  onItemSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    if (type == 'left') {
      this.leftPinnedColumns.push(item);
      this.toppingListRight = this.toppingListRight.filter(
        (x: any) => x.field != item
      );
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
      debugger;
      this.toppingListRight.push(obj);
    } else {
      this.rightPinnedColumns = this.rightPinnedColumns.filter(
        (x) => x != item
      );
      this.toppingListLeft.push(obj);
    }
    this.updatedColumnPinned();
  }
  onItemDeSelectOrAll(items: any, type: string) {
  }
  onItemSelectOrAll(itemss: any, type: string) {
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
    this.gridApi.setQuickFilter(target.value);
  }

  celldata: any


  downloadRecord() {
    let isView = JSON.stringify(false)
    let fyEnd = this.datePipe.transform(this.celldata.fyEnding, 'dd-MM-yyyy')
    let qtrEnd = this.datePipe.transform(this.celldata.qtrEnding, 'dd-MM-yyyy')
    this.spinner.show();
    this.entityService.downloadAccounts(this.celldata.bankCode, fyEnd, qtrEnd, isView).subscribe((res: any) => {
      const blob = new Blob([res.body], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.celldata.bank;
      link.click();
      window.URL.revokeObjectURL(url);
      this.spinner.hide();
    })
  }


  // icon functionality
  viewEnity() {
    let fyEnd: any = this.datePipe.transform(this.celldata.fyEnding, 'dd MMM YYYY')
    let qtrEnd: any = this.datePipe.transform(this.celldata.qtrEnding, 'dd MMM YYYY')


    localStorage.setItem('accountFyEnd', fyEnd);
    localStorage.setItem('accountqtrEnd', qtrEnd)
    localStorage.setItem('accountbankcode', this.celldata.bankCode)



    localStorage.setItem('fyEndUser', fyEnd)
    localStorage.setItem('qtrEndUser', qtrEnd)
    localStorage.setItem("accountsView", "dataView");
    localStorage.setItem('entityData', 'viewData');
    this.router.navigate(['/view-accounts-upload']);
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
    localStorage.setItem('uploadFileType', 'account');
    this.router.navigate(['/nrlm-upload-screen']);
  }

  // cell clicked
  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    this.celldata = event.data;
    localStorage.setItem('bankCodeUser', event.data.bankCode)
    let unitCode = event.data.unit;
    this.disabledFields = false;
    localStorage.setItem('UnitCode', unitCode);
    localStorage.setItem('Status', event.data.status);
    localStorage.setItem('AuthStatus', event.data.Status);
    localStorage.setItem('regionalOffice', event.data.regionalOffice);


  }

}
