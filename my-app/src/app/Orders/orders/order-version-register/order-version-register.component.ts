import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {VersionRegisterTableService} from '../OrderServices/version-register-table.service';
import OrderVersionRegister from '../../OrdersTypesAndClasses/orderVersionRegister';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {Sort} from '../../../util/sort';
import {GeneralTableService} from '../../../util/GeneralTableService/general-table.service';
import {
  generalNamesInSelectedLanguage,
  generalUserNames,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {AuthenticationService} from "../../../LoginandLogOut/AuthenticationServices/authentication.service";
import {SearchService} from "../../../helpers/directive/SearchDirective/search.service";

@Component({
  selector: 'app-order-version-register',
  templateUrl: './order-version-register.component.html',
  styleUrls: ['./order-version-register.component.css']
})
export class OrderVersionRegisterComponent implements OnInit, AfterContentChecked {

  @Input()
  records: OrderforTableCell[];
  createNewRecordDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedMaterialMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  recordNumbers: number;
  selectedOrderId: string;
  orderVersionRegister: OrderVersionRegister;
  ordersInRegister: Order[];
  orderNames = orderNames;
  generalUserNames = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;


  constructor(
    public tableService: GeneralTableService,
    public orderRegisterTableService: VersionRegisterTableService,
    public searchService: SearchService,
    public backendService: OrderBackendService,
    private router: Router,
    private route: ActivatedRoute,
    private activedIdParam: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
    this.records = [];
    this.route.queryParamMap.subscribe(queryParams => {
      this.selectedOrderId = queryParams.get('orderId');
    });
    this.getRecords();

  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalUserNames = this.authenticationService.generalUserNames;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
    this.deleteButtonInfo = this.generalNamesInSelectedLanguage.deleteButtonInfo;
    this.updateButtonInfo = this.generalNamesInSelectedLanguage.updateButtonInfo;
  }

  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }

  getRecords(): void {
    this.backendService.findRecordById(this.selectedOrderId).subscribe((order) => {
      this.tableService.records.length = 0;
      this.backendService.findOrderVersionRegisterById(String(order.body.register.id)).subscribe((register) => {
          this.orderVersionRegister = register.body;
          this.ordersInRegister = this.orderVersionRegister.orders;
          this.ordersInRegister.forEach((order) => {
            this.tableService.records.push(this.backendService.createOrderTableCellFromOrderEntity(order));
            // this.sortOrder(this.tableService.records);
            this.records = this.tableService.getRecords();
            this.searchService.orginalArrayCopy = [...this.tableService.getRecords()];
             /*
             not nedded sorted in backend
             const sort = new Sort();
             this.records.sort(sort.startSort('date', 'desc', 'date'));*/

            }
          );
        }, error => {
          console.error('could not get order version register');
        }
      );
    });
  }

  showDrawing(id: number): void {
    this.router.navigateByUrl(`orders/drawing?orderId=${id}&mode=${OrderOperationMode.SHOWDRAWING}`);
  }
}
