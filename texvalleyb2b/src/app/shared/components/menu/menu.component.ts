import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public menuItems: Menu[];

  constructor(private router: Router, public navServices: NavService, public productSvc:ProductService) {
    this.navServices.items.subscribe(menuItems => {
      if(menuItems.length>0){
        debugger
        menuItems =  menuItems.filter( function(args) {  
          if(!(args.title.indexOf("My Account")>-1 || args.title.indexOf("Login")>-1 || args.title.indexOf("Buyer Benifits")>-1 || args.title.indexOf("Why Texvalley B2B")>-1))
          return args;
        } )
        // if(menuItems[menuItems.length-1].title.indexOf("My Account")>-1 || menuItems[menuItems.length-1].title.indexOf("Login")>-1)
        //   menuItems.pop();
        menuItems = this.navServices.updateMenus(menuItems);
      }
        this.menuItems = menuItems;
     });
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {
    
  }

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }
  logout(){
    localStorage.removeItem("LoginDetails");
    this.productSvc.cartDetails.next([]);
    this.router.navigate(['/home/fashion']);
  }


  

}
