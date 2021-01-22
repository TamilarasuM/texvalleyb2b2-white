import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxPayPalModule } from 'ngx-paypal';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';
// Collection Components
import { CollectionLeftSidebarComponent } from './collection/collection-left-sidebar/collection-left-sidebar.component';
import { CollectionNoSidebarComponent } from './collection/collection-no-sidebar/collection-no-sidebar.component';
import { CollectionRightSidebarComponent } from './collection/collection-right-sidebar/collection-right-sidebar.component';
import { BrandsComponent } from './collection/widgets/brands/brands.component';
import { ColorsComponent } from './collection/widgets/colors/colors.component';
// Collection Widgets
import { GridComponent } from './collection/widgets/grid/grid.component';
import { PaginationComponent } from './collection/widgets/pagination/pagination.component';
import { PriceComponent } from './collection/widgets/price/price.component';
import { SizeComponent } from './collection/widgets/size/size.component';
import { CompareComponent } from './compare/compare.component';
import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
import { FourImageComponent } from './product/four-image/four-image.component';
import { ImageOutsideComponent } from './product/image-outside/image-outside.component';
// Product Details Components
import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { ProductNoSidebarComponent } from './product/sidebar/product-no-sidebar/product-no-sidebar.component';
import { ProductRightSidebarComponent } from './product/sidebar/product-right-sidebar/product-right-sidebar.component';
import { ThreeColumnComponent } from './product/three-column/three-column.component';
import { CountdownComponent } from './product/widgets/countdown/countdown.component';
import { RelatedProductComponent } from './product/widgets/related-product/related-product.component';
// Product Details Widgest Components
import { ServicesComponent } from './product/widgets/services/services.component';
import { SocialComponent } from './product/widgets/social/social.component';
import { StockInventoryComponent } from './product/widgets/stock-inventory/stock-inventory.component';
import { ShopRoutingModule } from './shop-routing.module';
import { WishlistComponent } from './wishlist/wishlist.component';






@NgModule({
  declarations: [
    ProductLeftSidebarComponent, 
    ProductRightSidebarComponent,
    ProductNoSidebarComponent,
    ThreeColumnComponent,
    FourImageComponent,
    BundleProductComponent,
    ImageOutsideComponent,
    ServicesComponent,
    CountdownComponent,
    SocialComponent,
    StockInventoryComponent,
    RelatedProductComponent,
    CollectionLeftSidebarComponent,
    CollectionRightSidebarComponent,
    CollectionNoSidebarComponent,
    GridComponent,
    PaginationComponent,
    BrandsComponent,
    ColorsComponent,
    SizeComponent,
    PriceComponent,
    CartComponent,
    WishlistComponent,
    CompareComponent,
    CheckoutComponent,
    SuccessComponent
  ],
  imports: [
    CommonModule,
    NgxPayPalModule,
    Ng5SliderModule,
    SharedModule,
    ShopRoutingModule
  ]
  // entryComponents:[]
})
export class ShopModule { }
