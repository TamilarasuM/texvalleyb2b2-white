import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
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
  public filterCollection: any[] = ["Weight", "category", "size"];
  public products: Product[] = [];
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
  public segmentID: string;
  public productname: string;
  public tempData = new BehaviorSubject([]);

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
        this.products = this.productService.sortProducts(res, this.sortBy);
        // this.filterCollection =  this.attribute
        this.filterCollection = Object.keys(this.products[0]).splice( 5, 5);
        this.products = this.productService.filterProductCollection(this.tags, this.products);

        this.loader =true;
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

  // Append filter value to Url
  updateFilter(tags: any) {
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

  // Remove Tag
  removeTag(tag) {

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
