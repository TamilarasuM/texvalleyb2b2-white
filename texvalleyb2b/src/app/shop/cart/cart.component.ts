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
  public products: Product[] = [];
  public shippingDetails: any;
  public totalTax = 0;
  public totalAmt = 0;
  public couponAmt =0;
  public couponCode ="";
  public removedCartId = "";

  public templateProduct = { "id": 1, "title": "Kids T-Shirt- Sivam", "description": " desc", "type": "fashion", "brand": "nike", "collection": ["new products"], "category": "Women", "price": "550.00", "sale": true, "stock": 5, "new": true, "tags": ["new", "s", "m", "yellow", "white", "pink", "nike"], "variants": [{ "variant_id": 101, "id": 1, "sku": "sku1", "size": "S", "color": "#ff0000", "image_id": 111 }], "images": [{ "image_id": 111, "id": 1, "alt": "yellow", "src": "//stage.texvalleyb2b.in/undefined", "variant_id": [101, 104] }], "quantity": 3 }

  constructor(public productService: ProductService, private router: Router, private tst:ToastrService) {
    // this.productService.cartItems.subscribe(response => this.products = );
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
      if (response.length) {
        this.products = this.convertToProduct(response);
        this.productService.cartDetails.next(this.products);
        // localStorage.removeItem("cartItems")
        // localStorage.setItem("cartItems", JSON.stringify(this.products))
        if (this.products.length > 0) {
          this.isShippingDetails = true;
          this.SignupForm.setValue({
            address: this.products[0]["shipping_address"],
            city: this.products[0]["city"],
            company_name: "Company test",
            email_id: this.products[0]["email_id"],
            mobile_no: this.products[0]["mobile_no"],
            pincode: this.products[0]["pin_code"]
          })
        }
        // this.shippingDetails["name"]=this.products[0]["company_name"];
        // this.shippingDetails["phone"]=this.products[0]["mobile_no"];
        // this.shippingDetails["email"]=this.products[0]["email_id"];
        // this.shippingDetails["shipping_address"]=this.products[0]["shipping_address"];
        // this.shippingDetails["city"]=this.products[0]["city"];
        // this.shippingDetails["pincode"]=this.products[0]["pin_code"];
      }
    });
  }

  public convertToProduct(response: any) {
    var productList = [];
    this.totalTax =0;
    var priceSum = 0;
    debugger
    for (var i = 0; i < response.length; i++) {
      this.couponCode = response[0].coupon_code;
      this.couponAmt =  parseInt(response[i].coupon_amount);
      this.templateProduct.title = response[i].product_name;
      response[i]["size"] = response[i].Size_Range;
      productList.push(Object.assign({}, this.templateProduct, response[i]))
      this.totalTax = this.totalTax + parseInt(response[i].total_tax);
      priceSum = priceSum + parseInt(response[i].total);
    }
    this.totalAmt = priceSum + this.totalTax  +  this.couponAmt; 

    return productList;
  }

  public applyCouponCode(code){
    debugger
    this.productService.applyCouponCode(code).subscribe( (function (res) { 
      debugger
      if(res[0].status != 1)
      this.tst.error(res[0].message)
      else {
        this.tst.success(res[0].message)
        this.couponAmt = res[0].amount;
        this.totalAmt  =  this.totalAmt  +  this.couponAmt ;
        // this.router.navigate(['/shop/cart'])
      }

    }).bind(this))
  }

  public confirmOrder() {
    this.productService.confirmOrders().subscribe((res) => {
      this.router.navigate(['/order/success', res[0]["order_no"]])
      this.productService.cartDetails.next([]);
    })

  }
  public get getTotal() {
    var total = 0;
    for (var i = 0; i < this.products.length; i++) {
      total = total + parseInt(this.products[i]["total"]);
    }

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

  public removeItem(product: any) {
    this.removedCartId = product.cart_id;
    this.productService.removeCartItem(product).subscribe((function (response) {
      if (response.length > 0 && response[0].status.indexOf("Success") > -1) {
        var cartId = this.removedCartId;
        this.products = this.products.filter(function (e) { return e.cart_id != cartId; });
      }
    }).bind(this));
  }

}
