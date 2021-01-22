import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { Resolver } from './shared/services/resolver.service';
import { CollectionLeftSidebarComponent } from './shop/collection/collection-left-sidebar/collection-left-sidebar.component';
import { CollectionNoSidebarComponent } from './shop/collection/collection-no-sidebar/collection-no-sidebar.component';
import { ShopComponent } from './shop/shop.component';


const routes: Routes = [
 
  {
    path: '',
    // redirectTo: 'home/fashion',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: '',
    component: ShopComponent,
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  },
  {
    path: 'segments/:id',
    component: CollectionNoSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'products/:id/:name',
    component: CollectionLeftSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  {
    path: 'products/:search',
    component: CollectionLeftSidebarComponent,
    resolve: {
      data: Resolver
    }
  },
  { 
    path: '',
    component: PagesComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) 
  },
  {
    path: '**', // Navigate to Home Page if not found any page
    redirectTo: 'home/fashion',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    useHash: false,
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
