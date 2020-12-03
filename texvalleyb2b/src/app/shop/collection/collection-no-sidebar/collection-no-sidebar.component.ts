import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService } from 'src/app/shared/services/nav.service';
import { Resolver } from 'src/app/shared/services/resolver.service';
import { Product } from '../../../shared/classes/product';
import { ProductService } from "../../../shared/services/product.service";

@Component({
  selector: 'app-collection-no-sidebar',
  templateUrl: './collection-no-sidebar.component.html',
  styleUrls: ['./collection-no-sidebar.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CollectionNoSidebarComponent implements OnInit {

  public grid: string = 'col-xl-2 col-md-6';
  public segmentInfo: string = "Segments"
  public layoutView: string = 'grid-view';
  public products: Product[] = [];
  public pageNo: number = 1;
  public isSegmentView: boolean = true;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService, private navSrc: NavService, private routSrc: Resolver) {
    // Get Query params..
    // this.route.queryParams.subscribe(params => {

    //   this.sortBy = params.sortBy ? params.sortBy : 'ascending';
    //   this.pageNo = params.page ? params.page : this.pageNo;

    //   // Get Filtered Products..
    //   this.productService.getProducts.subscribe(response => {         
    //     // Sorting Filter
    //     this.products = this.productService.sortProducts(response, this.sortBy);
    //     // Paginate Products
    //     this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
    //     this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
    //   })
    // })
  }

  ngOnInit(): void {
    debugger
    this.routSrc.dataList.subscribe((function (response) {
      this.segmentInfo = this.routSrc.segmenetName;
      this.products = response;
    }).bind(this)
    )
    // this.navSrc.menuCollection.subscribe(
    //   ((function (response) {
    //     var responseList = [];
    //     if (response != null && response.length > 0) {
    //       var id = this.route.snapshot.params["id"];
    //       var dataList = response.filter((function (args) { return (args.segment_id == id) }))
    //       for (var i = 0; i < dataList[0].product_name.length; i++) {

    //         responseList.push(Object.assign({}, this.productService.templateJSON, dataList[0].product_name[i]))
    //         responseList[i].title = dataList[0].product_name[i].products;
    //         responseList[i].id = id;
    //         responseList[i].category = responseList[i].title;
    //         responseList[i]["images"][0].src = responseList[i].image_URL;
    //       }
    //       this.products = responseList;
    //     }
    //   }
    //   ).bind(this)))

  }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
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

}
