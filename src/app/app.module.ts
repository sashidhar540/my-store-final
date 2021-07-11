import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {StoreModule} from '@ngrx/store';
import {reducer} from './store/reducers/product';
import {AppComponent} from './app.component';
import {ProductsComponent} from './products/products.component';
import {CartComponent} from './cart/cart.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {APP_INITIALIZER,} from '@angular/core';
import {ProductsService} from './shared/products.service';
import {CheckoutComponent} from './checkout/checkout.component';
import {ConfirmationComponent} from './confirmation/confirmation.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    CartComponent,
    ProductDetailComponent,
    CheckoutComponent,
    ConfirmationComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({products: reducer}),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initProducts,
      deps: [ProductsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function initProducts(productsService: ProductsService) {
  return () => {
    // To get products at the time of app initialization
    productsService.getProducts();
  };
}
