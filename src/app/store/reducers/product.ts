import {Action, createReducer, on} from '@ngrx/store';
import {initialize, resetCart, updateQuantity} from '../actions/product';
import {Product} from '../../products/products.component';

export interface State {
  products: Array<Product>;
}

const initialState: State = {
  products: []
};

const _productReducer = createReducer(
  initialState,
  on(initialize, (state, {products}) => {
    return Object.assign({}, state, {
      products: [...products]
    });
  }),
  on(updateQuantity, (state, {id, isAdd, quantity}) => {
    const index = state.products.findIndex(product => product.id === id);
    const newProduct = {...state.products[index]};
    if (!quantity) {
      // @ts-ignore
      newProduct.quantity = isAdd ? (newProduct.quantity + 1) : (newProduct.quantity >= 1 ? newProduct.quantity - 1 : 0);
    } else {
      newProduct.quantity = quantity;
    }
    const allProducts = [...state.products];

    allProducts.splice(index, 1, newProduct);
    sessionStorage.setItem('cartItems', JSON.stringify(allProducts));

    return Object.assign({}, state, {
      products: [...allProducts]
    });
  }),
  on(resetCart, (state) => {
    const allProducts: Array<Product> = [];
    state.products.forEach((product: Product) => {
      const newProduct = {...product};
      newProduct.quantity = 0;
      allProducts.push(newProduct);
    });

    sessionStorage.removeItem('cartItems');

    return Object.assign({}, state, {
      products: [...allProducts]
    });
  })
);

export function reducer(state: State | undefined, action: Action) {
  return _productReducer(state, action);
}


export const selector = {
  getProducts: (state: State) => state.products
};
