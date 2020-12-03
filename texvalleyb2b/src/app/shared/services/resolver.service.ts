import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../classes/product';
import { NavService } from './nav.service';
import { ProductService } from './product.service';

@Injectable({
	providedIn: 'root'
})
export class Resolver implements Resolve<Product> {
  
  public product: Product = {};
  public dataList = new BehaviorSubject([]);
  public currentProduct = new BehaviorSubject("");
  public segmenetName = "Segmenets"
  constructor(
    private router: Router,
    public productService: ProductService,public navSrc:NavService
  ) {}

  // Resolver
  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    debugger
    await new Promise(resolve => setTimeout(resolve, 1000));    
    var segmentID= route.params["id"];
    var productname = route.params["name"];
    var search = route.params["search"];
    if(search) {
      this.productService.getProductSearchList(search).toPromise().then(
        ( (function (response) {
          var responseList=[];
          if(response !=null && response.length>0){
            for(var i=0; i<response.length;i++) {
                responseList.push(Object.assign({},  this.productService.templateJSON, response[i]))
                responseList[i].price =  responseList[i].cost;
                responseList[i].title =  responseList[i].product_name;
                responseList[i]["images"][0].src = responseList[i].image_url;
            }
            this.product = responseList;
            this.dataList.next(responseList);
          }
        }).bind(this)))
    }
    else if(segmentID && productname) {
      this.currentProduct.next(productname);
      this.productService.getProductList(segmentID,productname).toPromise().then(
      ( (function (response) {
        var responseList=[];
        if(response !=null && response.length>0){
          for(var i=0; i<response.length;i++) {
              responseList.push(Object.assign({},  this.productService.templateJSON, response[i]))
              responseList[i].price =  responseList[i].cost;
              responseList[i].title =  responseList[i].product_name;
              responseList[i]["images"][0].src = responseList[i].image_url;
          }
          this.product = responseList;
          this.dataList.next(responseList);
        }
      }).bind(this)))
    }
    else if(segmentID){
      this.navSrc.menuCollection.subscribe(
        ((function (response) {
          var responseList = [];
          if (response != null && response.length > 0) {
            var id = route.params["id"];
            var dataList = response.filter((function (args) { return (args.segment_id == id) }));
            this.segmenetName = dataList[0].segment;
            for (var i = 0; i < dataList[0].product_name.length; i++) {
  
              responseList.push(Object.assign({}, this.productService.templateJSON, dataList[0].product_name[i]))
              responseList[i].title = dataList[0].product_name[i].products;
              responseList[i].id = id;
              responseList[i].product_id = id;
              responseList[i].category = responseList[i].title;
              responseList[i].image_url = responseList[i].image;
              responseList[i]["images"][0].src= responseList[i].image;
            }
            this.dataList.next(responseList)
            // this.products = responseList;
          }
        }
        ).bind(this)))
    }
    // this.productService.getProductBySlug(route.params.slug).subscribe(product => {
    //   
    //   // if(!product) { // When product is empty redirect 404
    //   //     this.router.navigateByUrl('/pages/404', {skipLocationChange: true});
    //   // } else {
    //   //     this.product = product
    //   // }
    // })
   // return this.product;
  }

}
