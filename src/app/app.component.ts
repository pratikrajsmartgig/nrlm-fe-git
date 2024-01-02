// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'NRML-Project';
// }
import { Component } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NRLM-Project';
  previousURL:any;
  currentURL = '';
  private destroy$ = new Subject<void>();
  constructor(public router: Router) {
    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Update your sidenav here
        console.log(event.url);
        this.currentURL = event.url;
        this.previousURL = localStorage.getItem('previousURL');
        if(this.currentURL != this.previousURL){
          if(this.currentURL ==='/dashboard-screen')
          this.updateSidenav();
        }
         this.previousURL = this.currentURL;
        localStorage.setItem('previousURL',this.previousURL);
        
     
      }
    });
  }
  ngOnInit(){
    console.log = function(){};
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateSidenav(){
    window.location.reload();
    console.log("yahooo");
  }

  
}
