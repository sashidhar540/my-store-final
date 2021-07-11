import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {selector, State} from '../store/reducers/product';
import {resetCart} from '../store/actions/product';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, AfterViewInit {
  data: any = {};
  orderDate: Date;
  invoiceNumber: string;
  routeState: any;

  constructor(private router: Router,
              private store: Store<State>) {
    // @ts-ignore
    if (this.router.getCurrentNavigation().extras.state) {
      // @ts-ignore
      this.routeState = this.router.getCurrentNavigation().extras.state;
      if (this.routeState) {
        this.data = {...this.routeState};
        this.orderDate = new Date();
        // Using random number and formatting to display dashes
        this.invoiceNumber = (Math.random() * 1000000000).toFixed(0)
          .replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // After the view is rendered resetting cart items
    this.store.dispatch(resetCart());
  }

  goToProducts() {
    // To go back to products view
    this.router.navigateByUrl('/products');
  }

}
