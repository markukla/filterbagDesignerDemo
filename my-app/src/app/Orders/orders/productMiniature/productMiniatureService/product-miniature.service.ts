import { Injectable } from '@angular/core';
import Product from '../../../../Products/ProductTypesAndClasses/product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductMiniatureService {
  allProducts: Product[];
  selectedProduct: Product;
  productChangedByDrawingCliclingInUpdateOrConfirmModes: boolean;
  constructor() {
    this.setFildsParamtersBasingOnSessionStorage();
  }

  setFildsParamtersBasingOnSessionStorage(): void {
    const allProductsFromSessionStorage: Product[]= JSON.parse(sessionStorage.getItem('allProductsInMiniatureService'));
    if(allProductsFromSessionStorage) {
      this.allProducts = allProductsFromSessionStorage;
    }
    const selectedProductsFromSessionStorage: Product= JSON.parse(sessionStorage.getItem('selectedProductsInMiniatureService'));
   if(selectedProductsFromSessionStorage) {
     this.selectedProduct = selectedProductsFromSessionStorage;
   }

    const productChangedByDrawingCliclingInUpdateOrConfirmModesFromSessionStorage: boolean= JSON.parse(sessionStorage.getItem('productChangedByDrawingClicling'));
    if(productChangedByDrawingCliclingInUpdateOrConfirmModesFromSessionStorage) {
      this.productChangedByDrawingCliclingInUpdateOrConfirmModes = productChangedByDrawingCliclingInUpdateOrConfirmModesFromSessionStorage;
    }
  }

}
