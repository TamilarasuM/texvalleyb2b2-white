import { ViewportScroller } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/classes/product';
import { ProductService } from "../../../shared/services/product.service";
import { Resolver } from "../../../shared/services/resolver.service";

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionLeftSidebarComponent implements OnInit {

  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  // public colorKey: string = 'colors';
  // public WeightKey: string = 'Weight';
  // public categoryKey: string = 'category';
  public filterCollection: any[] = [];
  public products: Product[] = [];
  public Products;
  public currentProducts: Product[] = [];
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public category: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader = false;
  public isFilter = false;
  public loadMore = true;
  public segmentID: string;
  public productname: string;
  public mySubscription;

  public refreshPage = true;

  // public offsetCount = 0;
  // public tempData = new BehaviorSubject([]);

  constructor(private route: ActivatedRoute, private router: Router, private appRef: ApplicationRef, private zone: NgZone, public cdf: ChangeDetectorRef,
    private viewScroller: ViewportScroller, public resolverSVC: Resolver, public productService: ProductService) {

    // Get Query params..
    this.route.queryParams.subscribe(params => {
      this.brands = params.brand ? params.brand.split(",") : [];
      this.colors = params.color ? params.color.split(",") : [];
      this.size = params.size ? params.size.split(",") : [];
      this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
      this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [...this.brands, ...this.colors, ...this.size]; // All Tags Array

      this.category = params.category ? params.category : null;
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';
      this.pageNo = params.page ? params.page : this.pageNo;

      this.segmentID = this.route.snapshot.params["id"];
      this.productname = this.route.snapshot.params["name"];


      if (this.products.length > 0)
        this.products = this.productService.sortProducts(this.currentProducts, this.sortBy);
      this.products = this.productService.filterProductCollection(this.tags, this.currentProducts);

      // this.productService.getProductList(this.resolverSVC.selectedSegmentID,this.resolverSVC.selectedProductName , 0).subscribe(
      //   ((function (response) {
      //     var responseList = [];
      //     if (response != null && response.length > 0) {
      //       for (var i = 0; i < response.length; i++) {
      //         responseList.push(Object.assign({}, this.productService.templateJSON, response[i]))
      //         responseList[i].price = responseList[i].cost;
      //         responseList[i].title = responseList[i].product_name;
      //         responseList[i]["images"][0].src = responseList[i].image_url;
      //       }
      //       this.products = responseList;
      //       //this.dataList.next(responseList);
      //       // this.dataList.complete();
      //     }
      //   }).bind(this)))

      // if(this.resolverSVC.dataList.observers.length<1)
      // this.resolverSVC.dataList.subscribe((function (res) {
      //   debugger
      //   // if (res[0].attribute)
      //   //   this.filterCollection = res[0].attribute.map((args) => args.a_name);// Object.keys(this.products[0]).splice( 5, 5);

      //     // this.updateCheckBox()
      //     // if(this.offsetCount  != res[0].offset)
      //     // // {
      //     //   this.offsetCount = res[0].offset;
      //     // if (res[0].offset_temp == 0) {
      //     //   this.currentProducts =  this.products = res;
      //     //   // this.loadMore = true;
      //     // }
      //     // if(!this.isFilter || this.products.length ==0)
      //     // if(this.products.length ==0 )
      //     //    this.products = this.products.concat(this.productService.sortProducts(res, this.sortBy)); //.slice(0,30);
      //     // if(this.currentProducts.length ==0)
      //     //   this.currentProducts = this.products 
      //     // if(this.isFilter){
      //     //       // this.products =  res[0].offset == 30 ? res : this.currentProducts;
      //     //     this.isFilter = false;
      //    // }
      //    if(this.currentProducts.length ==0 || this.resolverSVC.offsetCount == 0) {
      //      this.currentProducts = res;
      //      this.resolverSVC.offsetCount =30;
      //      this.resolverSVC.loadMore = true;
      //     }
      //     debugger
      //     // this.products =  res;
      //         this.products = res;//this.filterProductCollection(this.tags, res);
      //         // this.ProductBoxOneComponent.product = this.products;
      //       //  if( this.currentProducts[0].filter)
      //       //       this.filterCollection = this.currentProducts[0].filter;
      //       if (res[0].attribute)
      //         this.filterCollection = res[0].attribute.map((args) => args.a_name);
      //     // }
      //         this.loader = true;
      // }).bind(this))

      // this.tempData.subscribe( (res)=>{
      //   this.products =  this.productService.sortProducts(res, this.sortBy);
      // })
      // // Get Filtered Products..
      //  this.productService.filterProductCollection(this.tags, this.products);
      //  .subscribe(response => {  
      //          
      //   // Sorting Filter
      //   this.products = this.productService.sortProducts(response, this.sortBy);
      //   // Category Filter
      //   if(params.category)
      //     this.products = this.products.filter(item => item.type == this.category);
      //   // Price Filter
      //   this.products = this.products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice) 
      //   // // Paginate Products
      //   this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
      //   this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
      // })
      //  this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
      //   this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
    })
  }

  ngOnInit(): void {

    // this.productname = this.resolverSVC.selectedProductName;
    // this.resolverSVC.currentProduct.subscribe((function (res) {
    //   this.productname = res;
    // }).bind(this));
    this.mySubscription = this.resolverSVC.dataList.subscribe((function (res) {
      debugger
      this.productname = this.resolverSVC.selectedProductName;
      // this.products = res;
      //  this.loader =true;
      // this.zone.run(() => {
      setTimeout((function () {
        if (this.currentProducts.length == 0 || this.resolverSVC.offsetCount == 0) {
          this.currentProducts = res;
          this.resolverSVC.offsetCount = 30;
        }
        var filterDatas = this.productService.filterProductCollection(this.tags, this.currentProducts);
        this.products = filterDatas;//Object.assign([],filterDatas);
        if (res[0].attribute)
          this.filterCollection = res[0].attribute.map((args) => args.a_name);
        this.loader = true;
        // this.cdf.detectChanges();
        // this.appRef.tick();
      }).bind(this), 100)




      // }
      //   )
    }).bind(this))
    // if(this.resolverSVC.dataList.observers.length<1)
    // this.resolverSVC.dataList.subscribe((function (res) {
    //   // this.zone.run(() => {
    //   debugger
    //     if (this.currentProducts.length == 0 || this.resolverSVC.offsetCount == 0) {
    //       this.currentProducts = res;
    //       this.resolverSVC.offsetCount = 30;
    //       this.loadMore = true;
    //     }
    //     this.products = this.productService.filterProductCollection(this.tags, this.currentProducts);
    //     if (res[0].attribute)
    //       this.filterCollection = res[0].attribute.map((args) => args.a_name);
    //       this.loader =true;
    //       // this.cdf.markForCheck();
    //   // })
    // }).bind(this))
  }
  refreshData() {
    // this.products = [{"id":1,"title":"Modified..","description":" desc","type":"fashion","brand":"RR","collection":["new products"],"category":"Women","price":104,"sale":true,"stock":5000,"new":true,"tags":[],"variants":[{"variant_id":101,"id":1,"sku":"sku1","size":"s","color":"yellow","image_id":111}],"images":[{"image_id":111,"id":1,"alt":"yellow","src":"https://b2bproimages.s3.ap-south-1.amazonaws.com/116152955-1.jpg","variant_id":[101,104]}],"product_id":"2955","product_name":"3/4 th With Cuff..","image_url":"https://b2bproimages.s3.ap-south-1.amazonaws.com/116152955-1.jpg","moq":"10","Minimum_Pack_Qty":"1","Dimensions":"None","Weight":"0","Quality":"No color Fastness","Size_Range":"XXL","MRP_Affized":"NO","MRP":"N/A","Special_Instruction":"Normal wash","product_info":"","min_order":"1","bulk_order":"500","bulk_order_p":1019.2,"credit_Days":"45","in_stock":"In Stock","delivery":"Same Day Shipping","size_standard":"Indian","UOM":"Pack of Ten","vendor_type":null,"mark_up_p":"20","tv_code":"TV2955","cost":104,"attribute":[{"a_name":"Brand","a_value":"RR"},{"a_name":"Wash Care","a_value":"Normal Wash"},{"a_name":"Fly Type","a_value":"Regular"},{"a_name":"Pocket Type","a_value":"Side Pocket"},{"a_name":"No of  Pocket","a_value":"2"},{"a_name":"Pattern","a_value":"Solid"},{"a_name":"Material Type","a_value":"Jersey"},{"a_name":"Count","a_value":"40s  120 GSM"},{"a_name":"Construction","a_value":"Single Jersey"},{"a_name":"Size","a_value":"XXL"},{"a_name":"Fabric","a_value":"Knitted"},{"a_name":"Additional Work","a_value":"None"},{"a_name":"Product","a_value":"3/4  Tracks"}],"offset":30,"offset_temp":0,"filter":[{"attribute":"Additional Work","value":[{"value":"None"}]},{"attribute":"Brand","value":[{"value":"RR"}]},{"attribute":"Construction","value":[{"value":"Single Jersey"}]},{"attribute":"Count","value":[{"value":"40s  120 GSM "}]},{"attribute":"Fabric","value":[{"value":"Knitted"}]},{"attribute":"Fly Type","value":[{"value":"Regular"}]},{"attribute":"Material Type","value":[{"value":"Jersey"}]},{"attribute":"No of  Pocket","value":[{"value":"2"}]},{"attribute":"Pattern","value":[{"value":"Solid"}]},{"attribute":"Pocket Type","value":[{"value":"Side Pocket"}]},{"attribute":"Size","value":[{"value":"XXL"}]},{"attribute":"Wash Care","value":[{"value":"Normal Wash"}]}],"total_product":0}]
  }
  ngOnDestroy() {
    if (this.mySubscription)
      this.mySubscription.unsubscribe()
  }

  public filterProductCollection(filterTag: any, prodCollection: Product[]): Observable<Product[]> {
    var filterData = prodCollection.filter((item: Product) => {
      if (!filterTag.length)
        return true;
      var filterCnt = 0;
      for (var i = 0; i < filterTag.length; i++) {
        for (var k = 0; k < item["attribute"].length; k++) {
          var filterParams = filterTag[i].split("-");
          if (filterParams.length > 0) {
            if (item["attribute"][k]["a_name"] == filterParams[0] && item["attribute"][k]["a_value"] == filterParams[1])
              filterCnt++;
          }
        }
      }
      if (filterCnt == filterTag.length)
        return true;
    })
    this.Products = filterData;
    // this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
    // this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
    return this.Products; // = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
  }

  // Append filter value to Url
  updateFilter(tags: any) {
    debugger
    this.isFilter = true;
    var filterItems = tags.color ? tags.color.split(",") : [];
    tags.page = null; // Reset Pagination
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      //   skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      //  skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  //update
  updateCheckBox() {
    if (this.resolverSVC.offsetCount == 0) {
      var filterItems = this.tags;
      for (var i = 0; i < filterItems.length; i++) {
        if (document.querySelectorAll('.collection-filter [value="' + filterItems[i] + '"]').length > 0)
          document.querySelectorAll('.collection-filter [value="' + filterItems[i] + '"]')[0]["checked"] = true;
      }
    }
  }
  // Remove Tag
  removeTag(tag) {
    if (document.querySelectorAll('.collection-filter [value="' + tag + '"]').length > 0)
      document.querySelectorAll('.collection-filter [value="' + tag + '"]')[0]["checked"] = false;
    this.brands = this.brands.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);
    this.size = this.size.filter(val => val !== tag);
    let params = {
      brand: this.brands.length ? this.brands.join(",") : null,
      color: this.colors.length ? this.colors.join(",") : null,
      size: this.size.length ? this.size.join(",") : null
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      //skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  removeAllTags() {
    var allInputs = document.querySelectorAll('.collection-filter [type="checkbox"]');
    for (var i = 0, max = allInputs.length; i < max; i++) {
      allInputs[i]["checked"] = false;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      // skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      // skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  onScroll() {
    debugger
    if (this.resolverSVC.loadMore == true)
      this.productService.getProductList(this.segmentID, this.productname, this.resolverSVC.offsetCount).toPromise().then(
        ((function (response) {
          var responseList = [];
          if (response == null)
            this.resolverSVC.loadMore = false;
          if (response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
              responseList.push(Object.assign({}, this.productService.templateJSON, response[i]))
              responseList[i].price = responseList[i].cost;
              responseList[i].title = responseList[i].product_name;
              responseList[i]["images"][0].src = responseList[i].image_url;
            }
            // this.products = this.products.concat(this.productService.sortProducts(responseList, this.sortBy)); //.slice(0,30);
            // this.products = this.productService.filterProductCollection(this.tags, this.products);
            // this.offsetCount = response[0].offset;

            // if (responseList[0].offset_temp == 0) {
            //   this.products = [];
            //   this.loadMore = true;
            // }
            // this.products = this.productService.filterProductCollection(this.tags, this.currentProducts);

            if (this.resolverSVC.offsetCount != response[0].offset && this.resolverSVC.offsetCount < response[0].offset) {
              this.currentProducts = this.currentProducts.concat(this.productService.sortProducts(responseList, this.sortBy));
              this.resolverSVC.offsetCount = response[0].offset;
              this.resolverSVC.dataList.next(this.currentProducts);
            }
          }
        }).bind(this)))
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if (value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }
}
