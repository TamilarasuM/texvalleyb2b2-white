import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public colorKey: string = 'colors';
  public WeightKey: string = 'Weight';
  public categoryKey: string = 'category';
  public filterCollection: any[] = [];
  public products: Product[] = [];
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
  public isFilter =false;
  public loadMore = true;
  public segmentID: string;
  public productname: string;
  // public offsetCount = 0;
  // public tempData = new BehaviorSubject([]);

  constructor(private route: ActivatedRoute, private router: Router,
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
        this.products = this.productService.sortProducts(this.products, this.sortBy);
      this.resolverSVC.dataList.subscribe((function (res) {
        debugger
        // if (res[0].attribute)
        //   this.filterCollection = res[0].attribute.map((args) => args.a_name);// Object.keys(this.products[0]).splice( 5, 5);

        
          // this.updateCheckBox()
          // if(this.offsetCount  != res[0].offset)
          // // {
          //   this.offsetCount = res[0].offset;
          // if (res[0].offset_temp == 0) {
          //   this.currentProducts =  this.products = res;
          //   // this.loadMore = true;
          // }
          // if(!this.isFilter || this.products.length ==0)
          // if(this.products.length ==0 )
          //    this.products = this.products.concat(this.productService.sortProducts(res, this.sortBy)); //.slice(0,30);
          // if(this.currentProducts.length ==0)
          //   this.currentProducts = this.products 
          // if(this.isFilter){
          //       // this.products =  res[0].offset == 30 ? res : this.currentProducts;
          //     this.isFilter = false;
         // }

         if(this.currentProducts.length ==0 || this.resolverSVC.offsetCount == 0) {
            this.currentProducts = res;
            this.loadMore = true;
         }
          console.log("total_product:" + this.currentProducts[0].total_product)
         this.products = this.productService.filterProductCollection(this.tags, this.currentProducts);
         if( this.currentProducts[0].filter)
              this.filterCollection = this.currentProducts[0].filter;
      // }
          this.loader = true;
      }).bind(this))

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
    this.resolverSVC.currentProduct.subscribe((function (res) {
      this.productname = res;
    }).bind(this))
  }

  // ngAfterContentChecked() { 
  //   if(this.resolverSVC.updateCheckBox){
  //     this.updateCheckBox();
  //     this.resolverSVC.updateCheckBox = false;
  //   }
  //   //alert('parent - ngAfterViewInit')
  //  }

  // Append filter value to Url
  updateFilter(tags: any) {
    debugger
    this.isFilter = true;
    var filterItems = tags.color ? tags.color.split(",") : [];
    
   // this.products = this.productService.filterProductCollection([...filterItems], [...this.currentProducts]);
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
    debugger
    if(this.resolverSVC.offsetCount ==0) {
      var filterItems = this.tags;
      for(var i=0; i < filterItems.length; i++){
      if (document.querySelectorAll('.collection-filter [value="' + filterItems[i] + '"]').length > 0)
        document.querySelectorAll('.collection-filter [value="' + filterItems[i] + '"]')[0]["checked"] = true;
      }
    }
  }
  // Remove Tag
  removeTag(tag) {
    debugger
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
    if (this.loadMore == true)
      this.productService.getProductList(this.segmentID, this.productname, this.resolverSVC.offsetCount).toPromise().then(
        ((function (response) {
          var responseList = [];
          if (response == null)
            this.loadMore = false;
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
            
            if(this.resolverSVC.offsetCount  != response[0].offset && this.resolverSVC.offsetCount  < response[0].offset) {
              this.currentProducts  =  this.currentProducts.concat(this.productService.sortProducts(responseList, this.sortBy));
              this.resolverSVC.offsetCount = response[0].offset;
              console.log("Offset Count:" + this.resolverSVC.offsetCount)
              console.log("Total Products on scroll:" + this.currentProducts.length)
              this.resolverSVC.dataList.next(this.currentProducts );
              }
          //  this.resolverSVC.dataList.complete()
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
