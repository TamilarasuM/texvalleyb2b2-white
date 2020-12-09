import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {

  public product: any = {};
  public counter: number = 1;
  public sizeCost: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public productAttributes = [];
  public productID;
  public isVerifyKYC = false;
  public a_id;
  public loginDetails = localStorage.getItem("LoginDetails");


  @ViewChild("sizeChart") SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private route: ActivatedRoute, private router: Router,
    public productService: ProductService, private tost: ToastrService) {
    this.route.data.subscribe(response => {
      this.product = response.data
    });
  }

  ngOnInit(): void {
    false
    this.isVerifyKYC = (this.loginDetails == null) ? false : (JSON.parse(this.loginDetails).verified == "0" ? true : false);
    this.productID = this.route.snapshot.params["slug"];
    this.productService.getProductDetails(this.productID).subscribe((function (res) {
      debugger
      var data = Object.assign({}, this.productService.templateJSON, res[0]);
      this.productAttributes = res[0].attribute_details;
      this.productService.templateJSON["price"] = data.cost;
      this.productService.templateJSON["title"] = data.product_name;
      this.productService.templateJSON["tv_code"] = data.tv_code;
      this.productService.templateJSON["UOM"] = data.UOM;
      this.productService.templateJSON["Minimum_Pack_Qty"] = data.Minimum_Pack_Qty;
      this.productService.templateJSON["Minimum_Order_QTY"] = data.min_order;
      this.productService.templateJSON["Dimensions"] = data.Dimensions;
      this.productService.templateJSON["Weight"] = data.Weight;
      this.productService.templateJSON["Quality"] = data.Quality;
      this.productService.templateJSON["Size_Range"] = data.Size_Range;
      this.productService.templateJSON["delivery"] = data.delivery;
      this.productService.templateJSON["size_standard"] = data.size_standard;
      this.productService.templateJSON["Special_Instruction"] = data.Special_Instruction;
      this.productService.templateJSON["product_info"] = data.product_info;

      this.productService.templateJSON["brand"] = data.brand;
      this.a_id = res[0].a_id
      this.selectedSize = res[0].size;
      this.sizeCost = parseInt(res[0].cost);


      // this.productService.templateJSON["images"][0].src = data.image_url;
      this.productService.templateJSON["images"] = data.images;
      this.productService.templateJSON.variants = [];
      for (var i = 0; i < res.length; i++) {
        debugger
        var template = { "variant_id": 101, "id": 1, "sku": "sku1", a_id: res["a_id"], price : res[i].cost, "size": res[i].size, "color": data.color, "image_id": 111 }
        this.productService.templateJSON.variants.push(template);
        // this.productService.templateJSON.variants[i].size = res[i].size;
        // this.productService.templateJSON.variants[i].color = data.color;
      }
      // this.productService.templateJSON["images"][1].src = "//stage.texvalleyb2b.in/"+data.image_url;
      // this.productService.templateJSON["images"][2].src = "//stage.texvalleyb2b.in/"+data.image_url;
      this.product = this.productService.templateJSON;

    }).bind(this))
  }

  // Get Product Color
  Color(variants) {
    debugger
    const uniqColor = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
      if (this.selectSize == variants[i].size)
        this.a_id = variants[i].a_id;
    }
    return uniqColor
  }

  // Get Product Size
  Size(variants) {
    debugger
    const uniqSize = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
        uniqSize.push(variants[i].size)
      }
      if (this.selectSize == variants[i].size){
        this.a_id = variants[i].a_id;
        this.sizeCost = parseInt(variants[i].cost);
      }
    }
    return uniqSize
  }

  selectSize(size) {
    debugger
    this.selectedSize = size;
  }

  // Increament
  increment() {
    this.counter++;
  }

  updateCount(target) {
    this.counter = isNaN(parseInt(target.value)) ? 1 : parseInt(target.value);
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  getTotalOrderValue() {
    return (this.counter * this.sizeCost)
  }

  // Add to cart
  async addToCart(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    var productDetails = { price: product["price"], quantity: product.quantity, productID: this.productID, a_id: this.a_id }

    if (localStorage.getItem("LoginDetails") == null) {
      this.tost.error("user not loagged in, navigating to login page..")
      this.router.navigate(['/login']);
    }
    else {
      this.productService.addCartDetails(productDetails);
      this.productService.getCartDetails().subscribe((response) => {
        var products = this.productService.convertToProduct(response);
        this.productService.cartDetails.next(products);
      })
    }
    //if(status)
    // this.router.navigate(['/shop/cart']);
  }

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/checkout']);
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

}
