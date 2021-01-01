import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss'],
  host: {
    '(document:click)': 'outsideClick($event)',
  },
})
export class HeaderOneComponent implements OnInit {

  @Input() class: string;
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false

  public stick: boolean = false;
  public isLogin = localStorage.getItem("LoginDetails") == null ? false : true;
  public userName = localStorage.getItem("LoginDetails") == null ? "Guest" : JSON.parse(localStorage.getItem("LoginDetails"))["login_name"];

  constructor(private router: Router, private productSvc: ProductService, private http: HttpClient) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem("LoginDetails") == null ? "Guest" : JSON.parse(localStorage.getItem("LoginDetails"))["login_name"];

  }


  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number >= 150 && window.innerWidth > 400) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }

  searchData(args) {
    if(args.target.value!="")
      this.router.navigate(['/products',args.target.value])
  }
  outsideClick(args){

    if(!(args.target.className.indexOf("search")>-1))
     {
      this.hide();
    }
  }
  

  logout() {
    localStorage.removeItem("LoginDetails");
    this.productSvc.cartDetails.next([]);
    this.isLogin = false;
    this.router.navigate(['/home/fashion']);

  }


  search = '';
  timeout = null;
  show = false;
  searchTickers = [];

  open() {
    this.show = true
  }
  hide() {
    this.show = false
  }
  clear() {
    this.search = ''
  }
  getStockImage(symbol) {
    return `https://financialmodellingprep.com/images-New-jpg/${symbol.toUpperCase()}.jpg`
  }

  fetchResults(symbol, count) {
    if (!symbol) this.hide();
    // this.http.get<any>(`https://financialmodelingprep.com/api/v3/search?query=${symbol}&limit=100&apikey=demo`).subscribe(data => {
    //   console.log(data)
    //   this.searchTickers = data;
    // })
  }
  searchFunc(val) {
    this.search = val;
    if (val != '') {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.show = true

        this.fetchResults(this.search, 10)

      }, 500);
    } else {
      this.clear();
      this.hide();
    }

  }

}
