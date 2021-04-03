import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import {ProductBottomTableService} from '../ProductBottomServices/product-bottom-table.service';
import {ProductBottomBackendService} from '../ProductBottomServices/product-bottom-backend.service';
import {SearchService} from '../../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {ProductBottomForTableCell} from '../../ProductTypesAndClasses/productBottomForTableCell';
import OperationModeEnum from '../../../util/OperationModeEnum';
import {OperationStatusServiceService} from '../../../OperationStatusComponent/operation-status/operation-status-service.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  generalNamesInSelectedLanguage,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {AuthenticationService} from "../../../LoginandLogOut/AuthenticationServices/authentication.service";
import {Pagninator} from "../../../helpers/Paginator/paginator";
import {ProductTypeBackendService} from "../../ProductType/ProductTypeServices/product-type-backend.service";
import ProductType from "../../ProductTypesAndClasses/productType.entity";
import Product from "../../ProductTypesAndClasses/product.entity";
import {ProductBackendService} from "../../ProductMainComponent/product/ProductServices/product-backend.service";

@Component({
  selector: 'app-product-bottom',
  templateUrl: './product-bottom.component.html',
  styleUrls: ['./product-bottom.component.css']
})
export class ProductBottomComponent implements OnInit, AfterContentChecked {
  @Input()
  records: ProductBottomForTableCell[];
  createNewMaterialDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  orderNamesInSelectedLanguage = orderNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  productTypeId: string;
  selectedproductType: ProductType;
  allProductTypes: ProductType [];
  allProducts: Product[];
  productsWithBottomSelectedToDeleteExists: boolean = false;
  deleteProductConfirmed= false;

  constructor(public tableService: GeneralTableService,
              public backendService: ProductBottomBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              private searChService: SearchService,
              public statusService: OperationStatusServiceService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private productTypeBackendService: ProductTypeBackendService,
              private productBackendService: ProductBackendService) {
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params=> {
      this.productTypeId = params.get('productTypeId')
      this.initColumnNamesInSelectedLanguage();
        this.getRecords();
    });
    this.materialId = this.tableService.selectedId;
    this.deleteButtonInfo = this.generalNamesInSelectedLanguage.deleteButtonInfo;
    this.updateButtonInfo = this.generalNamesInSelectedLanguage.updateButtonInfo;
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNamesInSelectedLanguage = this.authenticationService.orderNamesInSelectedLanguage;

  }
  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }
  getRecords(): void {
    this.productTypeBackendService.getRecords().subscribe((productTypes)=>{
      this.allProductTypes = productTypes.body;
    });
    this.productBackendService.getRecords().subscribe((products)=>{
      this.allProducts = products.body;
    });
    if(this.productTypeId) {
      console.log('in if for productTypeId')
      this.productTypeBackendService.findRecordById(this.productTypeId).subscribe((productType)=>{
        this.tableService.records.length = 0;
        this.selectedproductType = productType.body;
        productType.body.bottomsForThisProductType.forEach((record) => {
          if(record.softDeleteDate ===null) {
            const recorForTableCell = this.backendService.createProductBottomForTableCellFromProductTop(record);
            this.tableService.records.push(recorForTableCell);
          }

        });

        this.records = this.tableService.getRecords();
        this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
      });
    }
    else {
      this.backendService.getRecords().subscribe((records) => {
        this.tableService.records.length = 0;
        this.tableService.records = [];
        records.body.forEach((record) => {
          const recorForTableCell = this.backendService.createProductBottomForTableCellFromProductTop(record);
          this.tableService.records.push(recorForTableCell);
        });
        this.records = this.tableService.getRecords();
        this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
      });
    }


  }


  selectRecordtoDeleteAndShowConfirmDeleteWindow(recordToDeleteId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.productsWithBottomSelectedToDeleteExists = this.allProducts.filter(product => product.productBottom.id === recordToDeleteId).length>0;
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = recordToDeleteId;
  }
  deleteSelectedRecordFromDatabase(recordTodeleteId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      if(this.productTypeId && this.selectedproductType) {
        //delete only for this selected productType(remove from list), not from all productTops
        const bottomsOfSelectedProductType: ProductBottom[]= this.selectedproductType.bottomsForThisProductType;
        bottomsOfSelectedProductType.forEach((record: ProductBottom, index: number) => {
          if (record.id === recordTodeleteId ) {
            bottomsOfSelectedProductType.splice(index, 1);
          }
        });
        const updatedProductType: ProductType = {
          ...this.selectedproductType,
          bottomsForThisProductType: bottomsOfSelectedProductType
        };
        this.productTypeBackendService.updateRecordById(this.productTypeId, updatedProductType).subscribe((response)=> {
          this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
          this.tableService.selectedId = null;
          this.showConfirmDeleteWindow = false;
          this.tableService.getRecords().forEach((record, index)=> {
            if(record.id=== recordTodeleteId) {
              this.tableService.records.splice(index, 1);
            }
          });
          this.statusService.makeOperationStatusVisable();
          this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
        }, error => {
          this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
          this.tableService.selectedId = null;
          this.showConfirmDeleteWindow = false;
          this.statusService.makeOperationStatusVisable();
          this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
        });

      }
      else {
        this.backendService.deleteRecordById(String(recordTodeleteId)).subscribe((response) => {
          this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
          this.allProductTypes.forEach((pt, typeIndex)=>{
            pt.bottomsForThisProductType.forEach((bottom, index, self)=>{
              if(bottom.id === recordTodeleteId) {
                self.splice(index, 1);
              }


            });
            /*bottoms tabel is updated in above loop, update ProductType - productBottoms relation required*/
            const updatedProductType = this.allProductTypes.filter(pt=> pt.id=== pt.id)[0];
            this.productTypeBackendService.updateRecordById(String(pt.id), updatedProductType).subscribe();
          });
          if(this.deleteProductConfirmed){
            const productsWithThisTopToDelete = this.allProducts.filter(product=> product.productBottom.id === recordTodeleteId);
            productsWithThisTopToDelete.forEach((productToDelete)=>{
              this.productBackendService.deleteRecordById(String(productToDelete.id)).subscribe();
            });
          }

          this.productsWithBottomSelectedToDeleteExists = false;
          this.deleteProductConfirmed = false;
          this.tableService.selectedId = null;
          this.showConfirmDeleteWindow = false;
          this.statusService.makeOperationStatusVisable();
          this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
        }, error => {
          this.productsWithBottomSelectedToDeleteExists = false;
          this.deleteProductConfirmed = false;
          this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
          this.tableService.selectedId = null;
          this.showConfirmDeleteWindow = false;
          this.statusService.makeOperationStatusVisable();
          this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
        });
      }
    }
    else {
      this.showConfirmDeleteWindow = false;
      this.productsWithBottomSelectedToDeleteExists = false;
      this.deleteProductConfirmed = false;
    }
  }

  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl(`/products/bottoms/add?mode=${OperationModeEnum.UPDATE}&recordId=${recordId}`);
  }


  createNewRecord(): void {
    if(this.selectedproductType) {
      this.router.navigateByUrl(`/products/bottoms/add?mode=${OperationModeEnum.CREATENEW}&productTypeId=${this.productTypeId}`);
    }
    else {
      this.router.navigateByUrl(`/products/bottoms/add?mode=${OperationModeEnum.CREATENEW}`);
    }

  }
  deleteProductIfConfirmed(deleteConfirmedEvent: boolean) {
    if(deleteConfirmedEvent) {
      this.deleteProductConfirmed = true;
    }
  }


}
