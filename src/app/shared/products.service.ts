import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {initialize} from '../store/actions/product';
import {Product} from '../products/products.component';
import {Store} from '@ngrx/store';
import {State} from '../store/reducers/product';

@Injectable(
  {providedIn: 'root'}
)
export class ProductsService {

  constructor(private httpClient: HttpClient,
              private store: Store<State>) { }

  getProducts() {
    if (!sessionStorage.getItem('storeProducts')) {
      const url = '/assets/mocks/db.json';
      this.httpClient.get(url).subscribe(response => {
        const result: any = response;
        if (result.products) {
          const allProducts = result.products.map((product: Product) => {
            product.image = 'assets/images/' + product.image;
            product.quantity = 0;
            return product;
          });
          sessionStorage.setItem('storeProducts', JSON.stringify(allProducts));
          this.store.dispatch(initialize({products: allProducts}));
        }
      }, error => {
        console.log('failed to get products');
      });
    } else {
      const allProducts = JSON.parse(<string>sessionStorage.getItem('storeProducts'));
      if (!sessionStorage.getItem('cartItems')) {
        this.store.dispatch(initialize({products: allProducts}));
      } else {
        const cartItems = JSON.parse(<string>sessionStorage.getItem('cartItems'));
        this.store.dispatch(initialize({products: cartItems}));
      }
    }
  }

}
