import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resolver } from '../shared/services/resolver.service';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './checkout/success/success.component';
import { CollectionRightSidebarComponent } from './collection/collection-right-sidebar/collection-right-sidebar.component';
import { CompareComponent } from './compare/compare.component';
import { BundleProductComponent } from './product/bundle-product/bundle-product.component';
import { FourImageComponent } from './product/four-image/four-image.component';
import { ImageOutsideComponent } from './product/image-outside/image-outside.component';
import { ProductLeftSidebarComponent } from './product/sidebar/product-left-sidebar/product-left-sidebar.component';
import { ProductNoSidebarComponent } from './product/sidebar/product-no-sidebar/product-no-sidebar.component';
import { ProductRightSidebarComponent } from './product/sidebar/product-right-sidebar/product-right-sidebar.component';
import { ThreeColumnComponent } from './product/three-column/three-column.component';
import { WishlistComponent } from './wishlist/wishlist.component';





const routes: Routes = [
  {
    path: 'collection/left/sidebar/:id/:name',
    redirectTo: 'products/:id/:name',
  },
  {
    path: 'product/left/sidebar/:slug',
    redirectTo: 'productdetails/:slug',
  },

  // {
  //   path: 'products/:id/:name',
  //   component: CollectionLeftSidebarComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  // {
  //   path: 'products/:search',
  //   component: CollectionLeftSidebarComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },

  {
    path: 'productdetails/:slug',
    component: ProductLeftSidebarComponent,
    resolve: {
      data: Resolver
    }
  },

  // {

  //   path: 'collection/left/sidebar/:id/:name',
  //   // path: 'collection/left/sidebar',
  //   component: CollectionLeftSidebarComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  // {
  //   path: 'product/left/sidebar/:slug',
  //   component: ProductLeftSidebarComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  {
    path: 'product/right/sidebar/:slug',
    component: ProductRightSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/no/sidebar/:slug',
    component: ProductNoSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/three/column/:slug',
    component: ThreeColumnComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/four/image/:slug',
    component: FourImageComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/bundle/:slug',
    component: BundleProductComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'product/image/outside/:slug',
    component: ImageOutsideComponent,
    resolve: {
      data: Resolver
    }
  },
  // {
  //   path: 'collection/left/sidebar/:id/:name',
  //   // path: 'collection/left/sidebar',
  //   component: CollectionLeftSidebarComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  {
    path: 'collection/right/sidebar',
    component: CollectionRightSidebarComponent
  },
  // {
  //   path: 'segments/:id',
  //   component: CollectionNoSidebarComponent,
  //   resolve: {
  //     data: Resolver
  //   }
  // },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'compare',
    component: CompareComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'checkout/success/:id',
    component: SuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
