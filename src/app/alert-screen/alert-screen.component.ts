import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { LoginServiceService } from '../services/login-service.service';
import { SelectRolesPopupComponent } from '../select-roles-popup/select-roles-popup.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';
@Component({
  selector: 'app-alert-screen',
  templateUrl: './alert-screen.component.html',
  styleUrls: ['./alert-screen.component.css']
})
export class AlertScreenComponent {
  username:any;
  password:any;
  LeCode:any;
  accountLockMsg: any;
  loginData:any =[];
showLogoutPopup:boolean =false;
rolesData:any = [];
validRoles: any = [];
rolesLength:any;
captchatoken: any;
  ngOnInit(): void {
    let popupText =localStorage.getItem('errorMessage');
  this.username =  localStorage.getItem("userName");
   this.password =  localStorage.getItem("Password");
   this.LeCode = localStorage.getItem("LeCode");
    this.accountLockMsg = JSON.parse(popupText?popupText:'')
    if(this.accountLockMsg == "Are you wanting to logout the user who is already logged into another system ?") {
this.showLogoutPopup = true;
// alert("Hellooo")
    }
    // alert(this.accountLockMsg);
  }
  constructor(private dialogRef: MatDialogRef<any>,public dialog: MatDialog,private router: Router,private loginService: LoginServiceService,private recaptchaV3Service: ReCaptchaV3Service) { }
  closepopup() {

    this.dialogRef.close();

  }

  send(): void {
 
    this.recaptchaV3Service.execute('importantAction')
    .subscribe((token: string) => {
      this.captchatoken = token;
      this.goLogin();
      console.log(`Token [${token}] generated`);
    });
  }

  goLogin() {
    this.dialogRef.close();
    let isLogout = true;
    // let captchatoken =   localStorage.getItem('captchatoken');
    // console.log(captchatoken);
 
    this.loginService.getloginDeatils(this.username, this.password,this.captchatoken, isLogout).subscribe((res: any) => {
      console.log("Response", res)
      if (res) {
        localStorage.setItem("loginUserId",res.userId);
        this.dialogRef.close();
        sessionStorage.setItem("UserToken",res.token)
        this.loginData = res.roles;
        if (res.success == false) {
          let messg = res.message;
          localStorage.setItem('errorMessage',JSON.stringify(messg) );

          this.dialog.open(AlertScreenComponent, { panelClass: 'deactiveSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });

          // this.dialogRef.close();
        }
        sessionStorage.setItem("UserId", JSON.stringify(this.loginData))
        console.log("Login Data", this.loginData);
        localStorage.setItem('token', res.token)
        localStorage.setItem('tokenExpirationTimeInMinutes', JSON.stringify(res?.tokenExpirationTimeInMinutes))
        this.loginService.getRoles(this.LeCode).subscribe((res: any) => {
          console.log("ROlesRsponse", res)
          if (res) {
            this.rolesData = res;
            localStorage.setItem("RolesArray", this.rolesData)
            this.validRoles = getValidRoles(this.loginData, this.rolesData)
            this.rolesLength = this.validRoles.length;
            // this.RolesArray = validRoles;
            console.log("Valid Roles", this.validRoles);
            interface RoleData {
              role: string;
              roleCode: number;
            }

            function getValidRoles(rolesFromLogin: number[], rolesData: RoleData[]): RoleData[] {
              const validRoles: RoleData[] = [];
              for (const roleData of rolesData) {
                if (rolesFromLogin.includes(roleData.roleCode)) {
                  validRoles.push(roleData);
                }
              }
              return validRoles;
            }
            console.log("ROlesLength2", this.rolesLength);
            console.log("Valid Roles2", this.validRoles);
            if (this.rolesLength > 1) {
              localStorage.setItem("validRoles", JSON.stringify(this.validRoles))
              this.dialog.open(SelectRolesPopupComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
              this.dialogRef.close();
            }
            else {
              localStorage.setItem("validRoles", JSON.stringify(this.validRoles));
              this.router.navigate(['/dashboard-screen']);
            }
          }
        },
          (err: any) => {
            // if (err.error.message == 'Login failed') {
            //   alert("Login Failed! Incorrect Username or Password")
            // }
          }
        );
      }
    },
      (err: any) => {
        if (err.error.message == 'Login failed') {
          alert("Login Failed! Incorrect Username or Password")
        }
      }
    );
  }
  showAlert() {
    this.dialogRef.close();
    // this.dialog.open(LoginPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:true})
    this.dialog.open(LoginPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false}
    );
  }
}
