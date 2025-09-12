import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Navbar } from "../../shared/navbar/navbar";
import { Modulos } from "../modulos/modulos";

@Component({
  selector: 'app-home',
  imports: [Navbar, ],
  templateUrl: './home.html',
  
})
export class Home implements OnInit {
  constructor() {}

  ngOnInit(): void {
    initFlowbite();
    // Initialization logic can go here
  }
    


}
