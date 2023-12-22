import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutServiceService } from '../services/logout-service.service';
 
@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.css']
})
export class LogoutDialogComponent {
  constructor(private logoutService: LogoutServiceService,public dialog: MatDialog,private router: Router){}
closeDialog() {
this.show = false;
}
openDialog() {
  //this.getpassword = localStorage.getItem('getpassword');
    this.show = true;
}
  show: any;
  Logout() {
  this.show = false;
    this.logoutService.logout().subscribe((res: any) => {
      if (res) {
         let logoutResponse = res;
           console.log("LogoutResponse",logoutResponse);
           
        this.router.navigate(['/home']);
      }
    },
      (err: any) => {
        // alert(err.error.message)
      }
    );
    window.localStorage.clear();
   window.sessionStorage.clear();
    }
    preventClose(event: MouseEvent): void {
      // Stop event propagation to prevent closing the popup
      event.stopPropagation();
    }
 
}