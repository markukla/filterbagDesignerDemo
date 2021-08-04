import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import RoleEnum from '../../../Users/users/userTypes/roleEnum';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {BusinesPartnerBackendService} from '../../../BusinessPartners/business-partners/BusinessPartnerServices/busines-partner-backend.service';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {SearchService} from '../../../helpers/directive/SearchDirective/search.service';
import {ProductMiniatureService} from '../productMiniature/productMiniatureService/product-miniature.service';
import {OperationStatusServiceService} from '../../../OperationStatusComponent/operation-status/operation-status-service.service';
import {
  generalNamesInSelectedLanguage,
  generalUserNames,
  orderNames
} from '../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';
import {Pagninator} from "../../../helpers/Paginator/paginator";
import {ProductBackendService} from "../../../Products/ProductMainComponent/product/ProductServices/product-backend.service";
import {Sort} from "../../../util/sort";
import {OrderExportDto} from "../../OrdersTypesAndClasses/orderExportDto";
import Language from "../../../Languages/LanguageTypesAndClasses/languageEntity";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, AfterContentChecked {

  @Input()
  records: OrderforTableCell[];
  createNewRecordDescription: string;
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;
  partnerIdForOrdersShow: string;
  ordersOfBusinessPartner: Order[];
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  orderNames = orderNames;
  generalUserNames = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  recordsForCurrentPage: OrderforTableCell[];
  paginator: Pagninator;
  numberOfRecordsForPage: number;
  ordersWithNamesInAllLanguages: Order[]=[]
  orderForSapDto: OrderExportDto;
  languageCodeForPdf: string;
  showConfirmSapExportWindow= false;
  languages: Language[];
  waitForServerResponse: string;
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  sapFailerMessege: string;
  sapSuccessMessege: string;


  constructor(public tableService: GeneralTableService,
              public businessPartnerbackendService: BusinesPartnerBackendService,
              private productMiniatureService: ProductMiniatureService,
              public backendService: OrderBackendService,
              private router: Router,
              private route: ActivatedRoute,
              private searChService: SearchService,
              private activedIdParam: ActivatedRoute,
              private authenticationService: AuthenticationService,
              public statusService: OperationStatusServiceService,
              private productBackendService: ProductBackendService,
  ) {
  }

  ngOnInit(): void {
  this.languageCodeForPdf= this.authenticationService.selectedLanguageCode;
  this.languages= this.authenticationService.languages.filter(language=> language.active===true);

    this.route.queryParamMap.subscribe(queryParams => {
      this.partnerIdForOrdersShow = queryParams.get('patnerId');
      this.initColumnNamesInSelectedLanguage();
      this.getRecords();



      /*
      for version with pagination:
       const currentPageNumber = Number(queryParams.get('pageNumber'));
      if(currentPageNumber&& currentPageNumber ===1) {
        //data are refreshed only on first page, instead it infers with proper sorting
         this.getRecords();
        this.numberOfRecordsForPage = 100;
      this.paginator = new Pagninator(currentPageNumber);
      }*/

      this.materialId = this.tableService.selectedId;
    });

  }



  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalUserNames = this.authenticationService.generalUserNames;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
    this.deleteButtonInfo = this.generalNamesInSelectedLanguage.deleteButtonInfo;
    this.updateButtonInfo = this.generalNamesInSelectedLanguage.updateButtonInfo;
    this.createNewRecordDescription = this.orderNames.createNewOrder;
  }

  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
     // this.recordsForCurrentPage = this.paginator.paginateRecords(this.records, this.numberOfRecordsForPage);
    }
  }

  getRecords(): void {
    if (this.partnerIdForOrdersShow){
      this.tableService.records.length = 0;
      this.businessPartnerbackendService.findRecordById(this.partnerIdForOrdersShow).subscribe((partner) => {
        this.backendService.getCurrentOrdersForPartners(partner.body.code).subscribe((orders)=>{
          this.ordersOfBusinessPartner = orders.body.filter(order=>String(order.businessPartner.id)===this.partnerIdForOrdersShow);
          this.ordersWithNamesInAllLanguages= this.ordersOfBusinessPartner;
          this.ordersWithNamesInAllLanguages.forEach((record) => {
              if(record.product) {
                this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(record));
               // this.sortOrder(this.tableService.records);
                this.records = this.tableService.getRecords();
                this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
               // this.recordsForCurrentPage = this.paginator.paginateRecords(this.records, this.numberOfRecordsForPage)
              }
            }
          );
        });

      });
    }
    else if (this.authenticationService.userRole === RoleEnum.PARTNER) {
      const partnerCode: string = this.authenticationService.user.code;
      this.backendService.getCurrentOrdersForPartners(partnerCode).subscribe((records) => {
        this.tableService.records.length = 0;
        this.ordersWithNamesInAllLanguages= records.body;
        this.ordersWithNamesInAllLanguages.forEach((record) => {

              if(record.product) {
                this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(record));
                //this.sortOrder(this.tableService.records);
                this.records = this.tableService.getRecords();
                this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
                //this.recordsForCurrentPage = this.paginator.paginateRecords(this.records, this.numberOfRecordsForPage);
              }

          }
        );

      });
    } else if (this.authenticationService.userRole === RoleEnum.ADMIN || this.authenticationService.userRole === RoleEnum.EDITOR) {
      console.log('in get orders for privilligedUsers ');
      this.backendService.getCurrentOrdersForPrivilligedUsers().subscribe((records) => {
        this.tableService.records.length = 0;
          this.ordersWithNamesInAllLanguages= records.body;
          this.ordersWithNamesInAllLanguages.forEach((record) => {

            if(record.product) {
              this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(record));
              //this.sortOrder(this.tableService.records);
              this.records = this.tableService.getRecords();
              this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
             // this.recordsForCurrentPage = this.paginator.paginateRecords(this.records, this.numberOfRecordsForPage);
            }

          });
          }
        );
    }
  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = materialId;
  }
  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteOrderWithVersionRegisterByCurrentId(String(recordId)).subscribe((response) => {
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
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
      this.showConfirmDeleteWindow = false;
    }
  }

  updateSelectedRecord(selectedId: number): void {
    this.backendService.createOrderDtoForConfirmUpdateShowDrawing = null;
    this.productMiniatureService.selectedProduct = null;
    this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = false;
    this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${selectedId}&mode=${OrderOperationMode.UPDATE}`);
  }


  showDrawing(id: number): void {
      this.router.navigateByUrl(`orders/drawing?orderId=${id}&mode=${OrderOperationMode.SHOWDRAWING}`);
  }

  showOrderHistory(id: number): void {
    this.router.navigateByUrl(`orders/orderVersionRegister?orderId=${id}`);
  }

  createNewOrder(): void {
    this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = false;
    this.backendService.createOrderDtoForConfirmUpdateShowDrawing = null;
    this.productMiniatureService.selectedProduct = null;
    this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CREATENEW}`);
  }
  sortOrder(notSorted: OrderforTableCell[]):void {
    const sort = new Sort();
    notSorted.sort(sort.startSort('date', 'desc', 'date'));
  }

  checkIfAdminRole():boolean {
    if(this.authenticationService.userRole === RoleEnum.ADMIN) {
      return true;
    }
    else {
      return false;
    }
  }
  checkIfAdminOrEditorRole():boolean {
    if(this.authenticationService.userRole === RoleEnum.ADMIN ||this.authenticationService.userRole === RoleEnum.EDITOR) {
      return true;
    }
    else {
      return false;
    }
  }

  confirmExportAction() {
    this.waitForServerResponse= this.generalNamesInSelectedLanguage.waitForServerResponse;
    this.orderForSapDto.languageCodeForPdf= this.languageCodeForPdf;
    this.backendService.addOneSapOrder(this.orderForSapDto).subscribe((response)=>{
      this.waitForServerResponse= undefined;
     this.sapSuccessMessege= this.generalNamesInSelectedLanguage.exportToSapSuccessMessage;
     setTimeout( ()=>{
       this.sapSuccessMessege= undefined;
       this.showConfirmSapExportWindow= false
     }, 1000)
    }, error => {
      this.waitForServerResponse= undefined;
      this.sapFailerMessege=this.generalNamesInSelectedLanguage.exportToSapFailerMessage;
    });

  }

  resignFromExportAction() {
    this.orderForSapDto= null;
    this.waitForServerResponse= undefined;
    this.sapSuccessMessege= undefined;
    this.sapFailerMessege=undefined;
    this.showConfirmSapExportWindow = false;
  }
  closeSapExportWindow() {
    this.waitForServerResponse= undefined;
    this.orderForSapDto= null;
    this.sapSuccessMessege= undefined;
    this.sapFailerMessege=undefined;
    this.showConfirmSapExportWindow = false;
  }

  showExportToSapForm(id: number) {

    const orderSelectedToExportWithAllLanguages: Order = this.ordersWithNamesInAllLanguages.filter(order=> order.id===id)[0];
     this.orderForSapDto= {
       Indeks: orderSelectedToExportWithAllLanguages.index,
       languageCodeForPdf: this.languageCodeForPdf,
       orderIdForPdf: String(id),
       dateAdd: new Date(),
       dateAddSAP: null,
       nazwa_CZ: orderSelectedToExportWithAllLanguages.product.productType.vocabulary.localizedNames.filter(localizedName=>localizedName.language.languageCode==='CS')[0].nameInThisLanguage +' '+orderSelectedToExportWithAllLanguages.orderName,
       rysunek: orderSelectedToExportWithAllLanguages.orderTotalNumber,
       Status: 1

     }
     this.showConfirmSapExportWindow = true
  }
}
