import {createAction, props} from '@ngrx/store';
import {Product} from '../../products/products.component';

export const initialize = createAction('[Products] Initialize',
  props<{ products: Array<Product> }>());
export const updateQuantity = createAction('[Products] update',
  props<{ id: number, isAdd: boolean, quantity?: number}>());
export const resetCart = createAction('[Products] reset');
