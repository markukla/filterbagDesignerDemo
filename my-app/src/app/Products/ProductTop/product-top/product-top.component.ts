import {AfterContentChecked, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import {MaterialTableService} from '../../../materials/MaterialServices/material-table.service';
import {MaterialBackendService} from '../../../materials/MaterialServices/material-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTopTableService} from '../ProductTopServices/product-top-table.service';
import {ProductTopBackendService} from '../ProductTopServices/product-top-backend.service';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {SearchService} from '../../../helpers/directive/SearchDirective/search.service';
import {ProductTopForTableCell} from '../../ProductTypesAndClasses/productTopForTableCell';
import OperationModeEnum from '../../../util/OperationModeEnum';
import {OperationStatusServiceService} from '../../../OperationStatusComponent/operation-status/operation-status-service.service';
import {
  generalNamesInSelectedLanguage,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../../LoginandLogOut/AuthenticationServices/authentication.service";
import {ProductTypeBackendService} from "../../ProductType/ProductTypeServices/product-type-backend.service";
import ProductType from "../../ProductTypesAndClasses/productType.entity";
import Product from "../../ProductTypesAndClasses/product.entity";
import {ProductBackendService} from "../../ProductMainComponent/product/ProductServices/product-backend.service";
import CreateProductTypeDto from "../../ProductTypesAndClasses/createProductType.dto";

@Component({
  selector: 'app-product-top',
  templateUrl: './product-top.component.html',
  styleUrls: ['./product-top.component.css']
})
export class ProductTopComponent implements OnInit, AfterContentChecked {
  @Input()
  records: ProductTopForTableCell[];
  @Input()
  orginalMaterialsCopy: Material[];
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
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
  productsWithTopsSelectedToDeleteExists: boolean = false;
  deleteProductConfirmed= false;


  constructor(public tableService: GeneralTableService,
              public backendService: ProductTopBackendService,
              private router: Router,
              private activedIdParam: ActivatedRoute,
              private searChService: SearchService,
              public statusService: OperationStatusServiceService,
              private authenticationService: AuthenticationService,
              private productTypeBackendService: ProductTypeBackendService,
              private productBackendService: ProductBackendService,
              private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params=> {
      this.productTypeId = params.get('productTypeId')
      this.initColumnNamesInSelectedLanguage();
      this.getRecords();
    });
    this.materialId = this.tableService.selectedId;
  }
  initColumnNamesInSelectedLanguage(): void {
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
      console.log('in if for productTypeId');
      this.productTypeBackendService.findRecordById(this.productTypeId).subscribe((productType) => {
        this.tableService.records.length = 0;
        this.selectedproductType = productType.body;
        const topsOfProductTypeAndNotSoftDeletedProducts= this.selectedproductType.tops.filter(pt=> this.allProducts.map(p=> p.productTop.id).includes(pt.id));
        topsOfProductTypeAndNotSoftDeletedProducts.forEach((record) => {
          if(record.softDeleteDate ===null){
            const recorForTableCell = this.backendService.createProductTopForTableCellFromProductTop(record);
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
          const recorForTableCell = this.backendService.createProductTopForTableCellFromProductTop(record);
          this.tableService.records.push(recorForTableCell);
        });
        this.records = this.tableService.getRecords();
        this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
      });
    }


  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(recordToDeleteId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.productsWithTopsSelectedToDeleteExists = this.allProducts.filter(product => product.productTop.id === recordToDeleteId).length>0;
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = recordToDeleteId;
  }
  deleteSelectedRecordFromDatabase(recordTodeleteId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      if(this.productTypeId && this.selectedproductType) {
        //delete only for this selected productType(remove from list), not from all productTops
        const topsOfSelectedProductType= this.selectedproductType.tops;
        topsOfSelectedProductType.forEach((record: ProductTop, index: number) => {
          if (record.id === recordTodeleteId ) {
            topsOfSelectedProductType.splice(index, 1);
          }
        });
        const updatedProductType: CreateProductTypeDto = {
          ...this.selectedproductType,
          tops: topsOfSelectedProductType,
          localizedNames: this.selectedproductType.vocabulary.localizedNames
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
        this.allProductTypes.forEach((pt, typeIndex)=>{
          pt.tops.forEach((top, index, self)=>{
            if(top.id === recordTodeleteId) {
              self.splice(index, 1);
            }


          });
          /*tops tabel is updated in above loop*/
          const updatedProductType: CreateProductTypeDto = {
            ...this.allProductTypes.filter(pt=> pt.id=== pt.id)[0],
            localizedNames: this.selectedproductType.vocabulary.localizedNames
          };
          this.productTypeBackendService.updateRecordById(String(pt.id), updatedProductType).subscribe();

        });
        if(this.deleteProductConfirmed){
          const productsWithThisTopToDelete = this.allProducts.filter(product=> product.productTop.id === recordTodeleteId);
          productsWithThisTopToDelete.forEach((productToDelete)=>{
            this.productBackendService.deleteRecordById(String(productToDelete.id)).subscribe();
          });
        }
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.productsWithTopsSelectedToDeleteExists = false;
        this.deleteProductConfirmed = false;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      }, error => {
        this.operationFailerStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
        this.tableService.selectedId = null;
        this.productsWithTopsSelectedToDeleteExists = false;
        this.deleteProductConfirmed = false;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      });
      }
    }
    else {
      this.showConfirmDeleteWindow = false;
      this.productsWithTopsSelectedToDeleteExists = false;
      this.deleteProductConfirmed = false;
    }
  }
  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl(`/products/tops/add?mode=${OperationModeEnum.UPDATE}&recordId=${recordId}`);
  }

  createNewRecord(): void {
    if(this.productTypeId) {
      this.router.navigateByUrl(`/products/tops/add?mode=${OperationModeEnum.CREATENEW}&productTypeId=${this.productTypeId}`);
    }
    else {
      this.router.navigateByUrl(`/products/tops/add?mode=${OperationModeEnum.CREATENEW}`)
    }
  }


  deleteProductIfConfirmed(deleteConfirmedEvent: boolean) {
    if(deleteConfirmedEvent) {
      this.deleteProductConfirmed = true;
    }
  }
}
