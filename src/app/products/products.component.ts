import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {State, selector} from '../store/reducers/product';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  allProducts: Array<Product> = [];
  products: Array<Product> = [];
  categoryTypes: Array<any> = [];
  priceRanges: Array<any> = [];
  subscription: Subscription;
  @ViewChild('sortDropdown') sortDropdown: ElementRef;

  constructor(private store: Store<State>,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.store.select(selector.getProducts)
      .subscribe(state => {
        const data: any = state;
        if (data && data.products) {
          this.allProducts = data.products;
          this.products = [...this.allProducts];
        }
      });

    this.setPriceRanges();
    this.setCategoryTypes();
  }

  setPriceRanges() {
    this.priceRanges = [
      {
        label: 'less than $5',
        min: 0,
        max: 4.99,
        checked: false
      },
      {
        label: '$5 - $10',
        min: 5,
        max: 10,
        checked: false
      },
      {
        label: '$10 - $15',
        min: 10,
        max: 15,
        checked: false
      },
      {
        label: '$15 - $20',
        min: 15,
        max: 20,
        checked: false
      },
      {
        label: 'over $20',
        min: 20.01,
        max: Infinity,
        checked: false
      }
    ];
  }

  setCategoryTypes() {
    this.categoryTypes = [
      {
        label: 'Men Accessories',
        checked: false
      }, {
        label: 'Women Accessories',
        checked: false
      }, {
        label: 'Children Accessories',
        checked: false
      }, {
        label: 'Sports Accessories',
        checked: false
      }
    ];
  }

  onCategoryChange(index: number) {
    this.categoryTypes[index].checked = !this.categoryTypes[index].checked;
    this.filterProducts();
  }

  onPriceRangeChange(index: number) {
    this.priceRanges[index].checked = !this.priceRanges[index].checked;
    this.filterProducts();
  }

  filterProducts() {
    // first we are filtering products by category and then followed by price
    let categoryProducts = this.getCategoryProducts();
    let priceRangeProducts = this.getPriceRangeProducts(categoryProducts);
    this.products = [...priceRangeProducts];

    // If any sort by option is selected, performing sort as well on the products
    if (this.sortDropdown.nativeElement && this.sortDropdown.nativeElement.value) {
      this.sortProducts(this.sortDropdown.nativeElement.value);
    }
  }

  getCategoryProducts(): Array<Product> {
    let products: Array<Product> = [];
    const categorySelections: Array<string> = [];
    this.categoryTypes.forEach(category => {
      if (category.checked) {
        categorySelections.push(category.label);
      }
    });
    if (categorySelections.length) {
      products = this.allProducts.filter(product => {
        return categorySelections.includes(product.category);
      });
    }

    return products.length ? products : [...this.allProducts];
  }

  getPriceRangeProducts(categoryProducts: Array<Product>) {
    let products: Array<Product> = [];
    let anyPriceRangeSelected = false;
    categoryProducts.forEach(product => {
      let match = false;
      this.priceRanges.forEach(range => {
        if (match) {
          return;
        }
        if (!anyPriceRangeSelected && range.checked) {
          anyPriceRangeSelected = true;
        }
        // checking whether the product matches the range
        if (range.checked && product.price >= range.min && product.price <= range.max) {
          match = true;
        }
      });
      if (match) {
        products.push(product);
      }
    });

    return products.length ? products : (anyPriceRangeSelected ? [] : categoryProducts);
  }

  goToDetail(product: Product) {
    this.router.navigateByUrl(`/products/${product.id}`);
  }

  sortProducts(value: string) {
    switch (value) {
      case '1':
        // Sort by price High to Low
        this.products.sort((a: Product, b: Product) => {
          return b.price > a.price ? 1 : -1;
        });
        break;

      case '2':
        // Sort by price Low to High
        this.products.sort((a: Product, b: Product) => {
          return a.price > b.price ? 1 : -1;
        });
        break;

      default:
        this.products = [...this.allProducts];
        this.filterProducts();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity?: number;
}
