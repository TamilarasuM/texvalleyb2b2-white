import { Component, Input, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {

  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/images/icon/logo.png' // Default Logo
  @Input() newsletter: boolean = true; // Default True

  public today: number = Date.now();
  public items=[];
  constructor(private navServices:NavService) { 
    this.navServices.items.subscribe(menuItems => {
      var menus = Object.assign([],menuItems);
      // menus.pop()
      this.items = menus;
     });
  
  }

  ngOnInit(): void {
  }

}
