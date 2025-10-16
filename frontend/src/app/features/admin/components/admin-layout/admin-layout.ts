import { Component } from '@angular/core';
import {faChartBar, faSignInAlt, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {TokenService} from '../../../../core/services/token.service';


@Component({
  selector: 'app-admin-layout',
  imports: [FontAwesomeModule,CommonModule, RouterModule],
  standalone: true,
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {


  faUserPlus=faUserPlus;
  faChartBar=faChartBar;
  faSignOutAlt=faSignInAlt;

  constructor(private token:TokenService,private router:Router) {}

  logout(){
    this.token.clear();
    this.router.navigate(['/home']);
  }


}
