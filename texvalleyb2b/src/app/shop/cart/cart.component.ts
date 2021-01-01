import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  SignupForm: FormGroup;
  public isShippingDetails = false;
  public initalLoad = true;
  public products: Product[] = [];
  public shippingDetails: any;
  public totalTax = 0;
  public totalAmt = 0;
  public availableWallet =0;
  public walletAmt =0;
  public useWalletAmt: boolean =false;
  public validateOrder: boolean =false;
  

  public couponAmt =0;
  public couponCode ="";
  public removedCartId = "";
  public templateProduct = { "id": 1, "title": "Kids T-Shirt- Sivam", "description": " desc", "type": "fashion", "brand": "nike", "collection": ["new products"], "category": "Women", "price": "550.00", "sale": true, "stock": 5, "new": true, "tags": ["new", "s", "m", "yellow", "white", "pink", "nike"], "variants": [{ "variant_id": 101, "id": 1, "sku": "sku1", "size": "S", "color": "#ff0000", "image_id": 111 }], "images": [{ "image_id": 111, "id": 1, "alt": "yellow", "src": "//stage.texvalleyb2b.in/undefined", "variant_id": [101, 104] }], "quantity": 3 }

  constructor(public productService: ProductService, private router: Router, private tst:ToastrService) {
  }

  ngOnInit(): void {

    this.SignupForm = new FormGroup({
      'company_name': new FormControl(null, [Validators.required]),
      'mobile_no': new FormControl(null, [Validators.required]),
      'email_id': new FormControl(null, [Validators.required, Validators.email]),
      'city': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'pincode': new FormControl(null, [Validators.required]),
    });

    this.productService.getCartDetails().subscribe((response) => {
      this.initalLoad =false;
      if (response.length) {
        this.products = this.convertToProduct(response);
        this.productService.cartDetails.next(this.products);
        this.getOrderTotal;
        if (this.products.length > 0) {
          this.isShippingDetails = true;
          this.SignupForm.setValue({
            address: this.products[0]["shipping_address"],
            city: this.products[0]["city"],
            company_name: this.products[0]["company_name"],
            email_id: this.products[0]["email_id"],
            mobile_no: this.products[0]["mobile_no"],
            pincode: this.products[0]["pin_code"]
          })
        }
      }
    });
  }

  public convertToProduct(response: any) {
    var productList = [];
    this.totalTax =0;
    var priceSum = 0;
    for (var i = 0; i < response.length; i++) {
      this.couponCode = response[0].coupon_code;
      this.availableWallet =  response[0].available_wallet;
      this.walletAmt = parseInt(response[0].wallet_amount);
      this.useWalletAmt = this.walletAmt < 0;
      this.couponAmt =  parseInt(response[i].coupon_amount);
      this.templateProduct.title = response[i].product_name;
      response[i]["size"] = response[i].size;
      productList.push(Object.assign({}, this.templateProduct, response[i]))
      this.totalTax = this.totalTax + parseInt(response[i].total_tax);
      priceSum = priceSum + parseInt(response[i].total);
    }
    this.totalAmt = priceSum + this.totalTax  +  this.couponAmt; 
    return productList;
  }

  public applyCouponCode(code){
    
    this.productService.applyCouponCode(code).subscribe( (function (res) { 
      
      if(res[0].status != 1) {
        this.tst.error(res[0].message)
        this.couponAmt = 0
      }
      else {
        this.tst.success(res[0].message)
        this.couponAmt = res[0].amount;
        this.totalAmt  =  this.totalAmt  +  this.couponAmt ;
        // this.router.navigate(['/cart'])
      }

    }).bind(this))
  }

  public appyWalletAmt(amt){
    
    this.productService.appyWalletAmt(amt).subscribe( (function (res) { 
      if(res[0].status != 1) {
        this.tst.error(res[0].message)
      }
      else {
        this.tst.success(res[0].message)
        this.walletAmt =  res[0]["amount"];
        this.availableWallet = res[0]["available_wallet"];
        
        // this.couponAmt = res[0].amount;
        // this.totalAmt  =  this.totalAmt  +  this.couponAmt ;
        // this.router.navigate(['/cart'])
      }

    }).bind(this))
  }

  public confirmOrder() {
    this.productService.confirmOrders(this.SignupForm.value).subscribe((res) => {
      this.router.navigate(['/order/success', res[0]["order_no"]])
      this.productService.cartDetails.next([]);
    })

  }
  public get getTotal() {
    var total = 0;
    var totalTax=0;
    for (var i = 0; i < this.products.length; i++) {
      total = total + parseInt(this.products[i]["total"]);
      totalTax = totalTax + parseInt(this.products[i]["total_tax"]);
    }
    this.totalTax = totalTax;
    return total; //this.productService.cartTotalAmount();
  }


  // Increament
  increment(product, qty = 1) {
    this.productService.updateCartQuantity(product, qty);
  }

  // Decrement
  decrement(product, qty = -1) {
    this.productService.updateCartQuantity(product, qty);
  }

  public get getOrderTotal() {

    var orderAmt = this.couponAmt + this.totalTax + this.getTotal + this.walletAmt;
    this.validateOrder = orderAmt>= 2000;
    return  orderAmt;
  }

  public removeItem(product: any) {
    debugger
    this.removedCartId = product.cart_id;
    this.productService.removeCartItem(product).subscribe((function (response) {
      if (response.length > 0 && response[0].status.indexOf("Success") > -1) {
        var cartId = this.removedCartId;
        this.products = this.products.filter(function (e) { return e.cart_id != cartId; });
      }
    }).bind(this));
  }

}
