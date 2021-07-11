import {Component, OnInit, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, selector} from '../store/reducers/product';
import {Product} from '../products/products.component';
import {ActivatedRoute, Router} from '@angular/router';
import {updateQuantity} from '../store/actions/product';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  activeProduct: Product;
  subscription: Subscription;

  constructor(private store: Store<State>,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    this.subscription = this.store.select(selector.getProducts)
      .subscribe(state => {
        const data: any = state;
        if (data && data.products) {
          const obj = data.products.find((product: Product) => product.id === Number(productId));
          if (obj) {
            this.activeProduct = Object.assign({}, obj);
          } else {
            this.router.navigateByUrl('/products');
          }
        } else {
          this.router.navigateByUrl('/products');
        }
      });
  }

  addToCart() {
    /*
    When user clicks on add to cart incrementing quantity for a product.
    Each click increases counter by 1.
     */
    this.store.dispatch(updateQuantity({id: this.activeProduct.id, isAdd: true}));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
