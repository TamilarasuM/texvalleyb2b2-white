import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { CartComponent } from './account/cart/cart.component';
import { CheckoutComponent } from './account/checkout/checkout.component';
import { ContactComponent } from './account/contact/contact.component';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { ForgetPasswordComponent } from './account/forget-password/forget-password.component';
import { LoginComponent } from './account/login/login.component';
import { ProfileComponent } from './account/profile/profile.component';
import { RegisterComponent } from './account/register/register.component';
import { WishlistComponent } from './account/wishlist/wishlist.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { BlogLeftSidebarComponent } from './blog/blog-left-sidebar/blog-left-sidebar.component';
import { BlogNoSidebarComponent } from './blog/blog-no-sidebar/blog-no-sidebar.component';
import { BlogRightSidebarComponent } from './blog/blog-right-sidebar/blog-right-sidebar.component';
import { CollectionComponent } from './collection/collection.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { CompareOneComponent } from './compare/compare-one/compare-one.component';
import { CompareTwoComponent } from './compare/compare-two/compare-two.component';
import { ErrorComponent } from './error/error.component';
import { FaqComponent } from './faq/faq.component';
import { LookbookComponent } from './lookbook/lookbook.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { GridFourComponent } from './portfolio/grid-four/grid-four.component';
import { GridThreeComponent } from './portfolio/grid-three/grid-three.component';
import { GridTwoComponent } from './portfolio/grid-two/grid-two.component';
import { MasonryFullWidthComponent } from './portfolio/masonry-full-width/masonry-full-width.component';
import { MasonryGridFourComponent } from './portfolio/masonry-grid-four/masonry-grid-four.component';
import { MasonryGridThreeComponent } from './portfolio/masonry-grid-three/masonry-grid-three.component';
import { MasonryGridTwoComponent } from './portfolio/masonry-grid-two/masonry-grid-two.component';
import { ReviewComponent } from './review/review.component';
import { SearchComponent } from './search/search.component';
import { TypographyComponent } from './typography/typography.component';


const routes: Routes = [
  { 
    path: 'wishlist', 
    component: WishlistComponent 
  },
  { 
    path: 'order-details', 
    component: CheckoutComponent 
  },
  { 
    path: 'myorders', 
    component: WishlistComponent 
  },
  { 
    path: 'cart', 
    component: CartComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'kyc', 
    component: ForgetPasswordComponent 
  },
  { 
    path: 'forget/password', 
    component: ForgetPasswordComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent 
  },
  { 
    path: 'contact', 
    component: ContactComponent 
  },
  { 
    path: 'checkout', 
    component: CheckoutComponent 
  },
  { 
    path: 'aboutus', 
    component: AboutUsComponent 
  },
  { 
    path: 'search', 
    component: SearchComponent 
  },
  { 
    path: 'typography', 
    component: TypographyComponent 
  },
  { 
    path: 'order/success/:id', 
    component: OrderSuccessComponent 
  },
  { 
    path: 'compare/one', 
    component: CompareOneComponent 
  },
  { 
    path: 'compare/two', 
    component: CompareTwoComponent 
  },
  { 
    path: 'shipping', 
    component: CollectionComponent 
  },
  { 
    path: 'returns', 
    component: ReviewComponent 
  },
  { 
    path: 'terms', 
    component: LookbookComponent 
  },
  { 
    path: 'jobs', 
    component: ErrorComponent 
  },
  { 
    path: 'comingsoon', 
    component: ComingSoonComponent 
  },
  { 
    path: 'faq', 
    component: FaqComponent 
  },
  { 
    path: 'privacy-policy', 
    component: BlogRightSidebarComponent 
  },
  { 
    path: 'whyb2b', 
    component: BlogLeftSidebarComponent 
  },
  { 
    path: 'buyer', 
    component: BlogNoSidebarComponent 
  },
  { 
    path: 'seller', 
    component: BlogDetailsComponent 
  },
  { 
    path: 'portfolio/grid/two', 
    component: GridTwoComponent 
  },
  { 
    path: 'portfolio/grid/three', 
    component: GridThreeComponent 
  },
  { 
    path: 'portfolio/grid/four', 
    component: GridFourComponent 
  },
  { 
    path: 'portfolio/masonry/grid/two', 
    component: MasonryGridTwoComponent 
  },
  { 
    path: 'portfolio/masonry/grid/three', 
    component: MasonryGridThreeComponent 
  },
  { 
    path: 'portfolio/masonry/grid/four', 
    component: MasonryGridFourComponent 
  },
  { 
    path: 'portfolio/masonry/full-width', 
    component: MasonryFullWidthComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
