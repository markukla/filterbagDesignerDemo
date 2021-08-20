import {AfterContentChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {ProductMiniatureService} from '../productMiniatureService/product-miniature.service';
import Product from '../../../../Products/ProductTypesAndClasses/product.entity';
import {API_URL} from '../../../../Config/apiUrl';
import {OrderBackendService} from '../../OrderServices/order-backend.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';
import LocalizedName from '../../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {
  getSelectedLanguageFromNamesInAllLanguages,
  setTabelColumnAndOtherNamesForSelectedLanguage
} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {
  generalNamesInSelectedLanguage,
  generalUserNames,
  orderNames
} from "../../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {ProductBackendService} from "../../../../Products/ProductMainComponent/product/ProductServices/product-backend.service";
import {ProductForTableCell} from "../../../../Products/ProductTypesAndClasses/productForTableCell";
import {SearchService} from "../../../../helpers/directive/SearchDirective/search.service";

@Component({
  selector: 'app-procut-miniature-component',
  templateUrl: './procut-miniature-component.component.html',
  styleUrls: ['./procut-miniature-component.component.css']
})
export class ProcutMiniatureComponentComponent implements OnInit, AfterContentChecked {
  products: ProductForTableCell[];
  selectedProduct: Product;
  orderNames = orderNames;
  generalUserNames = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  typeSearch: string;
 topSearch: string;
  bottomSearch: string;
  orginallProducts: ProductForTableCell[];
  @ViewChildren('searchInput', {read: ElementRef}) searchInputs: ElementRef[];

  constructor(
    private productMiniatureService: ProductMiniatureService,
    private productBackendService: ProductBackendService,
    private orderBackendService: OrderBackendService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
  //  this.products = this.productMiniatureService.allProducts;
    this.products= [];
    this.searchService.orginalArrayCopy=[];
    this.productMiniatureService.allProducts.forEach(product=>{
     const productForTabelCell= this.productBackendService.createProductForTableCellFromProductTop(product);
      this.products.push(productForTabelCell);
      console.log(`productUrlWithAPiUrl=` + productForTabelCell.productUrlAndApiUrl);
    });
    this.searchService.orginalArrayCopy = [...this.products];
    this.orginallProducts =[...this.products];
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNames, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalUserNames, this.authenticationService.vocabulariesInSelectedLanguage);
  }
  getDrawingUrl(product: ProductForTableCell): string  {
    const url = API_URL + product.productUrl;
    return url;
  }

  async selectProductAndNavigateBack(product: ProductForTableCell): Promise<void> {
    const selectedProductBody=await this.productBackendService.findRecordById(String(product.id)).toPromise()
    this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing.product =  selectedProductBody.body;
    sessionStorage.setItem('createOrderDto', JSON.stringify(this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing));
    this.productMiniatureService.selectedProduct = selectedProductBody.body;
    const routeHistoryLastindex: number = this.authenticationService._routeHistory.length - 1;
    const routeHistorySecondLastindex = this.authenticationService._routeHistory.length - 1;
    if (this.authenticationService._routeHistory[routeHistoryLastindex].includes('orders/drawing')) {
      this.router.navigateByUrl(this.authenticationService._routeHistory[routeHistorySecondLastindex]);
    }
    else {
      this.router.navigateByUrl(this.authenticationService._previousUrl);
    }
  }
  getNameInSelectedLanguage(localizedNames: LocalizedName[]): string {
    return getSelectedLanguageFromNamesInAllLanguages(localizedNames, this.authenticationService.selectedLanguageCode);
  }


  makePictureLarger(): void {
  }
  changeOrginallArrayCoppyAfterContentCHange(): void {


    if(this.searchInputs){
      console.log(`this.searchInputs.length= ${this.searchInputs.length} `);
    }

if(this.searchInputs && this.searchInputs.length>0){

  this.products = [... this.orginallProducts];
  console.log()
  const searchInputsIds= this.searchInputs.map(input=> input.nativeElement.id);
  this.searchInputs.forEach(input=>{
    if(input.nativeElement.value &&input.nativeElement.value !=='' ){
      searchInputsIds.forEach(id=>{
        if(id=== input.nativeElement.id){
          this.products= this.products.filter(product=> product[id].includes(input.nativeElement.value));
        }
      });


    }
    else {
     // this.products = [... this.orginallProducts];
    }


  });
}

  }

  ngAfterContentChecked(): void {
    this.changeOrginallArrayCoppyAfterContentCHange();
  }

  navigateBack() {
    const routeHistoryLastindex: number = this.authenticationService._routeHistory.length - 1;
    const routeHistorySecondLastindex = this.authenticationService._routeHistory.length - 1;
    if (this.authenticationService._routeHistory[routeHistoryLastindex].includes('orders/drawing')) {
      this.router.navigateByUrl(this.authenticationService._routeHistory[routeHistorySecondLastindex]);
    }
    else {
      this.router.navigateByUrl(this.authenticationService._previousUrl);
    }

  }
}
