import {Component, OnInit, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, selector} from '../store/reducers/product';
import {Product} from '../products/products.component';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  showModal = false;
  cartItems: Array<Product> = [];
  subTotal: number = 0;
  total: number = 0;
  discount: number = 0;
  showDiscount = false;
  subscription: Subscription;

  constructor(private store: Store<State>,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.store.select(selector.getProducts)
      .subscribe(state => {
        const data: any = state;
        if (data && data.products) {
          let subTotal = 0;
          const items: Array<Product> = [];
          let quantity = 0;
          data.products.forEach((product: Product) => {
            if (product.quantity) {
              items.push(product);
              quantity = quantity + product.quantity;
              subTotal = subTotal + product.quantity * product.price;
            }
          });
          this.cartItems = [...items];
          this.subTotal = subTotal;
          // Applying discount if price of all items in cart is above 50 dollars
          if (this.subTotal > 50) {
            this.applyDiscount();
          } else {
            this.total = subTotal;
          }
          this.showModal = true;
        }
      });
  }

  applyDiscount() {
    this.discount = this.subTotal * 0.1;
    this.total = this.subTotal - this.discount;
    this.showDiscount = true;
  }

  closeModal() {
    this.showModal = false;
    this.router.navigateByUrl('/cart');
  }

  confirm() {
    this.showModal = false;
    // Passing the cart items and price related information to confirmation page
    this.router.navigate(['/confirmation'], {
      state: {
        purchasedItems: [...this.cartItems],
        discount: this.discount,
        subTotal: this.subTotal,
        total: this.total
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
