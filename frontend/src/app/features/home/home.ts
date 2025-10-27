import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Navbar } from "../../shared/components/navbar/navbar";
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [Navbar, CommonModule ],
  templateUrl: './home.html',

})
export class Home implements OnInit {
  constructor() {}

  ngOnInit(): void {
    initFlowbite();
    // Initialization logic can go here
  }



}
