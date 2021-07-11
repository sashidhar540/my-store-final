import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, selector} from '../store/reducers/product';
import {Product} from '../products/products.component';
import {updateQuantity} from '../store/actions/product';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartQuantity: number = 0;
  cartItems: Array<Product> = [];
  @Input() showCartIcon: boolean = false;
  subTotal: number = 0;
  tempQuantity: number = 0;
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
          this.cartQuantity = quantity;
          this.subTotal = subTotal;
        }
      });
  }

  checkValue(event: any) {
    const keyCode = event.keyCode;
    /*
            keyCode >= 48 && keyCode <= 57 --> numbers
            keyCode === 8 --> delete
            keyCode === 9 --> tab
            keyCode === 37 --> ArrowLeft
            keyCode === 39 --> ArrowRight
         */
    if (keyCode >= 48 && keyCode <= 57 || keyCode === 8 || keyCode === 9 || keyCode === 189
      || keyCode === 37 || keyCode === 39) {
      return true;
    } else {
      return false;
    }
  }

  updateQuantity(product: Product, isIncrement: boolean) {
    /*
      isIncrement = true -> increases quantity of a product in cart by 1
      isIncrement = false -> decreases quantity of a product in cart by 1
     */
    this.store.dispatch(updateQuantity({id: product.id, isAdd: isIncrement}));
  }

  onFocus(product: Product) {
    /* Maintaining quantity value so that after blur if quantity value is empty,
      we can reset to previous quantity
     */
    this.tempQuantity = product.quantity ? product.quantity : 0;
  }

  onBlur(event: any, product: Product) {
    /*
        Here we are resetting quantity value if empty.
        If quantity is provided setting quantity value of item in cart to user entered value
     */
    const quantity = !event.target.value ? this.tempQuantity : Number(event.target.value);
    this.store.dispatch(updateQuantity({id: product.id, isAdd: false, quantity: Number(quantity)}));
  }

  goToCheckoutPage() {
    this.router.navigateByUrl('/checkout');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
