import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  public Products;
  public cartDetails = new BehaviorSubject([]);
  public templateProduct = {"id":1,"title":"Kids T-Shirt- Sivam","description":" desc","type":"fashion","brand":"nike","collection":["new products"],"category":"Women","price":"550.00","sale":true,"stock":5000,"new":true,"tags":[],"variants":[{"variant_id":101,"id":1,"sku":"sku1","size":"S","color":"#ff0000","image_id":111}],"images":[{"image_id":111,"id":1,"alt":"yellow","src":"//stage.texvalleyb2b.in/undefined","variant_id":[101,104]}],"quantity":3}
  public templateJSON = {
    "id": 1, "title": "trim dress", "description": " desc", "type": "fashion", "brand": "nike", "collection": ["new products"], "category": "Women", "price": 145, "sale": true,
    // "discount":"40",
    "stock": 5000, "new"
      : true, "tags": [],
    "variants": [
      { "variant_id": 101, "id": 1, "sku": "sku1", "size": "s", "color": "yellow", "image_id": 111 }
      // ,{"variant_id":105,"id":1,"sku":"sku5","size":"m","color":"white","image_id":112},
      // {"variant_id":106,"id":1,"sku":"sku5","size":"m","color":"pink","image_id":113},
      // {"variant_id":107,"id":1,"sku":"sku1","size":"l","color":"yellow","image_id":111}
    ],
    "images": [
      { "image_id": 111, "id": 1, "alt": "yellow", "src": "assets/images/product/fashion/39.jpg", "variant_id": [101, 104] }
      // ,{"image_id":112,"id":1,"alt":"white","src":"assets/images/product/fashion/6.jpg","variant_id":[102,105]}
      // ,{"image_id":113,"id":1,"alt":"pink","src":"assets/images/product/fashion/25.jpg","variant_id":[103,106]
    ]
  }
  constructor(private http: HttpClient,
    private toastrService: ToastrService) { 
      this.isLogin =	localStorage.getItem("LoginDetails") == null? false:true;
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

  public getProductSearchList(search:string) {
    var params = {keyword: search}//{ "segment_id": S_ID, "sub_segment_id": "", "category_id": "", "sub_category_id": "", "product_name": pname}
    var headers = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>("https://stage.texvalleyb2b.in/api_web/get_search_products.php", JSON.stringify(headers))
  }
  public getProductList(S_ID: string, pname: string) {
    var params = { "segment_id": S_ID, "sub_segment_id": "", "category_id": "", "sub_category_id": "", "product_name": pname}
    var headers = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>("https://stage.texvalleyb2b.in/api_web/get_product.php", JSON.stringify(headers))
  }
  

  public getNewArivals(){
    var params = { "segment_id": "", "sub_segment_id": "", "category_id": "", "sub_category_id": "", "product_name": ""}
    var headers = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>("https://stage.texvalleyb2b.in/api_web/get_new_arrival.php", JSON.stringify(headers))
  }

  public getState() {
    return this.http.get<any>("https://stage.texvalleyb2b.in/api_web/get_state.php").pipe(map(data => { return data }))
  }

  public addCartDetails(product) {
    // var productDetails = {price: product["price"],quantity: product.quantity, productID: this.productID , a_id: this.a_id}
    var params = {
      // "login_id": 1,
      // "c_id": 1,
      "a_id": product.a_id,
      "product_id": product.productID,//addInfo["product_id"],
      "quantity": product.quantity,
      "price": product["price"],
      // "token": "d41d8cd98f00b204e9800998ecf8427e"
    }
    var paramsdata = Object.assign(params, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>("https://stage.texvalleyb2b.in/api_web/add_cart.php", JSON.stringify(paramsdata)).pipe(map(data => {
      return data
    })).subscribe((res) => {
      if (res.length > 0 && res[0]["status"].indexOf("Success") > -1)
        // alert(res[0]["status"]);
        this.toastrService.success('Successfully added your item to cart..');
    })
  }

  public getProductDetails(pId: string) {

    var params = Object.assign({
      "product_id": pId,
    }, JSON.parse(localStorage.getItem("LoginDetails")))
    return this.http.post<any>("https://stage.texvalleyb2b.in/api_web/get_product_details.php", JSON.stringify(params)).pipe(map(data => {
      for (var i = 0; i < data.length; i++)
        data[i]["size"] = data[i]["attributes"][0]["a_value"];
      return data
    }))
  }

  public getOrderDetails() {

    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    var url = "https://stage.texvalleyb2b.in/api_web/get_order.php";
    return this.http.post<any>(url, JSON.stringify(params));
  }

  public getOrderCollectionDetail(orderId) {

    var params = JSON.parse(localStorage.getItem("LoginDetails"));
    params.order_id = orderId;
    var url = "https://stage.texvalleyb2b.in/api_web/get_order_items.php";
    return this.http.post<any>(url, JSON.stringify(params));

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
    
    var deleteCartURL= "https://stage.texvalleyb2b.in/api_web/delete_cart.php";

    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    params.cart_id = product["cart_id"];
    return this.http.post<any>(deleteCartURL, JSON.stringify(params))
    
    // const index = state.cart.indexOf(product);
    // state.cart.splice(index, 1);
    // // localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true
  }

  // Total amount 
  public convertToProduct(response: any){
    var productList=[];
    var priceSum=0;
    for(var i=0; i< response.length;i++){
      this.templateProduct.title = response[i].product_name;
      response[i]["size"] = response[i].Size_Range;
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

  public confirmOrders() {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    var url = "https://stage.texvalleyb2b.in/api_web/confirm_order.php";
    return this.http.post<any>(url, JSON.stringify(params))
  }

  public applyCouponCode(code) {
    
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    params.coupon_code = code;
    var url = "https://stage.texvalleyb2b.in/api_web/update_coupon.php";
    return this.http.post<any>(url, JSON.stringify(params))
  }
  

  getProfile() {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    var url = " https://stage.texvalleyb2b.in/api_web/get_profile.php";
    return this.http.post<any>(url, JSON.stringify(params));
    
  }
  updateKYC(params) {
    var kycURL ="https://stage.texvalleyb2b.in/api_web/send_kyc_update.php";
    return this.http.post<any>(kycURL, JSON.stringify(params));
  }

  updateProfile(formData:string) {
    var params = JSON.parse(localStorage.getItem("LoginDetails"))
    var url = "https://stage.texvalleyb2b.in/api_web/send_update_profile.php";
    return this.http.post<any>(url, formData)
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
  public filterProductCollection(filter: any, prodCollection:any): Observable<any[]> {
    return prodCollection.filter((item: Product) => {
        if (!filter.length)
         return true
        const Tags = filter.some((prev) => { // Match Tags
          if (item.tags) {
            // if (item.tags.includes(prev)) 
            if(filter.indexOf(item.brand)>-1)
            {
              return item.brand;
            }
          }
        })
        
        return Tags
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
        if (aPrice> bPrice) {
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
