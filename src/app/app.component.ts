import { Component } from '@angular/core';
import {Router, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My Store';
  showCart: boolean;

  constructor(private router: Router) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
          // To display cart icon only when we are in products related routes and in default route
          this.showCart = (event.url.indexOf('products') > -1) || event.url === '/';
      }
    });
  }

  goToCart() {
    this.router.navigateByUrl('/cart');
  }
}
