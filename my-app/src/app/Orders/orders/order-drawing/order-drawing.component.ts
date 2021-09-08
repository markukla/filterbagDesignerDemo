import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import DimensionTextFIeldInfo from '../../../Products/ProductTypesAndClasses/dimensionTextFIeldInfo';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {OrderBackendService} from '../OrderServices/order-backend.service';
import {OrderTableService} from '../OrderServices/order-table.service';
import {TableFormServiceService} from '../../../Products/ProductMainComponent/product/product-table-form/table-form-service.service';
import Dimension from '../../OrdersTypesAndClasses/dimension';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';

import OrderDetails from '../../OrdersTypesAndClasses/orderDetail';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';
import {ActivatedRoute, Router} from '@angular/router';
import {DimensionCodeBackendService} from '../../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ProductBackendService} from '../../../Products/ProductMainComponent/product/ProductServices/product-backend.service';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import LocalizedDimensionCode from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedDimensionCode';
import DimensionCode from '../../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import DimensionRoleEnum from '../../../DimensionCodes/DimensionCodesTypesAnClasses/dimensionRoleEnum';
import CreateProductDto from '../../../Products/ProductTypesAndClasses/product.dto';
import {API_URL} from '../../../Config/apiUrl';
import {ProductMiniatureService} from '../productMiniature/productMiniatureService/product-miniature.service';
import {
  dimensionNames,
  generalNamesInSelectedLanguage,
  generalUserNames,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {OperationStatusServiceService} from "../../../OperationStatusComponent/operation-status/operation-status-service.service";
import {BackendMessageService} from "../../../helpers/ErrorHandling/backend-message.service";
import {TabelAndDrawinglnformation} from "../../../Products/ProductTypesAndClasses/tabeAndDrawinglnformation";
import Order from "../../OrdersTypesAndClasses/orderEntity";

@Component({
  selector: 'app-order-drawing',
  templateUrl: './order-drawing.component.html',
  styleUrls: ['./order-drawing.component.css']
})
export class OrderDrawingComponent implements OnInit, AfterViewInit, AfterContentChecked, AfterViewChecked, OnChanges, OnDestroy {
  tableForm: FormGroup;
  bgImageVariable: string;
  LValue = '';
  DVaLe = '';
  rootUrl = API_URL;
  orderOperationMode: OrderOperationMode;
  createOrderDto: CreateOrderDto;
  createProductDto: CreateProductDto;
  selectedOrderId: string;
  selectedProductId: string;
  allowSubmit = true;
  submitNotAllowedMessage: string;
  firstIndexDimensions: string[] = [];
  secondIndexDimensions: string[] = [];
  /* below fields moved from create-product drawing component*/
  createDimensionsForm: FormGroup;
  dimensionRoleForm: FormGroup;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  drawingInputCreatedForUpdateMode = false;
  allDimensionCodes: LocalizedDimensionCode [];
  allFirstIndexDimensionCodes: LocalizedDimensionCode[];
  allSecondIndexDimensionCOde: LocalizedDimensionCode [];
  allNonIndexDimensionCodes: LocalizedDimensionCode [];/* it will be the value obtained form login service in the future*/
  addNewClicked = false;
  idValue: string;
  angle = -90;
  position = "";
  inputSelectedForRotation: string;
  newDimension: DimensionCode;
  newLocalizedDimension: LocalizedDimensionCode;
  // tslint:disable-next-line:max-line-length
  /* view child is a get elementby id equivalent, and Viev childrens is something like get element by class name, but element must be marked with #elementname*/
  dimensionRoleFirstIndexDimensionDescription: string;
  dimensionRoleFirstIndex: DimensionRoleEnum = DimensionRoleEnum.FIRSTINDEXDIMENSION;
  dimensionRoleSecondIndexDimensionDescription: string;
  dimensionRoleSecondIndex: DimensionRoleEnum = DimensionRoleEnum.SECONDINDEXDIMENSION;
  dimensionRoleNoIndexDimensionDescription: string;
  dimensionRoleNoIndex: DimensionRoleEnum = DimensionRoleEnum.NOINDEXDIMENSION;
  notEditableDimension: DimensionRoleEnum= DimensionRoleEnum.NOTEDITABLEDIMENSION;
  dragable = true;
  createDimensionClicked = false;
  userInputErrorMessages: string[] = [];
  showUserInputErrorWindow = false;
  orderNames = orderNames;
  generalUserNames = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  dimensionNames = dimensionNames;
  drawingRangeValue: number;
  dimensionsAlreadyCreated = false;
  @ViewChild('drawingContainer', {read: ElementRef}) drawing: ElementRef;
  @ViewChild('drawingImage', {read: ElementRef}) drawingImage: ElementRef;
  @ViewChildren('.inputDivHorizontal', {read: HTMLElement}) inputDivs: HTMLElement[];
  @ViewChild('mainContainer', {read: ElementRef}) mainContainer: ElementRef;
  @ViewChild('drawingAndTableContainer', {read: ElementRef}) drawingAndTableContainer: ElementRef; //drawingRangeInput
  @ViewChild('mainContainer', {read: ElementRef}) drawingRangeInput: ElementRef; //tabelFormContainer
  @ViewChild('tabelFormContainer', {read: ElementRef}) tabelFormContainer: ElementRef;
  @ViewChild('tableFormComponent', {read: ElementRef}) tableFormComponent: ElementRef; //tableFormComponent
  allNotDeletedFirstIndexDimensions: LocalizedDimensionCode[];
  allNotDeletedSecondIndexDimensions: LocalizedDimensionCode[];
  allNotDeletedNoIndexDimensions: LocalizedDimensionCode[];
  allNotEditableDimensionsCodes: LocalizedDimensionCode[];
  allNotDeletedNotEditableDimensions: LocalizedDimensionCode[];

  orderWithThisProductCode: Order;
  allDimensions: DimensionCode[];


  constructor(
    private orderBackendService: OrderBackendService,
    private productMiniatureService: ProductMiniatureService,
    private orderTableService: OrderTableService,
    private renderer: Renderer2,
    private productBackendService: ProductBackendService,
    private tableFormService: TableFormServiceService,
    private authenticationService: AuthenticationService,
    private dimensionBackendService: DimensionCodeBackendService,
    private router: Router,
    private route: ActivatedRoute,
    private host: ElementRef,
    private statusService: OperationStatusServiceService,
    private messageService: BackendMessageService,
  ) {
    this.tableForm = this.tableFormService.tableForm;


  }

  async ngOnInit(): Promise<void> {
    this.createDimensionsForm = new FormGroup({
      dimensionCodeControll: new FormControl(null, [Validators.required]),
    });
    this.dimensionRoleForm = new FormGroup({
      dimensionRole: new FormControl(null, [Validators.required]),
    });
    this.initColumnNamesInSelectedLanguage();
    await this.getPreviouslyUsedCodes();
    await this.setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters();


    // tslint:disable-next-line:max-line-length
  }

  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNames, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalUserNames, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.dimensionNames, this.authenticationService.vocabulariesInSelectedLanguage);
    this.dimensionRoleFirstIndexDimensionDescription = this.dimensionNames.dimensionRoleFirstIndex;
    this.dimensionRoleSecondIndexDimensionDescription = this.dimensionNames.dimensionRoleSecondIndex;
    this.dimensionRoleNoIndexDimensionDescription = this.dimensionNames.dimensionRoleNoIndex;


  }

  // tslint:disable-next-line:typedef
  get dimensionRole() {
    return this.dimensionRoleForm.get('dimensionRole');
  }

  // tslint:disable-next-line:typedef
  get dimensionCodeControll() {
    return this.createDimensionsForm.get('dimensionCodeControll');
  }

  async setOrderOperatiomModeAndSelectedOrderBasingOnQueryParamters(): Promise<void> {
    this.route.queryParamMap.subscribe(queryParams => {
      const mode = queryParams.get('mode');
      console.error(`mode= ${mode}`);
      this.selectedOrderId = queryParams.get('orderId');
      this.selectedProductId = queryParams.get('productId');
      if (mode === OrderOperationMode.CREATENEW) {
        this.orderOperationMode = OrderOperationMode.CREATENEW;
      } else if (mode === OrderOperationMode.UPDATE) {
        this.orderOperationMode = OrderOperationMode.UPDATE;
      } else if (mode === OrderOperationMode.SHOWDRAWING) {
        this.orderOperationMode = OrderOperationMode.SHOWDRAWING;
      } else if (mode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
        this.orderOperationMode = OrderOperationMode.UPDATEWITHCHANGEDPRODUCT;
      } else if (mode === OrderOperationMode.UPDATEDRAWING) {
        this.orderOperationMode = OrderOperationMode.UPDATEDRAWING;
      } else if (mode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
        this.orderOperationMode = OrderOperationMode.SHOWDRAWINGCONFIRM;
      } else if (mode === OrderOperationMode.CONFIRMUPDATE) {
        this.orderOperationMode = OrderOperationMode.CONFIRMUPDATE;
      } else if (mode === OrderOperationMode.SHOWPRODUCT) {
        this.orderOperationMode = OrderOperationMode.SHOWPRODUCT;
      } else if (mode === OrderOperationMode.UPDATEPRODUCT) {
        this.orderOperationMode = OrderOperationMode.UPDATEPRODUCT;
      } else if (mode === OrderOperationMode.CREATENEWPRODUCT) {
        this.orderOperationMode = OrderOperationMode.CREATENEWPRODUCT;
      }
    });
    await this.initPropertiValuesToServicesValues();
  }

  async initPropertiValuesToServicesValues(): Promise<void> {
    this.tableForm = this.tableFormService.tableForm;
    this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = false;
    sessionStorage.setItem('productChangedByDrawingClicling', JSON.stringify(this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes));
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
      const foundOrder = await this.orderBackendService.findRecordById(this.selectedOrderId).toPromise();
      this.createOrderDto = this.orderBackendService.getCreateOrderDtoFromOrder(foundOrder.body);
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.disableTableForm();

    } else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
      console.error(`in show drawing confirm method`);
      this.createOrderDto = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.disableTableForm();
    } else if (this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      const foundProductResponse = await this.productBackendService.findRecordById(this.selectedProductId).toPromise();
      const foundproduct: Product = foundProductResponse.body;

      this.createProductDto = {
        ...foundproduct,

      };
      this.bgImageVariable = this.rootUrl + this.createProductDto.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(null, this.createProductDto);
      this.tableFormService.disableTableForm();

      // tslint:disable-next-line:max-line-length
    } else if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT) {
      this.createProductDto = this.productBackendService.createProductDto;
      this.orderWithThisProductCode=  await this.orderBackendService.findOrdersWithProductTypeProductTopProductBottom(this.createProductDto).toPromise()
      this.bgImageVariable = this.rootUrl + this.createProductDto.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(null, this.createProductDto);
      this.tableFormService.disableTableForm();
    } else {
      console.error('in elese block');
      this.createOrderDto = this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing;
      this.bgImageVariable = this.rootUrl + this.createOrderDto.product.urlOfOrginalDrawing;
      this.tableFormService.setInitDataFromDrawingTableFromCreateOrderDto(this.createOrderDto);
      this.tableFormService.enableTableForm();
    }
  }


  getInputElementsFromVievAndCreateDimensionTable(): Dimension[] {
    // tslint:disable-next-line:max-line-length
    const inputs: HTMLElement [] = this.host.nativeElement.querySelectorAll('.dimensionInput'); /* does not work for 2 class at once selected  */
    const dimensionsForDatabase: Dimension[] = [];
    inputs.forEach((input) => {
      const dimension: Dimension = {
        dimensionvalue: String(input.innerHTML),
        dimensionId: input.id
      };
      dimensionsForDatabase.push(dimension);
    });
    return dimensionsForDatabase;
  }


  createDimensionInputsBasingOnProductData(): void {
    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
      this.createOrderDto.product.dimensionsTextFieldInfo.forEach((di) => {
        this.createDimensionInputOnDrawingBasingOnDimensionInfo(di, 'div');
      });
    } else if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      if (this.createProductDto && this.createProductDto.dimensionsTextFieldInfo) {
        this.createProductDto.dimensionsTextFieldInfo.forEach((di) => {
          this.createDimensionInputOnDrawingBasingOnDimensionInfo(di, 'div');
        });
      }
    }
  }

  createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData(): void {
    if (this.createOrderDto && this.createOrderDto.product) {
      if (this.createOrderDto.product.dimensionsTextFieldInfo) {
        const dimensionsInfo = this.createOrderDto.product.dimensionsTextFieldInfo;
        const dimensions: Dimension [] = this.createOrderDto.orderDetails.dimensions;
        const dimensionsSetInOrders: DimensionTextFIeldInfo [] =[];
        dimensionsInfo.forEach((dimensionInfo) => {
          //this.createDimensionInputOnDrawingBasingOnDimensionInfo(dimensionInfo, 'div')
         // dimensions.forEach((dimension) => {

            // this.createDimensionInputOnDrawingWithSetValueBasingOnDimensionInfoAndOrderData(dimensionInfo, dimension, 'div');
             // dimensionsSetInOrders.push(dimensionInfo);
            this.createDimensionInputOnDrawingBasingOnDimensionInfo(dimensionInfo, 'div');



         // });

        });
        this.setValuesOfInputsForModesWithOrderData (dimensions);
      }
    }
  }
  setValuesOfInputsForModesWithOrderData (dimensionsFromOrder: Dimension []) {
    const inputs: HTMLDivElement[] = this.host.nativeElement.querySelectorAll('.dimensionInput');
    inputs.forEach((input)=>
    dimensionsFromOrder.forEach(dOrder=>{
      if(input.id === dOrder.dimensionId){
        input.innerHTML = dOrder.dimensionvalue;
        if(input.innerHTML.length>0) {
          input.classList.add('inputDimensionWithoutPlaceholder');
        }
        if (this.secondIndexDimensions.includes(input.id)) {
          this.LValue = dOrder.dimensionvalue;
          console.log(`setting Lvalue to = ${this.LValue}`);
        }
        if (this.firstIndexDimensions.includes(input.id)) {
          this.DVaLe = dOrder.dimensionvalue;
        }

      }
    })
    )
  }
  // tslint:disable-next-line:max-line-length
  createDimensionInputOnDrawingWithSetValueBasingOnDimensionInfoAndOrderData(dimensionInfo: DimensionTextFIeldInfo, dimension: Dimension, inputTag: string): void {
    const input = this.renderer.createElement(inputTag);
    const inputContainer = this.renderer.createElement('div');
   if(dimensionInfo.dimensionId=== dimension.dimensionId){
     input.innerHTML = dimension.dimensionvalue;
   }

    this.setInputPositionAndSeizeBazingOnDatabaseData(dimensionInfo, input, inputContainer);
    this.renderer.appendChild(inputContainer, input);
    if (this.secondIndexDimensions.includes(input.id)) {
      this.LValue = dimension.dimensionvalue;
      console.log(`setting Lvalue to = ${this.LValue}`);
    }
    if (this.firstIndexDimensions.includes(input.id)) {
      this.DVaLe = dimension.dimensionvalue;
    }
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM) {
      this.renderer.setAttribute(input, 'readonly', 'true');
      console.error(`input readonly property = ${input.readonly}`);
    } else {
      console.error('in else block for readonly');
      this.renderer.setProperty(input, 'readonly', 'false');
      console.error(`input readonly property = ${input.readonly}`);
    }
    this.renderer.appendChild(this.drawing.nativeElement, inputContainer);
  }


  createDimensionInputOnDrawingBasingOnDimensionInfo(dimensionInfo: DimensionTextFIeldInfo, inputTag: string): void {
    const input = this.renderer.createElement(inputTag);
    const inputContainer = this.renderer.createElement('div');


    this.setInputPositionAndSeizeBazingOnDatabaseData(dimensionInfo, input, inputContainer);
    this.renderer.appendChild(inputContainer, input);
    /* const label = this.renderer.createElement('label');
    this.renderer.setProperty(label, 'for', input.id);
    label.value = input.id + ' ='; */

    if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT) {
      this.rotateTextField(input);
      this.makeInputDivDragable(inputContainer);
    }
    this.renderer.appendChild(this.drawing.nativeElement, inputContainer);
    // this.renderer.appendChild(this.drawing.nativeElement, label);
  }

  onSubmit(): void {
    this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
    sessionStorage.setItem('createOrderDto', JSON.stringify(this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing));
    const allowSubmit = this.checkIfAllFieldsValidInCreateOrderDto(this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing);
    // tslint:disable-next-line:max-line-length
    if (allowSubmit === true) {
      if (this.orderOperationMode === OrderOperationMode.CREATENEW && this.allowSubmit === true) {
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CONFIRMNEW}`);
      } else if (this.orderOperationMode === OrderOperationMode.UPDATE && this.allowSubmit === true) {
        this.productMiniatureService.productChangedByDrawingCliclingInUpdateOrConfirmModes = false;
        // tslint:disable-next-line:max-line-length
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
      } else if (this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT) {
        // tslint:disable-next-line:max-line-length
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
      } else if (this.orderTableService.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
        this.router.navigateByUrl(this.authenticationService._previousUrl);
      } else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM && this.selectedOrderId) {
        // tslint:disable-next-line:max-line-length
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
      } else if (this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM && !this.selectedOrderId) {
        this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CONFIRMNEW}`);
      } else if (this.orderOperationMode === OrderOperationMode.UPDATEDRAWING && this.selectedOrderId) {
        this.orderBackendService.confirmButtonClickedInChangeDrawingMode= true;
        sessionStorage.setItem('confirmButtonClickedJSON', JSON.stringify(this.orderBackendService.confirmButtonClickedInChangeDrawingMode));
        this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
        // tslint:disable-next-line:max-line-length
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?orderId=${this.selectedOrderId}&mode=${OrderOperationMode.CONFIRMUPDATE}`);
      } else if (this.orderOperationMode === OrderOperationMode.UPDATEDRAWING && !this.selectedOrderId) {
        this.orderBackendService.createOrderDtoForConfirmUpdateShowDrawing = this.createOrderDtoToSaveInDatabase();
        this.router.navigateByUrl(`orders/addOrUpdateOrConfirmOrder?mode=${OrderOperationMode.CONFIRMNEW}`);
      }
    } else {
    }

  }

  /* enableOrDisableDraggingInputsEvent(): void {
    if (this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT || this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT) {
      this.mainContainer.nativeElement.addEventListener('contextmenu', (ev) => {
        console.log('right clicked to disable or inable dimension rotation')

        ev.preventDefault();
        if (this.dragable === true) {
          this.dragable = false;
        } else if (this.dragable === false) {
          this.dragable = true;
        }
      });
    }
  }*/
  @HostListener('contextmenu', ['$event'])
  enableOrDisableDraggingInputs(event: any): void {
    if (this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT || this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT) {

      if (event.target.className.includes('dimensionInput') === false && event.target.className.includes('dimensionInputContainer') === false) {
        console.log('right clicked to disable or inable dimension rotation')

        event.preventDefault();
        if (this.dragable === true) {
          this.dragable = false;
        } else if (this.dragable === false) {
          this.dragable = true;
        }
      }
    }
  }


  ngAfterViewInit(): void {
    //this.enableOrDisableDraggingInputsEvent();
    /* in this method i create all drawing which does not require data from database but already have it stored in service*/
    // tslint:disable-next-line:max-line-length

  }

  ngAfterContentChecked(): void {


  }

  ngAfterViewChecked(): void {
    /* in this method i create drawing when obtaining data from database is required, because after viev init the data are not recived yet*/
    const allInputs = this.host.nativeElement.querySelectorAll('.dimensionInput');
    // if (this.drawing.nativeElement.getBoundingClientRect().width > 0.1 && this.drawing.nativeElement.getBoundingClientRect().height > 0.1) {


    // tslint:disable-next-line:max-line-length
    if (this.orderOperationMode && this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      console.error('in afterViev checked drawing modyfication');
      // tslint:disable-next-line:max-line-length
      if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING) {
        if (this.createOrderDto && this.tableFormService.allFirstIndexDimension && this.tableFormService.allSecondIndexDimnesions) {
          if (allInputs.length === 0) {
            this.createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData()
            this.setDrawingAndTabelParamtersBasingOnDatabaseData(this.createOrderDto);
          }
        }
      }
      // tslint:disable-next-line:max-line-length
      if (this.createProductDto && this.orderOperationMode === OrderOperationMode.SHOWPRODUCT && this.tableFormService.allFirstIndexDimension && this.tableFormService.allSecondIndexDimnesions) {
        if (this.createProductDto) {
          if (allInputs.length === 0) {
            this.setDrawingAndTabelParamtersBasingOnDatabaseData(null, this.createProductDto)
            this.createDimensionInputsBasingOnProductData();
          }
        }
      }
    }

    if (this.orderOperationMode && this.orderOperationMode !== OrderOperationMode.SHOWDRAWING && this.orderOperationMode !== OrderOperationMode.SHOWPRODUCT) {
      // tslint:disable-next-line:max-line-length
      if (allInputs.length === 0 && this.dimensionsAlreadyCreated === false) {
        if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT || this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT) {


          this.createDimensionInputsBasingOnProductData();
          this.dimensionsAlreadyCreated = true;
          if (this.createProductDto) {
            console.log(`before seting drawing and tabels parameters for products`);
            this.setDrawingAndTabelParamtersBasingOnDatabaseData(null, this.createProductDto);
          } else if (this.createOrderDto) {
            this.setDrawingAndTabelParamtersBasingOnDatabaseData(this.createOrderDto);
          }

        } else {

          this.createDimensionInputsForUpdateAndShowDrawingBasingOnProductDataAndOrderData();
          this.dimensionsAlreadyCreated = true;
          if (this.createProductDto) {
            this.setDrawingAndTabelParamtersBasingOnDatabaseData(null, this.createProductDto);
          } else if (this.createOrderDto) {
            this.setDrawingAndTabelParamtersBasingOnDatabaseData(this.createOrderDto);
          }
        }


      }
    }


    /*
*/
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  @HostListener('input', ['$event'])
  bindInputWithIndex(event: any): void {
    const inputId = event.target.id;
    if (event.target.className.includes('dimensionInput')) {

      if(event.target.innerHTML.length>0){
        event.target.classList.add('inputDimensionWithoutPlaceholder');
        event.target.classList.remove('drawingContainerPlaceHolders');
      }
      else {
        event.target.classList.remove('inputDimensionWithoutPlaceholder');
        event.target.classList.add('drawingContainerPlaceHolders');
      }


      const eventtargetinnerHTMLBeforeRemovingLetters: string = event.target.innerHTML;
      if (this.checkIfLettersInString(eventtargetinnerHTMLBeforeRemovingLetters)) {
        console.log('letters will be removed');
        // it makes cursor to go to beginning of line somehow when letter removed
        event.target.innerHTML = this.cleanLettersFromString(eventtargetinnerHTMLBeforeRemovingLetters);

      }


      if (this.orderOperationMode !== OrderOperationMode.UPDATEPRODUCT && this.orderOperationMode !== OrderOperationMode.CREATENEWPRODUCT) {
        const valueOfEventTargetId = this.allDimensionCodes.filter(d=> d.id===Number(event.target.id))[0].dimensionCode;

        if (this.secondIndexDimensions.includes(valueOfEventTargetId)) {
          const maxLength = 5;
          if (event.target.innerHTML.length > maxLength) {
            event.target.innerHTML = event.target.innerHTML.slice(0, maxLength);
          }


          this.tableFormService.Lvalue = String(event.target.innerHTML);
          this.tableFormService.buildIndex();
          this.tableFormService.setOrderName();
        }
        if (this.firstIndexDimensions.includes(valueOfEventTargetId)) {
          const maxLength = 3;
          if (event.target.innerHTML.length > maxLength) {
            event.target.innerHTML = event.target.innerHTML.slice(0, maxLength);
          }
          this.tableFormService.Dvalue = String(String(event.target.innerHTML));
          this.tableFormService.buildIndex();
          this.tableFormService.setOrderName();
        }
        if (!this.secondIndexDimensions.includes(valueOfEventTargetId) && !this.firstIndexDimensions.includes(valueOfEventTargetId)) {
          const maxLength = 3;
          if (event.target.innerHTML.length > maxLength) {
            event.target.innerHTML = event.target.innerHTML.slice(0, maxLength);
          }
        }
      }
    }

  }

  cleanLettersFromString(str: string): string {
    let cleanedString: string
    if (str.length > 1) {
      cleanedString = str.slice(0, str.length - 1);
    } else {
      cleanedString = '';
    }

    return cleanedString;
  }

  checkIfLettersInString(str: string): boolean {
    let letterInString: boolean = false;
    str.split('').forEach((letter) => {
      if (letter.match(/^[A-Za-z]+$/)) {
        console.log('string has letters')
        letterInString = true
      }
    });

    return letterInString;
  }

  createOrderDtoToSaveInDatabase(): CreateOrderDto {
    const dimensions = this.getInputElementsFromVievAndCreateDimensionTable();
    const orderDetails: OrderDetails = {
      antiEelectrostatic: this.tableFormService.antiEelectrostatic.value,
      workingSide: this.tableFormService.workingSide.value,
      workingTemperature: this.tableFormService.workingTemperature.value,
      dimensions
    };
    const orderDtoToSaveInDatabae: CreateOrderDto = {
      ...this.createOrderDto,
      orderName: this.tableFormService.setPartialOrderName(),
      index: this.tableFormService.index,
      orderDetails
    };

    return orderDtoToSaveInDatabae;
  }

  checkIfAllFieldsValidInCreateOrderDto(createOrderDto: CreateOrderDto): boolean {
    let allowSubmit = true;
    const dimensions: Dimension[] = createOrderDto.orderDetails.dimensions;
    const notAllDimensionValueEnteredMessage = this.orderNames.giveValuesToAllDimension;
   const dimensionValueNotEntered= this.orderNames.giveValuesToAllDimension;
   // let foundNotFilledDimensions = false;
    dimensions.forEach((dimension) => {
      if (!dimension.dimensionvalue) {
        allowSubmit = false;
       // foundNotFilledDimensions = true;
        const dimensionCode=this.allDimensionCodes.filter(d=> d.id===Number(dimension.dimensionId))[0].dimensionCode;
        this.userInputErrorMessages.push(dimensionValueNotEntered+dimensionCode);

      }
    });
    /*
    *if (foundNotFilledDimensions) {
      this.userInputErrorMessages.push(notAllDimensionValueEnteredMessage);
    } */
    if (!this.tableFormService.workingTemperature.value) {
      allowSubmit = false;
      const foultMessage = this.orderNames.giveValueOfWorkingTemperature;
      this.userInputErrorMessages.push(foultMessage);
    }
    if (!this.tableFormService.workingSide.value) {
      allowSubmit = false;
      const foultMessage = this.orderNames.setWorkignSide;
      this.userInputErrorMessages.push(foultMessage);
    }
    if (this.userInputErrorMessages.length > 0) {
      this.showUserInputErrorWindow = true;
    }
    return allowSubmit;

  }

  async getDrawingPdf(): Promise<void> {
    console.error(`this.router.url= ${this.router.url}`);
    console.error(`window.location.href= ${window.location.href}`);
    const urlForPuppeter = this.router.url + `&languageCode=${this.authenticationService.selectedLanguageCode}`;
    const pdfTodownLoad = await this.orderBackendService.getDrawingPdf(urlForPuppeter).toPromise();
    const newBlob = new Blob([pdfTodownLoad], {type: 'application/pdf'});

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    let pdfName: string;
    if(this.createOrderDto && this.createOrderDto.index){
      pdfName= this.createOrderDto.index;
    }
    else if(this.createProductDto){
      pdfName= this.createProductDto.productType.code+this.createProductDto.productTop.code+this.createProductDto.productBottom.code; // nedd to be change to product code when such update will be made
    }
    link.download = `${pdfName}.pdf`;
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  }

  checkIfShowDrawingMode(): boolean {
    if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWPRODUCT) {
      return true;
    } else {
      return false;
    }
  }

  /* below all methods moved from create-product-drawing*/


  onSubmitForInputCreating(): void {
    this.setIdValue()
    const container = this.renderer.createElement('div');
    container.classList.add('dimensionInputContainer', 'dimensionInputContainerBottom');

    const input = this.renderer.createElement('div');

   const inputIdValue = this.allDimensionCodes.filter(d=> d.id===Number(this.idValue))[0].dimensionCode;
    input.innerHTML = inputIdValue;
    input.contentEditable ='false';
    input.className = 'dimensionInput';


    //
    /* ';
    input.type="number";
    input.style.width="auto";*/



    //
    this.renderer.setProperty(input, 'id', this.idValue);
    /*this.renderer.setProperty(input, 'data-test', this.idValue);
    this.renderer.setProperty(input, 'id', this.idValue);*/
    console.log("Input" + input);
    // this.renderer.setProperty(input, 'type', 'number');
    console.log(`inputId= ${input.id}`);
    container.appendChild(input);
    container.style.left = 5 + `%`;
    container.style.top = 5 + '%';

    //this.renderer.setProperty(input, 'value', this.idValue);

/* input.onkeyup = (event) => {
      this.renderer.setProperty(input, 'innerHTML', inputIdValue);
    };*/

    /* const drawing = document.getElementById('drawingContainer'); */
    this.makeInputDivDragable(container);
    this.rotateTextField(input);
    this.renderer.appendChild(this.drawing.nativeElement, container);
    this.dragable = true;
    // this.position = 'bottom';
    this.createDimensionClicked = false;


  }


  makeInputDivDragable(input: HTMLElement): void {
    input.oncontextmenu = (event) => {

      event.preventDefault();
      this.drawing.nativeElement.removeChild(input);
    };
    input.ondblclick=(event)=>{
      event.preventDefault();
    };
    input.onmousedown = (event) => {
      /*
       console.log(`event.type= ${event.type}`);
      console.log(`textfield.style.transform= ${input.style.transform}`);
      console.log(`textfield.style.width= ${input.style.width}`);
      console.log(`textfield.style.height= ${input.style.height}`);
      const texfieldWith = document.getElementById(input.id).style.width;
      console.log(`texfieldWith= ${texfieldWith}`);
      * */


      if (this.dragable === true) {
        event.preventDefault();
        // event.clientX and event.clientY are mouse pointer coordinates
        //  textField.getBoundingClientRect().left distance from left corner to html.element
        const transform = input.style.transform;
        const inputWidth = input.getBoundingClientRect().width;
        const inputHeight = input.getBoundingClientRect().height;
        const widthMinusHeightDevidedBy2 = (inputWidth - inputHeight) / 2;
        let shiftX: number;
        let shiftY: number;
        /*  if (!transform || transform === '' || transform === 'rotate(0deg)') {
          shiftX = event.clientX - input.getBoundingClientRect().left;
          shiftY = event.clientY - input.getBoundingClientRect().top;
        } else if (transform && (transform === 'rotate(-90deg)' || transform === 'rotate(90deg)')) {
          shiftX = event.clientX - widthMinusHeightDevidedBy2 - input.getBoundingClientRect().left;
          shiftY = event.clientY + widthMinusHeightDevidedBy2 - input.getBoundingClientRect().top;
        }*/

        console.log(event.target);
        // console.log(event.target.parentNode.offsetLeft);
        // console.log(event.target.parentNode.offsetTop);

        shiftX = event.clientX - input.getBoundingClientRect().left;
        shiftY = event.clientY - input.getBoundingClientRect().top;


        this.renderer.appendChild(this.drawing.nativeElement, input);
        const moveAt = (pageX, pageY) => {
          /* const drawingCOntainerBoundaryX = this.drawing.nativeElement.getBoundingClientRect().left;
          const drawingContainerBoundaryY = this.drawing.nativeElement.getBoundingClientRect().top;
          input.style.left = pageX  - drawingCOntainerBoundaryX - shiftX + 'px';
          input.style.top = pageY  - drawingContainerBoundaryY - shiftY + 'px';*/


          const drawingCOntainerBoundaryX = this.drawing.nativeElement.getBoundingClientRect().left;
          const drawingContainerBoundaryY = this.drawing.nativeElement.getBoundingClientRect().top;
          input.style.left = ((pageX - shiftX - drawingCOntainerBoundaryX - window.scrollX) / this.drawing.nativeElement.getBoundingClientRect().width) * 100 + '%';
          input.style.top = ((pageY - shiftY - drawingContainerBoundaryY - window.scrollY) / this.drawing.nativeElement.getBoundingClientRect().height) * 100 + '%';
          if(input.style.left.charAt(0)==='-'){
            input.style.left= 2+'%';
          }
          if(input.style.top.charAt(0)==='-'){
            input.style.top= 2+'%';
          }
          if(Number(input.style.top.split('%')[0])>100){
            input.style.top= 98+'%';
          }
          if(Number(input.style.left.split('%')[0])>100){
            input.style.left= 98+'%';
          }


          /*
          input.style.left = pageX - shiftX + 'px';
          input.style.top = pageY - ;
          widght=60, height=20 widght-height= 40, widght-height/2 = 20 which is correction value
           textField.style.left = pageX - shiftX - 20  + 'px';
          textField.style.top = pageY - shiftY + 20 + 'px';*/
        };
        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        const onMouseMove = (event: any) => {
          moveAt(event.pageX, event.pageY);
        };

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the ball, remove unneeded handlers
        document.onmouseup = () => {
          document.removeEventListener('mousemove', onMouseMove);
          input.onmouseup = null;
        };
        input.ondragstart = () => {
          return false;
        };
      }

    };
  }

saveProductInDatabas(): void {
    const url = `/products`;

    const dimensionFieldInfoTable: DimensionTextFIeldInfo[] = this.getTextFieldsPositionsAndIdAndPushItToTable();
    const createProductDto: CreateProductDto = {
      ...this.createProductDto,
      dimensionsTextFieldInfo: dimensionFieldInfoTable,
      drawinAndTableInfo: this.getDrawingAndTabelInformationFromViev(),

    };
    if (this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT && this.validateCreateProductDtoBeforeSavingInDatab(createProductDto) === true) {
      this.productBackendService.addRecords(createProductDto).subscribe((product) => {
        const productFromBackend = product.body;
        console.log(productFromBackend.productTop.vocabulary.localizedNames.length);
        console.log('dodano nowy Product');
        this.statusService.operationSuccessStatusMessage = this.messageService.returnSuccessMessageToUserForSuccessBackendResponseForCreateNew();

        this.router.navigateByUrl('/products')
        // navigateToUrlAfterTimout(url, this.router, 2000);
      }, (error) => {
        console.log(error);
        this.statusService.operationFailerStatusMessage = this.messageService.returnErrorToUserBasingOnBackendErrorStringForCreateNew(error);
        console.log(`this.statusService.operationFailerStatusMessage = ${this.statusService.operationFailerStatusMessage}`);
        this.router.navigateByUrl('/products');
      });
      // tslint:disable-next-line:max-line-length
    } else if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT && this.validateCreateProductDtoBeforeSavingInDatab(createProductDto) === true) {
      if( this.validateCreateProductDtoForUpdateMode(createProductDto)=== true) {


        this.productBackendService.deleteRecordById(this.selectedProductId).subscribe((deleteSuccessResponse) => {

          this.productBackendService.addRecords(createProductDto).subscribe((product) => {
            const savedProduct = product.body;
            console.log('dodano nowy Product');
            this.statusService.operationSuccessStatusMessage = this.messageService.returnSuccessMessageToUserForSuccessBackendResponseForUpdate();
            this.router.navigateByUrl(url);
          }, (error) => {
            console.log(error);
            this.statusService.operationFailerStatusMessage = this.messageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
            this.router.navigateByUrl(url);
          })
        }, error => {
          this.statusService.operationFailerStatusMessage = this.messageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
          this.router.navigateByUrl(url);

        });
      }

    }
  }

  validateCreateProductDtoBeforeSavingInDatab(createProductDto: CreateProductDto): boolean {
    this.userInputErrorMessages=[];
    const inputs = createProductDto.dimensionsTextFieldInfo;
    let createProductDtoValid: boolean = true;
    if (inputs) {
      const collectionOfFirtstIndexDiMensionsInCreateProductDto: string[] = [];
      const collectionOfSecondtIndexDiMensionsInCreateProductDto: string [] = [];
      /* map is used to obtain array of simple values from objects, cause indeksOf does not work for objects*/
      inputs.map(x => x.dimensionId).forEach((inputId, index, self) => {
        const valueOfInputId = this.allDimensionCodes.filter(d=> d.id===Number(inputId))[0].dimensionCode;

        if(this.firstIndexDimensions.includes(valueOfInputId)){
          collectionOfFirtstIndexDiMensionsInCreateProductDto.push(valueOfInputId);
        }
        if(this.secondIndexDimensions.includes(valueOfInputId)){
          collectionOfSecondtIndexDiMensionsInCreateProductDto.push(valueOfInputId);
        }

        if (index !== self.indexOf(inputId)) {
          // tslint:disable-next-line:max-line-length
          /* if index of current element in array is not equal index od its first occurence in array (indexOf returns first occurence) so it is duplicated*/
          const failMassage = this.orderNames.allDimensionsMustBeUnique + ' ' + valueOfInputId;
          this.userInputErrorMessages.push(failMassage);
        }
      });
      if (collectionOfFirtstIndexDiMensionsInCreateProductDto.length === 0) {
        createProductDtoValid = false;
        const failMessage = this.orderNames.addFirstIndexDimension;
        this.userInputErrorMessages.push(failMessage);
      }
      if (collectionOfFirtstIndexDiMensionsInCreateProductDto.length > 1) {
        createProductDtoValid = false;
        const failMessage = this.orderNames.tooManyFirstIndexDimensions;
        this.userInputErrorMessages.push(failMessage);
      }
      if (collectionOfSecondtIndexDiMensionsInCreateProductDto.length === 0) {
        createProductDtoValid = false;
        const failMessage = this.orderNames.addSecondIndexDimension;
        this.userInputErrorMessages.push(failMessage);
      }
      if (collectionOfSecondtIndexDiMensionsInCreateProductDto.length > 1) {
        createProductDtoValid = false;
        const failMessage = this.orderNames.tooManySecondIndexDimensions
        this.userInputErrorMessages.push(failMessage);
      }
    }
    if (this.userInputErrorMessages.length > 0) {
      createProductDtoValid = false;
      this.showUserInputErrorWindow = true;
    }
    return createProductDtoValid;
  }

 validateCreateProductDtoForUpdateMode(createProductDto: CreateProductDto): boolean{
    let productDtoValid= true;
this.userInputErrorMessages= [];
    if(this.orderWithThisProductCode) {
      /*
            this.createProductDto.dimensionsTextFieldInfo.forEach(dimensionInfo=>{
        createProductDto.dimensionsTextFieldInfo.forEach(changedDimensionTextFiledInfo=>{

        })
      })

      * */
      const firstIndexDimensionInUpdatedProduct: DimensionTextFIeldInfo[] = this.createProductDto.dimensionsTextFieldInfo.filter(di=>this.firstIndexDimensions.includes(this.allDimensionCodes.filter(d=>String(d.id)===di.dimensionId)[0].dimensionCode));
   const secondIndexDimensionsInUpdatedProduct: DimensionTextFIeldInfo[] = this.createProductDto.dimensionsTextFieldInfo.filter(di=>this.secondIndexDimensions.includes(this.allDimensionCodes.filter(d=>String(d.id)===di.dimensionId)[0].dimensionCode));
   const firstIndexDimensionInCreateProductDto: DimensionTextFIeldInfo [] = createProductDto.dimensionsTextFieldInfo.filter(di=>this.firstIndexDimensions.includes(this.allDimensionCodes.filter(d=>String(d.id)===di.dimensionId)[0].dimensionCode));
   const secondIndexDimensionsInCreateProductDto: DimensionTextFIeldInfo [] =createProductDto.dimensionsTextFieldInfo.filter(di=>this.secondIndexDimensions.includes(this.allDimensionCodes.filter(d=>String(d.id)===di.dimensionId)[0].dimensionCode));
      // assumption that this tables length equlas 1
      if(firstIndexDimensionInCreateProductDto[0].dimensionId !== firstIndexDimensionInUpdatedProduct[0].dimensionId ) {

        const failMassage = this.generalNamesInSelectedLanguage.canNotChangeFirstIndexDimension + ' ' + this.generalNamesInSelectedLanguage.dimensionWillBeRemoved;
        this.userInputErrorMessages.push(failMassage);
        const id= firstIndexDimensionInCreateProductDto[0].dimensionId;
        const wrongFirstIndexDimenssionInput: HTMLElement= document.getElementById(id);
        this.drawing.nativeElement.removeChild(wrongFirstIndexDimenssionInput.parentNode);
        this.createDimensionInputOnDrawingBasingOnDimensionInfo(firstIndexDimensionInUpdatedProduct[0], 'div');

      }
      if(secondIndexDimensionsInCreateProductDto[0].dimensionId !== secondIndexDimensionsInUpdatedProduct[0].dimensionId ) {

        const failMassage = this.generalNamesInSelectedLanguage.canNotChangeSecondIndexDimension + ' ' + this.generalNamesInSelectedLanguage.dimensionWillBeRemoved;
        this.userInputErrorMessages.push(failMassage);
        const id= secondIndexDimensionsInCreateProductDto[0].dimensionId;
        const wrongSecondIndexDimenssionInput: HTMLElement= document.getElementById(id);
        this.drawing.nativeElement.removeChild(wrongSecondIndexDimenssionInput.parentNode);
        this.createDimensionInputOnDrawingBasingOnDimensionInfo(secondIndexDimensionsInUpdatedProduct[0], 'div');
      }
    }
   if (this.userInputErrorMessages.length > 0) {
     productDtoValid= false;
     this.showUserInputErrorWindow = true;
   }

 return productDtoValid;

}
  async getPreviouslyUsedCodes(): Promise<void> {
    try {

      const allDimensions = await this.dimensionBackendService.getRecords().toPromise();
      this.allDimensions= allDimensions.body;
      this.allDimensionCodes = this.getLocalizedNameFromAllLanguage(allDimensions.body);
      this.tableFormService.allIndexDimenssions = this.allDimensionCodes;

    } catch (error: any) {
      console.log('could not get all dimensions');
    }
    try {
      const allFirstIndexDimensions = await this.dimensionBackendService.getFirstIndexDimensions().toPromise();
      const allNotDeletedFirstIndexDimensions = allFirstIndexDimensions.body.filter(d=>d.softDeleteDate===null);
      this.allFirstIndexDimensionCodes = this.getLocalizedNameFromAllLanguage(allFirstIndexDimensions.body);
      this.allFirstIndexDimensionCodes.forEach((firstDimension) => {
        this.firstIndexDimensions.push(firstDimension.dimensionCode);
      });

      this.tableFormService.allFirstIndexDimension = this.firstIndexDimensions;
      this.allNotDeletedFirstIndexDimensions = this.getLocalizedNameFromAllLanguage(allNotDeletedFirstIndexDimensions);
    } catch (error: any) {
      console.log('could not get allFirstIndexDimensions');
    }
    try {
      const secondIndexDimensions = await this.dimensionBackendService.getSecondIndexDimensions().toPromise();
      const allNotDeletedSecondIndexDimensions = secondIndexDimensions.body.filter(d=>d.softDeleteDate===null);
      this.allSecondIndexDimensionCOde = this.getLocalizedNameFromAllLanguage(secondIndexDimensions.body);
      this.allSecondIndexDimensionCOde.forEach((secondDimension) => {
        this.secondIndexDimensions.push(secondDimension.dimensionCode);
      });
      this.tableFormService.allSecondIndexDimnesions = this.secondIndexDimensions;
      this.allNotDeletedSecondIndexDimensions = this.getLocalizedNameFromAllLanguage(allNotDeletedSecondIndexDimensions);
    } catch (error: any) {
      console.log('could not get secondIndexDimensions');
    }
    try {
      const noIndexDimensions = await this.dimensionBackendService.getNonIndexDimensions().toPromise();
      this.allNonIndexDimensionCodes = this.getLocalizedNameFromAllLanguage(noIndexDimensions.body);
      const allNotDeletedNoIndexDimensions= noIndexDimensions.body.filter(d=>d.softDeleteDate===null);
      this.allNotDeletedNoIndexDimensions = this.getLocalizedNameFromAllLanguage(allNotDeletedNoIndexDimensions);

    } catch (error: any) {
      console.log('could not get noIndexDimensions');
    }
    try {
      const allnotEditableDimensions= this.allDimensions.filter(dimension=> dimension.dimensionRole=== DimensionRoleEnum.NOTEDITABLEDIMENSION);
    this.allNotEditableDimensionsCodes= this.getLocalizedNameFromAllLanguage(allnotEditableDimensions);
    const allNotDeletedNotEditableDimensions = allnotEditableDimensions.filter(d=> d.softDeleteDate === null);
    this.allNotDeletedNotEditableDimensions= this.getLocalizedNameFromAllLanguage(allNotDeletedNotEditableDimensions);
    }
    catch (eror){
      console.log('could not get notEditableDimensions')
    }
  }

  setIdValue(): void {
    console.error(`this.createDimensionForm =${this.createDimensionsForm}`);
    if (this.dimensionCodeControll.value) {

      this.idValue = this.dimensionCodeControll.value;
    }
  }

  getLocalizedNameFromAllLanguage(dimensnionCodes: DimensionCode[]): LocalizedDimensionCode[] {
    const localizedDimensionCodes: LocalizedDimensionCode[] = [];
    dimensnionCodes.forEach((dimensionCOde) => {
      dimensionCOde.vocabulary.localizedNames.forEach((localizedName) => {
        if (localizedName.language.languageCode === this.authenticationService.selectedLanguageCode) {
          const localizedCode: LocalizedDimensionCode = {
            ...dimensionCOde,
            localizedDimensionName: localizedName
          };
          localizedDimensionCodes.push(localizedCode);
        }
      });
    });
    return localizedDimensionCodes;
  }



  createOrUpdateProductMode(): boolean {
    if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT) {
      return true;
    } else {
      return false;
    }
  }

  navigateBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }

  printDrawing(): void {
    window.print();
  }

  hideErrorMessagewindow(confirmButtonEvent: boolean): void {
    this.showUserInputErrorWindow = !confirmButtonEvent;
    this.userInputErrorMessages.length = 0;
  }

  getTextFieldsPositionsAndIdAndPushItToTable(): DimensionTextFIeldInfo[] {

    const dimensionsTextFieldInfoTable: DimensionTextFIeldInfo[] = [];
    // tslint:disable-next-line:max-line-length
    console.log(`width= ${this.drawing.nativeElement.style.width}`);
    const inputDivs: HTMLDivElement[] = this.host.nativeElement.querySelectorAll('.dimensionInputContainer');


    for (let i = 0; i < inputDivs.length; i++) {
      /* const inputDivRelativeToContainerXPosition = inputDivs[i].style.left/this.drawing */
      // tslint:disable-next-line:max-line-length
      const dimensionXAsInputStyleLeft: number = inputDivs[i].offsetLeft;
      const dimensionXRelativeShiftToDivWith = (dimensionXAsInputStyleLeft / this.drawing.nativeElement.offsetWidth) * 100;
      // tslint:disable-next-line:max-line-length
      const dimensionYAsInputStyleTop: number = inputDivs[i].offsetTop;
      const dimensionYRelativeShiftToDivHeight = (dimensionYAsInputStyleTop / this.drawing.nativeElement.offsetHeight) * 100;
      const dimensionInput: HTMLDivElement = (<HTMLDivElement>inputDivs[i].firstElementChild);
      let dimensionWidthInRelationToDrawingWidth: number;
      let dimensionHeightInRelationToDrawingHeight: number;
      if (dimensionInput.offsetWidth > 0 && this.drawing.nativeElement.offsetWidth > 0) {
        dimensionWidthInRelationToDrawingWidth = (dimensionInput.offsetWidth / window.innerWidth) * 100;
      }
      if (dimensionInput.offsetHeight > 0 && this.drawing.nativeElement.offsetWidth > 0) {
        dimensionHeightInRelationToDrawingHeight = (dimensionInput.offsetHeight / window.innerWidth) * 100;
      }

      console.log(`dimensionInputOfsetWidth= ${dimensionInput.offsetWidth}`);

      console.log(`dimensionInputOfsetHeight= ${dimensionInput.offsetHeight}`);
      console.log(`dimensionYRelativeShiftToDivHeight= ${dimensionYRelativeShiftToDivHeight}`);
      console.log(` dimensionYAsInputStyleTop ${dimensionYAsInputStyleTop}`);
      console.log(`this.drawing.nativeElement.offsetHeight= ${this.drawing.nativeElement.offsetHeight}`);


      const dimensionTextFIeldInfo: DimensionTextFIeldInfo = {
        dimensionId: dimensionInput.id, // id of input not container
        dimensionTexfieldXposition: String(dimensionXRelativeShiftToDivWith),  // position of input container not input
        dimensionTexfieldYposition: String(dimensionYRelativeShiftToDivHeight), //position of input container not input
        dimensionTexFieldHeight: String(dimensionHeightInRelationToDrawingHeight), //height input not container
        dimensionTexFieldWidth: String(dimensionWidthInRelationToDrawingWidth), // width of input not container
        dimensionInputClass: inputDivs[i].className, // class  of input container not input
        transform: ''
      };
      console.log(`dimensionInput id = ${dimensionInput.id}`);
      console.log(`dimensionInput width = ${dimensionInput.style.width}`);
      console.log(`dimensionInput height = ${dimensionInput.style.height}`)

      console.log(`classnameTest for input id= ${dimensionInput.id} = ${inputDivs[i].className}`);
      console.log(`ClaslistTest for input id = ${dimensionInput.id} = ${inputDivs[i].classList}`)
      dimensionsTextFieldInfoTable.push(dimensionTextFIeldInfo);
    }
    return dimensionsTextFieldInfoTable;
  }


  setInputPositionAndSeizeBazingOnDatabaseData(dimensionInfo: DimensionTextFIeldInfo, input: HTMLDivElement, inputContainer: HTMLDivElement): void {
    // tslint:disable-next-line:max-line-length
    if (dimensionInfo) {
      input.contentEditable = 'true';
      input.id = dimensionInfo.dimensionId;
      const inputIdValue = this.allDimensionCodes.filter(d=> d.id===Number(dimensionInfo.dimensionId))[0].dimensionCode;
      input.className = 'dimensionInput';

      inputContainer.className = dimensionInfo.dimensionInputClass;
      console.log(inputContainer.className);
      const dimensionXInRelationToDiv = dimensionInfo.dimensionTexfieldXposition;
      // tslint:disable-next-line:max-line-length
      const dimensionYInRelationToDiv = Number(dimensionInfo.dimensionTexfieldYposition);
      inputContainer.style.left = `${Number(dimensionXInRelationToDiv)}%`;
      inputContainer.style.top = `${Number(dimensionYInRelationToDiv)}%`;
      if (dimensionInfo.transform) {
        // input.style.transform = dimensionInfo.transform;
        const transformAsNumber = Number(dimensionInfo.transform);

      }
      if (dimensionInfo.dimensionTexFieldWidth && dimensionInfo.dimensionTexFieldWidth !== '' && Number(dimensionInfo.dimensionTexFieldWidth) !== 0) {
        input.style.minWidth = Number(dimensionInfo.dimensionTexFieldWidth) + 'vw';
      }
      if (dimensionInfo.dimensionTexFieldHeight && dimensionInfo.dimensionTexFieldHeight !== '' && Number(dimensionInfo.dimensionTexFieldHeight) !== 0) {
        input.style.minHeight = Number(dimensionInfo.dimensionTexFieldHeight) + 'vw';
      }

      const notEditableDimensionInput= this.allNotEditableDimensionsCodes.map(d=>String(d.id)).includes(input.id);
     if(notEditableDimensionInput){
       input.innerHTML= inputIdValue;
     }
      if (this.orderOperationMode === OrderOperationMode.SHOWDRAWING || this.orderOperationMode === OrderOperationMode.SHOWDRAWINGCONFIRM ||this.orderOperationMode === OrderOperationMode.SHOWPRODUCT || notEditableDimensionInput) {
        input.style.border = 'none';
        input.contentEditable ='false';
      }
      if (this.orderOperationMode === OrderOperationMode.CREATENEW || this.orderOperationMode === OrderOperationMode.UPDATEWITHCHANGEDPRODUCT || this.orderOperationMode === OrderOperationMode.UPDATE || this.orderOperationMode === OrderOperationMode.UPDATEDRAWING) {

        input.dataset.value = inputIdValue;
        this.drawing.nativeElement.classList.add('drawingContainerPlaceHolders');
        if(input.innerHTML.length>0){
          input.classList.add('inputDimensionWithoutPlaceholder');
        }


      }
      let diemsionIsNotEditable: boolean=  this.allNotEditableDimensionsCodes.map(d=>String(d.id)).includes(input.id);
      if(this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.SHOWPRODUCT || diemsionIsNotEditable){
      this.renderer.setProperty(input, 'innerHTML', inputIdValue);
      input.contentEditable='false';
      if(this.orderOperationMode === OrderOperationMode.SHOWPRODUCT || diemsionIsNotEditable){
        input.style.border = 'none';
      }
      }


    } else {
      console.error('can not set input position because no dimension info value');
    }
  }

  rotateTextField(textField): void {
    this.drawing.nativeElement.classList.add('drawingContainerEdit');
textField.onmousedown = (event)=>{
  // to prevent select event on dbClick
  event.preventDefault();
}
    textField.ondblclick = (event) => {
      event.preventDefault();
      if (this.dragable === false) {
        if (textField.parentNode.className.includes('Bottom')) {
          this.position = 'bottom';
        } else if (textField.parentNode.className.includes('Right')) {
          this.position = 'right'
        } else if (textField.parentNode.className.includes('Left')) {
          this.position = 'left'
        }
        const orginalWidth = ((textField.offsetWidth / window.innerWidth) * 100) + 'vw';
        console.log(`orinalWidth= ${orginalWidth}`);
        const orginalHeight = ((textField.offsetHeight / window.innerWidth) * 100) + 'vw';
        console.log(`orinalHeight= ${orginalHeight}`);


        console.log(this.angle);
        // textField.style.transform = `rotate(${this.angle}deg)`;
        console.log(`textField.getBoundingClientRect().left = ${textField.getBoundingClientRect().left}`);
        console.log(`tetField.style.left = ${textField.style.left}`);
        console.log(`textField.getBoundingClientRect().right = ${textField.getBoundingClientRect().right}`);
        console.log(`textField.getBoundingClientRect().top = ${textField.getBoundingClientRect().top}`);
        console.log(`tetField.style.top = ${textField.style.top}`);
        console.log(`textField.getBoundingClientRect().bottom = ${textField.getBoundingClientRect().bottom}`);
        console.log(`textField.getBoundingClientRect().width = ${textField.getBoundingClientRect().width}`);
        console.log(`textField.getBoundingClientRect().height = ${textField.getBoundingClientRect().height}`);

        /*
        if (this.position === 'top') {
          event.target.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
          event.target.parentNode.classList.add('dimensionInputContainerRight');
          this.position = 'right';
        * */
        console.log(`position before rotation= ${this.position}`);
        if (this.position === 'bottom') {
          textField.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
          textField.parentNode.classList.add('dimensionInputContainerRight');

          textField.style.width = this.makeWidthValueToBecomeHeightValueOrOposite(orginalHeight);
          textField.style.height = this.makeWidthValueToBecomeHeightValueOrOposite(orginalWidth);
          this.position = 'right';
        } else if (this.position === 'right') {
          textField.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
          textField.parentNode.classList.add('dimensionInputContainerLeft');
          this.position = 'left';
        } else {
          textField.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
          textField.parentNode.classList.add('dimensionInputContainerBottom');
          textField.style.width = this.makeWidthValueToBecomeHeightValueOrOposite(orginalHeight);
          textField.style.height = this.makeWidthValueToBecomeHeightValueOrOposite(orginalWidth);
          this.position = 'bottom';
        }

        /* if (this.position === 'bottom') {
         textField.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
         textField.parentNode.classList.add('dimensionInputContainerBottom');
         textField.style.width = this.makeWidthValueToBecomeHeightValueOrOposite(orginalHeight);
         textField.style.height = this.makeWidthValueToBecomeHeightValueOrOposite(orginalWidth);

         this.position = 'right';
       } else if (this.position === 'right') {
         textField.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
         textField.parentNode.classList.add('dimensionInputContainerRight');
         textField.style.width = this.makeWidthValueToBecomeHeightValueOrOposite(orginalHeight);
         textField.style.height = this.makeWidthValueToBecomeHeightValueOrOposite(orginalWidth);
         this.position = 'left';
       } else if (this.position === 'left') {
         textField.parentNode.classList.remove('dimensionInputContainerTop', 'dimensionInputContainerRight', 'dimensionInputContainerBottom', 'dimensionInputContainerLeft');
         textField.parentNode.classList.add('dimensionInputContainerLeft');
         this.position = 'bottom';
       }*/

        /*  it is always horizontal, because rotation means that horizontal dimension become also vertical*/
        // textField.style.resize = 'horizontal';
      }
    };
  }

  makeWidthValueToBecomeHeightValueOrOposite(valueToSetAfterRotation: string): string {
    return valueToSetAfterRotation;
  }

  getDrawingAndTabelInformationFromViev(): TabelAndDrawinglnformation {
    const drawingSizeProcent = this.drawingRangeValue;
    const tabelAndDrawingInfo: TabelAndDrawinglnformation = {
      drawingSizeProcent: drawingSizeProcent,
      tabelOrientationClass: this.tableFormComponent.nativeElement.firstChild.className,

    }
    return tabelAndDrawingInfo;


  }


  changeTabelOrientation() {
    this.tableFormComponent.nativeElement.firstChild.classList.toggle("drawingDetailTableHorizontal");
    console.log(`this.tabelFormContainer.className= ${this.tabelFormContainer.nativeElement.className}`);

  }

  setDrawingAndTabelParamtersBasingOnDatabaseData(createOrderDto?: CreateOrderDto, createProductDto?: CreateProductDto) {

    let tabelAndDrawingInfo: TabelAndDrawinglnformation;
    if (createOrderDto && createOrderDto.product.drawinAndTableInfo) {
      tabelAndDrawingInfo = createOrderDto.product.drawinAndTableInfo;
    } else if (createProductDto && createProductDto.drawinAndTableInfo) {


      tabelAndDrawingInfo = createProductDto.drawinAndTableInfo;
    }
    if (tabelAndDrawingInfo) {
      console.log(`tabelAndDrawingInfo.drawingSizeProcent+'vw= ${tabelAndDrawingInfo.drawingSizeProcent + 'vw'}`)
      this.drawing.nativeElement.style.width = tabelAndDrawingInfo.drawingSizeProcent + 'vw';
      this.drawingRangeInput.nativeElement.value = tabelAndDrawingInfo.drawingSizeProcent;
      console.log(`this.drawingRangeInput.nativeElement.value= ${this.drawingRangeInput.nativeElement.value}`);
      this.tableFormComponent.nativeElement.firstChild.className = tabelAndDrawingInfo.tabelOrientationClass;
    }

  }


  setDrawingPercentWidth() {
    if (this.orderOperationMode === OrderOperationMode.UPDATEPRODUCT || this.orderOperationMode === OrderOperationMode.CREATENEWPRODUCT) {
      if (this.drawing && this.drawingRangeValue) {
        //  this.drawing.nativeElement.style.width = ((this.drawingRangeValue/100*this.drawing.nativeElement.offsetWidth)/window.innerWidth)*100 +'vw';
        this.drawing.nativeElement.style.width = this.drawingRangeValue + 'vw';

      }

    }


  }


  ngOnDestroy(): void {
    //document.remmove
  }


}
