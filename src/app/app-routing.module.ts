import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductsComponent} from './products/products.component';
import {CartComponent} from './cart/cart.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {RouteGuard} from './route.guard';

const routes: Routes = [
  {path: 'products', component: ProductsComponent},
  {path: 'products/:id', component: ProductDetailComponent},
  {path: 'cart', component: CartComponent, canActivate: [RouteGuard]},
  {path: 'checkout', component: CheckoutComponent, canActivate: [RouteGuard]},
  {path: 'confirmation', component: ConfirmationComponent, canActivate: [RouteGuard]},
  {path: '', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
