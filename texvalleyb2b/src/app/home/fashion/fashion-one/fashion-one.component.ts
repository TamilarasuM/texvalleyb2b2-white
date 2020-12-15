import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavService } from 'src/app/shared/services/nav.service';
import { Product } from '../../../shared/classes/product';
import { ProductSlider } from '../../../shared/data/slider';
import { ProductService } from '../../../shared/services/product.service';


@Component({
  selector: 'app-fashion-one',
  templateUrl: './fashion-one.component.html',
  styleUrls: ['./fashion-one.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class FashionOneComponent implements OnInit {

  public countovalue;
  public counto2value;
  public counto3value;

  public value:number =1;
  public number: number = 1000;
  public products: Product[] = [];
  public newArivals: Product[] = [];
  public topCollections: Product[] = [];
  public salesList: Product[] = [];
  public productCollections: any[] = [];
  
  constructor(public productService: ProductService, private navSrc:NavService) {
    // this.productService.getProducts.subscribe(response => {
    //   this.products = response.filter(item => item.type == 'fashion');
    //   // Get Product Collection
    //   this.products.filter((item) => {
    //     item.collection.filter((collection) => {
    //       const index = this.productCollections.indexOf(collection);
    //       if (index === -1) this.productCollections.push(collection);
    //     })
    //   })
    // });
    this.productService.getNewArivals().subscribe( response=> {
      this.newArivals = this.convertAppProduct(response[0].new_arrival);
      this.topCollections = this.convertAppProduct(response[0].top_collection);
      this.salesList = this.convertAppProduct(response[0].on_sales);
    })
  }

  onCountoEnd(): void {
    console.log('counto end');
}

  public convertAppProduct(newArrival){
    var newArrivalList=[];
    if(newArrival.length>0){
      for(var i=0; i<newArrival.length;i++) {
        newArrivalList.push(Object.assign({},  this.productService.templateJSON, newArrival[i]))
        newArrivalList[i].price =  newArrivalList[i].cost;
        newArrivalList[i].title =  newArrivalList[i].product_name;
        newArrivalList[i]["images"][0].src = newArrivalList[i].image_url;
      }
    }
    return newArrivalList;
  }

  public ProductSliderConfig: any = ProductSlider;

  public sliders = [{
    // title: 'welcome to fashion',
    // subTitle: 'Men fashion',
    title: '',
    subTitle: '',
    image: 'assets/images/slider/3.jpg'
  }, {
    // title: 'welcome to fashion',
    // subTitle: 'Women fashion',
    title: '',
    subTitle: '',
    image: 'assets/images/slider/1.jpg'
  }
  , {
    // title: 'welcome to fashion',
    // subTitle: 'Women fashion',
    title: '',
    subTitle: '',
    image: 'assets/images/slider/2.jpg'
  }
]

  // Collection banner
  public collections = [{
    image: 'assets/images/collection/fashion/1.jpg',
    save: ' ',
    title: 'men',
    id :1
    
  }, {
    image: 'assets/images/collection/fashion/2.jpg',
    save: ' ',
    title: 'women',
    id :2
  }
  , {
    image: 'assets/images/collection/fashion/3.jpg',
    save: ' ',
    title: 'home textile',
    id :3
  }
];

  // Blog
  public blog = [{
    image: 'assets/images/blog/1.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/2.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/3.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/4.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }];

  // Logo
  public logo = [{
    image: 'assets/images/logos/1.png',
  }, {
    image: 'assets/images/logos/2.png',
  }, {
    image: 'assets/images/logos/3.png',
  }, {
    image: 'assets/images/logos/4.png',
  }, {
    image: 'assets/images/logos/5.png',
  }, {
    image: 'assets/images/logos/6.png',
  }, {
    image: 'assets/images/logos/7.png',
  }, {
    image: 'assets/images/logos/8.png',
  }];

  ngOnInit(): void {
    this.navSrc.getSegments();
  }

  // Product Tab collection
  getCollectionProducts(collection) {
    return this.products.filter((item) => {
      if (item.collection.find(i => i === collection)) {
        return item
      }
    })
  }
  
}
