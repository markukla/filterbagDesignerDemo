import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import ProductType from '../../ProductTypesAndClasses/productType.entity';
import {ProductTypeBackendService} from '../ProductTypeServices/product-type-backend.service';
import {SearchService} from '../../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {ProductTypeForTableCell} from '../../ProductTypesAndClasses/productTypeForTableCell';
import OperationModeEnum from '../../../util/OperationModeEnum';
import {OperationStatusServiceService} from '../../../OperationStatusComponent/operation-status/operation-status-service.service';
import {
  generalNamesInSelectedLanguage,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../../LoginandLogOut/AuthenticationServices/authentication.service";
import Product from "../../ProductTypesAndClasses/product.entity";
import {ProductBackendService} from "../../ProductMainComponent/product/ProductServices/product-backend.service";

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.css']
})
export class ProductTypeComponent implements OnInit, AfterContentChecked {
  @Input()
  records: ProductTypeForTableCell[];
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  showUpdateForm = false;
  materialId: number;
  recordNumbers: number;
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  orderNamesInSelectedLanguage = orderNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  allProducts: Product[];
  productsWithTypeSelectedToDeleteExists: boolean = false;
  deleteProductConfirmed= false;

  constructor(public tableService: GeneralTableService,
              public backendService: ProductTypeBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              private searChService: SearchService,
              public statusService: OperationStatusServiceService,
              private authenticationService: AuthenticationService,
              private productBackendService: ProductBackendService) {
  }
  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
    this.getRecords();
    this.materialId = this.tableService.selectedId;
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
  }
  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }
  getRecords(): void {
    this.backendService.getRecords().subscribe((records) => {
      this.tableService.records.length = 0;
      this.tableService.records = [];
      records.body.forEach((record) => {
        const recorForTableCell = this.backendService.createProductTypeForTableCellFromProductTop(record);
        this.tableService.records.push(recorForTableCell);
      });
      this.productBackendService.getRecords().subscribe((products)=>{
        this.allProducts = products.body;
      });
      this.records = this.tableService.getRecords();
      this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
    });
  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(recordToDeleteId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.productsWithTypeSelectedToDeleteExists = this.allProducts.filter(product => product.productType.id === recordToDeleteId).length>0
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = recordToDeleteId;
  }
  deleteSelectedRecordFromDatabase(recordToDeleteId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteRecordById(String(recordToDeleteId)).subscribe((response) => {
        if(this.deleteProductConfirmed){
          const productsWithThisTopToDelete = this.allProducts.filter(product=> product.productType.id === recordToDeleteId);
          productsWithThisTopToDelete.forEach((productToDelete)=>{
            this.productBackendService.deleteRecordById(String(productToDelete.id)).subscribe();
          });
        }
        this.productsWithTypeSelectedToDeleteExists = false;
        this.deleteProductConfirmed = false;
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);

      }, error => {
        this.productsWithTypeSelectedToDeleteExists = false;
        this.deleteProductConfirmed = false;
        this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      });
    }
    else {
      this.showConfirmDeleteWindow = false;
      this.productsWithTypeSelectedToDeleteExists = false;
      this.deleteProductConfirmed = false;
    }
  }
  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl(`/products/types/add?mode=${OperationModeEnum.UPDATE}&recordId=${recordId}`);
  }


  createNewRecord(): void {
    this.router.navigateByUrl(`/products/types/add?mode=${OperationModeEnum.CREATENEW}`);
  }


  showProductTops(selectedId: number) {
    this.router.navigateByUrl(`/products/tops?productTypeId=${String(selectedId)}`);
  }

  showProductBottoms(selectedId: number) {
    this.router.navigateByUrl(`/products/bottoms?productTypeId=${String(selectedId)}`);
  }
  deleteProductIfConfirmed(deleteConfirmedEvent: boolean) {
    if(deleteConfirmedEvent) {
      this.deleteProductConfirmed = true;
    }
  }

}
