import { Injectable } from '@angular/core';
import ProductType from '../../../Products/ProductTypesAndClasses/productType.entity';
import ProductBottom from '../../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../Products/ProductTypesAndClasses/productTop.entity';
import {DrawingPaths} from '../../../Products/ProductTypesAndClasses/drawingPaths';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import User from '../../../Users/users/userTypes/user';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import OrderVersionRegister from '../../OrdersTypesAndClasses/orderVersionRegister';
import {OrderTableService} from './order-table.service';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import NewestOrderNumber from '../../OrdersTypesAndClasses/newestOrderNumber';
import {API_URL} from '../../../Config/apiUrl';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import {GeneralTableService} from "../../../util/GeneralTableService/general-table.service";
import {getSelectedLanguageFromNamesInAllLanguages} from "../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../../LoginandLogOut/AuthenticationServices/authentication.service";
import {ProductBackendService} from "../../../Products/ProductMainComponent/product/ProductServices/product-backend.service";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import OrderToExportEntity from "../../OrdersTypesAndClasses/OrderToExportEntity";
import OrderToExport from "../../OrdersTypesAndClasses/OrderToExportEntity";
import {OrderExportDto} from "../../OrdersTypesAndClasses/orderExportDto";
import CreateProductDto from "../../../Products/ProductTypesAndClasses/product.dto";

@Injectable({
  providedIn: 'root'
})
export class OrderBackendService {
  rootURL = API_URL ;
  endpointUrl = '/api/orders';
  sapEndpointUrl='/api/SapOrders';
  selectedProduct: Product;
  selectedParnter: User;
  selectedMaterial: Material;
  logedUser: User;
  createOrderDtoForConfirmUpdateShowDrawing: CreateOrderDto;
  confirmButtonClickedInChangeDrawingMode: boolean = true;
  constructor(private http: HttpClient,
              private tableService: GeneralTableService,
              private authenticatoinService: AuthenticationService,
              private productBackenService: ProductBackendService) {
    this.setCreateOrderDtoBasingOnSessionStorage();
  }

  getCurrentOrdersForPrivilligedUsers(): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(`${this.rootURL + this.endpointUrl}/currents`, {observe: 'response'}).pipe(take(1));
  }
  getCurrentOrdersForPartners(partnerCode: string): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(`${this.rootURL + this.endpointUrl}/currents/businessPartner/${partnerCode}`, {observe: 'response'});
  }
  getNewOrderNumber(): Observable<HttpResponse<NewestOrderNumber>> {
    return this.http.get<NewestOrderNumber>(`${this.rootURL + this.endpointUrl}/orderNumber/newest`, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateOrderDto): Observable<HttpResponse<Order>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Order>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createOrderTableCellFromOrderEntity(record.body));
      }));
  }

  deleteOrderWithVersionRegisterByCurrentId(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/currents/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.tableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, updatedRecord: CreateOrderDto): Observable<HttpResponse<Order>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/currents/${id}/newVersion`;
    return this.http.post<Order>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable

      tap((record) => {
        const recordbody = record.body;
        this.tableService.updateTableRecord(Number(id),  this.createOrderTableCellFromOrderEntity(record.body));
      }));
  }
  findRecordById(id: string): Observable<HttpResponse<Order>>{
    const getUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.get<Order>(getUrl, {observe: 'response'} );
  }
  findOrderVersionRegisterById(id: string): Observable<HttpResponse<OrderVersionRegister>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/orderVersionRegister/${id}`;
    return this.http.get<OrderVersionRegister>(getUrl, {observe: 'response'} );
  }
  validateIndexVersion(createOrderDto: CreateOrderDto): Observable<HttpResponse<any>> {
    const postUrl = `${this.rootURL + this.endpointUrl}/indexValidation`;
    return this.http.post<any>(postUrl,createOrderDto,{observe: 'response'} );
  }

  getDrawingPdf(selectedDrawingUrl: string): Observable<any> {
    const getUrl =`${this.rootURL}/api/drawing/save/pdf`;
    console.log(`getUrl = ${getUrl} `);
    return this.http.post(getUrl, {url: selectedDrawingUrl},{responseType: 'blob'});
  }

  getCreateOrderDtoFromOrder(order: Order): CreateOrderDto {
    const createOrderDto: CreateOrderDto = {
      product: order.product,
      orderTotalNumber: order.orderTotalNumber,
      orderNumber: order.orderNumber,
      orderDetails: order.orderDetails,
      orderName: order.orderName,
      orderVersionNumber: order.orderVersionNumber,
      commentToOrder: order.commentToOrder,
      date: order.date,
      businessPartner: order.businessPartner,
      creator: order.creator,
      index: order.index,
      productMaterial: order.productMaterial,
      addMaterialDescription: order.addMaterialDescription,
      indexVersionLetter: order.index[10]

    };
    return createOrderDto;
  }
  findOrdersWithProductTypeProductTopProductBottom (createProductdto: CreateProductDto): Observable<Order> {
    const getUrl = `${this.rootURL + this.endpointUrl}/ProductTypeTopBottom`;
    return this.http.post<Order>(getUrl, createProductdto );
  }
   createOrderTableCellFromOrderEntity(order: Order): OrderforTableCell {
    let orderTableCell: OrderforTableCell;


      if(order) {
        const dateString = new Date(order.date).toLocaleDateString();
        let orderName: string;
        if(order.product){
          orderName=getSelectedLanguageFromNamesInAllLanguages(order.product.productType.vocabulary.localizedNames, this.authenticatoinService.selectedLanguageCode)+' '+order.orderName;
        }
        else {
          orderName=order.orderName;
        }
        orderTableCell = {
          businessPartnerCode: order.businessPartner.code,
          businessPartnerFulname: order.businessPartner.fulName,
          businessPartnerEmail: order.businessPartner.email,
          date: new Date(order.date),
          dateString,
          id: order.id,
          index: order.index,

          orderName: orderName,
          orderNumber: order.orderName,
          orderTotalNumber: order.orderTotalNumber,
          orderVersionNumber: order.orderVersionNumber,
          orderVersionRegisterId: null,
          businessPartnerCompanyName: order.businessPartner.businesPartnerCompanyName,
          commentToOrderString: order.commentToOrder,
        };
      }
      return orderTableCell;



  }




  setCreateOrderDtoBasingOnSessionStorage():void{
    const createOrderDtoFromSessionStorage = JSON.parse(sessionStorage.getItem('createOrderDto'));

    if(createOrderDtoFromSessionStorage){
      this.createOrderDtoForConfirmUpdateShowDrawing = createOrderDtoFromSessionStorage;
    }
    const confirmButtonFromSessionStorage= JSON.parse((sessionStorage.getItem('confirmButtonClicked')));
    if(confirmButtonFromSessionStorage) {
      this.confirmButtonClickedInChangeDrawingMode = confirmButtonFromSessionStorage;
    }
  }


  findSapOrderById(id: string): Observable<HttpResponse<OrderToExport>>{
    const getUrl = `${this.rootURL + this.sapEndpointUrl}/${id}`;
    return this.http.get<OrderToExport>(getUrl, {observe: 'response'} );
  }
  findallSapOrders(): Observable<HttpResponse<OrderToExport[]>>{
    const getUrl = `${this.rootURL + this.sapEndpointUrl}`;
    return this.http.get<OrderToExport[]>(getUrl, {observe: 'response'} );
  }
  addOneSapOrder(sapOrderDto:OrderExportDto): Observable<HttpResponse<any>>{
    const getUrl = `${this.rootURL + this.sapEndpointUrl}`;
    return this.http.post<any>(getUrl,sapOrderDto, {observe: 'response'} );
  }


}
