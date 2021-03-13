import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { Product } from '../classes/product';

const state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  compare: JSON.parse(localStorage['compareItems'] || '[]'),
  cart: JSON.parse(localStorage['cartItems'] || '[]')
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public Currency = { name: 'Dollar', currency: 'USD', price: 1 } // Default Currency
  public OpenCart: boolean = false;
  public isLogin: boolean = false;
  public isKYCVerified: boolean = false;
  public Products;
  public cartDetails = new BehaviorSubject([]);
  public urlCollection = environment.applicationUrl;
  public templateProduct = { "id": 1, "title": "Kids T-Shirt- Sivam", "description": " desc", "type": "fashion", "brand": "nike", "collection": ["new products"], "category": "Women", "price": "550.00", "sale": true, "stock": 5000, "new": true, "tags": [], "variants": [{ "variant_id": 101, "id": 1, "sku": "sku1", "size": "S", "color": "#ff0000", "image_id": 111 }], "images": [{ "image_id": 111, "id": 1, "alt": "yellow", "src": "//stage.texvalleyb2b.in/undefined", "variant_id": [101, 104] }], "quantity": 3 }
  public templateJSON = {
    "id": 1, "title": "trim dress", "description": " desc", "type": "fashion", "brand": "nike", "collection": ["new products"], "category": "Women", "price": 145, "sale": true,
    "stock": 5000, "new": true, "tags": [],
    "variants": [
      { "variant_id": 101, "id": 1, "sku": "sku1", "size": "s", "color": "yellow", "image_id": 111 }
    ],
    "images": [ { "image_id": 111, "id": 1, "alt": "yellow", "src": "assets/images/product/fashion/39.jpg", "variant_id": [101, 104] }
    ]
  }
  constructor(private http: HttpClient,
    private toastrService: ToastrService) {
    this.isLogin = localStorage.getItem("LoginDetails") == null ? false : true;
    if(this.isLogin) {
      var userDetails = JSON.parse(localStorage.getItem("LoginDetails"));
      this.isKYCVerified = userDetails["verified"] == 0 ? false : true;
    }
  }
  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */
  // Product
  private get products(): Observable<Product[]> {
    this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
    this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }
  public getProductSearchList(search: string) {
    // var searchUrl = "https://stage.texvalleyb2b.in/api_web/get_search_products.php";
    var params = { keyword: search }//{ "segment_id": S_ID, "sub_segment_id": "", "category_id": "", "sub_category_id": "", "product_name": pname}
    var headers = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>(environment.applicationUrl.searchUrl, JSON.stringify(headers))
  }
  public getProductList(S_ID: string, pname: string ,  paginatedCnt:number) {
    var offsetCnt=  paginatedCnt +30;
    // var getProductListURL = "https://stage.texvalleyb2b.in/api_web/get_product.php";
    var params = { "segment_id": S_ID, "sub_segment_id": "", "category_id": "", "sub_category_id": "", "product_name": pname,offset:offsetCnt  }
    var headers = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>(environment.applicationUrl.getProductListUrl, JSON.stringify(headers))
  }
  public getNewArivals() {
    // var getNewArivalsUrl = "https://stage.texvalleyb2b.in/api_web/get_new_arrival.php"
    var params = { "segment_id": "", "sub_segment_id": "", "category_id": "", "sub_category_id": "", "product_name": "" }
    var headers = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>(environment.applicationUrl.getNewArivalsUrl, JSON.stringify(headers))
  }
  public getState() {
    // var getState = "https://stage.texvalleyb2b.in/api_web/get_state.php";
    return this.http.get<any>(environment.applicationUrl.getStateUrl).pipe(map(data => { return data }))
  }
  public addCartDetails(product) {
    // var addCartDetailsURL = "https://stage.texvalleyb2b.in/api_web/add_cart.php"
    var params = { "a_id": product.a_id, "product_id": product.productID, "quantity": product.quantity, "price": product["price"] }
    var paramsdata = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>(environment.applicationUrl.addCartDetailsUrl, JSON.stringify(paramsdata)).pipe(map(data => {
      return data
    })).subscribe((res) => {
      if (res.length > 0 && res[0]["status"].indexOf("Success") > -1)
        this.toastrService.success('Successfully added your item to cart..');
    })
  }
  public getProductDetails(pId: string) {
    // var productDetailsUrl = "https://stage.texvalleyb2b.in/api_web/get_product_details.php";
    var params = Object.assign({ "product_id": pId}, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>(environment.applicationUrl.productDetailsUrl, JSON.stringify(params)).pipe(map(data => {
      for (var i = 0; i < data.length; i++)
        data[i]["size"] = data[i]["attributes"][0]["a_value"];
      return data
    }))
  }
  public getOrderDetails() {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    // var getOrderDetailsUrl = "https://stage.texvalleyb2b.in/api_web/get_order.php";
    return this.http.post<any>(environment.applicationUrl.getOrderDetailsUrl, JSON.stringify(params));
  }
  public getOrderCollectionDetail(orderId) {
    var params = JSON.parse(localStorage.getItem("LoginDetails"));
    params.order_id = orderId;
    var getOrderCollectionDetailUrl = "https://stage.texvalleyb2b.in/api_web/get_order_items.php";
    return this.http.post<any>(environment.applicationUrl.getOrderCollectionDetailUrl, JSON.stringify(params));
  }
  public initiatePayement(orderId) {
    // var params = JSON.parse(localStorage.getItem("LoginDetails"));
    var params = { order_id: orderId }
    var paymentInitateUrl = "https://stage.texvalleyb2b.in/api_web/initiate_payment.php";
    return this.http.post<any>(environment.applicationUrl.paymentInitateUrl, JSON.stringify(params));
  }
  public updatedTranStatus(params) {
    // var params = { order_id: orderId }
    var  tranUpdateUrl = "https://stage.texvalleyb2b.in/api_web/update_payment.php";
    return this.http.post<any>(tranUpdateUrl, JSON.stringify(params));
  }
  // Get Products
  public get getProducts(): Observable<Product[]> {
    return this.products;
  }
  // Get Products By Slug
  public getProductBySlug(slug: string): Observable<Product> {
    return this.products.pipe(map(items => {
      return items.find((item: any) => {
        return item.title.replace(' ', '-') === slug;
      });
    }));
  }
  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */
  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }
  // Add to Wishlist
  public addToWishlist(product): any {
    const wishlistItem = state.wishlist.find(item => item.id === product.id)
    if (!wishlistItem) {
      state.wishlist.push({
        ...product
      })
    }
    this.toastrService.success('Product has been added in wishlist.');
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }
  // Remove Wishlist items
  public removeWishlistItem(product: Product): any {
    const index = state.wishlist.indexOf(product);
    state.wishlist.splice(index, 1);
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }
  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */
  // Get Compare Items
  public get compareItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.compare);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }
  // Add to Compare
  public addToCompare(product): any {
    const compareItem = state.compare.find(item => item.id === product.id)
    if (!compareItem) {
      state.compare.push({
        ...product
      })
    }
    this.toastrService.success('Product has been added in compare.');
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }
  // Remove Compare items
  public removeCompareItem(product: Product): any {
    const index = state.compare.indexOf(product);
    state.compare.splice(index, 1);
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

 

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */
  // Get Cart Items
  public get cartItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.cart);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }
  // Add to Cart
  public addToCart(product): any {
    const cartItem = state.cart.find(item => item.id === product.id);
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;
    const stock = this.calculateStockCounts(items, qty);
    // if(!stock) return false
    // if (cartItem) {
    //     cartItem.quantity += qty    
    // } else {
    //   state.cart.push({
    //     ...product,
    //     quantity: qty
    //   })
    // }
    this.OpenCart = true; // If we use cart variation modal
    // localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }
  // Update Cart Quantity
  public updateCartQuantity(product: Product, quantity: number): Product | boolean {
    return state.cart.find((items, index) => {
      if (items.id === product.id) {
        const qty = state.cart[index].quantity + quantity
        const stock = this.calculateStockCounts(state.cart[index], quantity)
        if (qty !== 0 && stock) {
          state.cart[index].quantity = qty
        }
        // localStorage.setItem("cartItems", JSON.stringify(state.cart));
        return true
      }
    })
  }
  // Calculate Stock Counts
  public calculateStockCounts(product, quantity) {
    const qty = product.quantity + quantity
    const stock = product.stock
    if (stock < qty || stock == 0) {
      // this.toastrService.success('You can not add more items than available. In stock '+ stock +' items.');
      return false
    }
    return true
  }
  // Remove Cart items
  public removeCartItem(product: Product): any {
    // var deleteCartURL = "https://stage.texvalleyb2b.in/api_web/delete_cart.php";
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    params.cart_id = product["cart_id"];
    return this.http.post<any>(environment.applicationUrl.deleteCartUrl, JSON.stringify(params))
  }
  // Total amount 
  public convertToProduct(response: any) {
    var productList = [];
    var priceSum = 0;
    for (var i = 0; i < response.length; i++) {
      this.templateProduct.title = response[i].product_name;
      response[i]["size"] = response[i].size;
      productList.push(Object.assign({}, this.templateProduct, response[i]))
    }
    return productList;
  }
  public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((product: Product[]) => {
      return product.reduce((prev, curr: Product) => {
        let price = curr.price;
        if (curr.discount) {
          price = curr.price - (curr.price * curr.discount / 100)
        }
        return (prev + price * curr.quantity) * this.Currency.price;
      }, 0);
    }));
  }
  public getCartDetails() {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    return this.http.post<any>("https://stage.texvalleyb2b.in/api_web/get_cart.php", JSON.stringify(params))
  }
  public confirmOrders(shippingAdress:any) {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    var headers = Object.assign(params, {shipping_address: JSON.stringify(shippingAdress)});
    // var confirmOrderUrl = "https://stage.texvalleyb2b.in/api_web/confirm_order.php";
    return this.http.post<any>(environment.applicationUrl.confirmOrderUrl, JSON.stringify(headers))
  }
  public applyCouponCode(code) {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    params.coupon_code = code;
    // var couponUrl = "https://stage.texvalleyb2b.in/api_web/update_coupon.php";
    return this.http.post<any>(environment.applicationUrl.couponUrl, JSON.stringify(params))
  }
  public appyWalletAmt(amt) {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    params.wallet_amount = amt;
    return this.http.post<any>(environment.applicationUrl.updateWalletUrl, JSON.stringify(params))
  }
  getProfile() {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    // var getProfileUrl = " https://stage.texvalleyb2b.in/api_web/get_profile.php";
    return this.http.post<any>(environment.applicationUrl.getProfileUrl, JSON.stringify(params));
  }
  updateKYC(params) {
    // var kycURL = "https://stage.texvalleyb2b.in/api_web/send_kyc_update.php";
    return this.http.post<any>(environment.applicationUrl.kycURL, JSON.stringify(params));
  }
  updateProfile(formData: string) {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    // var updateProfileUrl = "https://stage.texvalleyb2b.in/api_web/send_update_profile.php";
    return this.http.post<any>(environment.applicationUrl.updateProfileUrl, formData)
  }
  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */
  // Get Product Filter
  public filterProducts(filter: any): Observable<Product[]> {
  
    return this.products.pipe(map(product =>
      product.filter((item: Product) => {
        if (!filter.length) return true
        const Tags = filter.some((prev) => { // Match Tags
          if (item.tags) {
            if (item.tags.includes(prev)) {
              return prev
            }
          }
        })
        return Tags
      })
    ));
  }
  public filterProductCollection(filterTag: any, prodCollection: any): any[] {
    return prodCollection.filter((item: Product) => {
      if (!filterTag.length)
        return true;
        // for(var j=0; j < filterTag.length; j++){
        //   var filterParams = filterTag[j].split("-");
        //   if (filterParams.length>0) { 
        //   var searchKeyItem= item["attribute"].filter((args) => { return (args["a_name"] == filterParams[0] && args["a_value"] == filterParams[1]) })
        //   if(searchKeyItem.length>0)
        //     return true;
        //     debugger
        //   }
        // }
         var filterCnt =0;
        for(var i=0; i < filterTag.length; i++){
          var filterParams = filterTag[i].split("-");
          if(filterParams.length>0 && filterParams[0].indexOf("Price ")>-1){
            var minValue = filterParams[0].replace("Price ","");
            var maxValue = filterParams[1];
            if((item["price"] >= minValue) && (item["price"] <= maxValue))
              filterCnt ++;
          }
          else {
            for(var k=0; k < item["attribute"].length; k++){
              if (filterParams.length>0) { 
                if(item["attribute"][k]["a_name"] == filterParams[0] && item["attribute"][k]["a_value"] == filterParams[1]) 
                  filterCnt ++;
              }
            }
          }
        }
        if(filterCnt == filterTag.length )
        return true;
    })
  }
  // Sorting Filter
  public sortProducts(products: Product[], payload: string): any {
    if (payload === 'ascending') {
      return products.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.title > b.title) {
          return -1;
        } else if (a.title < b.title) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        var aPrice = parseFloat(a.price.toString())
        var bPrice = parseFloat(b.price.toString())
        if (aPrice < bPrice) {
          return -1;
        } else if (aPrice > bPrice) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        var aPrice = parseFloat(a.price.toString())
        var bPrice = parseFloat(b.price.toString())
        // console.log("A:"+a.price +"B:" + b.price)
        if (aPrice > bPrice) {
          return -1;
        } else if (aPrice < bPrice) {
          return 1;
        }
        return 0;
      })
    }
  }
  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    // Paginate Range
    let paginateRange = 3;
    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage < paginateRange - 1) {
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
