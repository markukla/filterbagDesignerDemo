import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTopBackendService} from '../ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../ProductTopServices/validate-product-top.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import LocalizedName from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import Language from '../../../Languages/LanguageTypesAndClasses/languageEntity';
import {LanguageBackendService} from '../../../Languages/languageServices/language-backend.service';
import {BackendMessageService} from '../../../helpers/ErrorHandling/backend-message.service';
import {LanguageFormService} from '../../../LanguageForm/language-form.service';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import OperationModeEnum from '../../../util/OperationModeEnum';
import CreateProductTopDto from '../../ProductTypesAndClasses/createProductTop.dto';
import {
  generalNamesInSelectedLanguage,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import ProductType from "../../ProductTypesAndClasses/productType.entity";
import {ProductTypeBackendService} from "../../ProductType/ProductTypeServices/product-type-backend.service";
import {navigateToUrlAfterTimout} from "../../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";
import CreateProductTypeDto from "../../ProductTypesAndClasses/createProductType.dto";

@Component({
  selector: 'app-create-product-top',
  templateUrl: './create-product-top.component.html',
  styleUrls: ['./create-product-top.component.css']
})
export class CreateProductTopComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  form: FormGroup;
  createProductTopDto: CreateProductTopDto;
  localizedNames: LocalizedName[] = [];
  recordToUpdate: ProductBottom;
  selectedRecordToupdateId: string;
  operatiomMode: string;
  closeButtonDescription: string;
  addNewProductBottomDescription: string;
  productTopCodeDescription: string;
  thisFiledIsRequiredDescription: string;
  codeCanNotBeShortedThan3CharactersDescription: string;
  codeCanNotBeLongerThan3CharactersDescription: string;
  giveNameForAllLanguagesDescription: string;
  saveButtonDescription: string;
  languages: Language[];
  orderNamesInSelectedLanguage = orderNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  formTitleAddOrUpdate: string;
  productTypeId: string;
  selectedProductType: ProductType;
  constructor(
    private backendService: ProductTopBackendService,
    public validationService: ValidateProductTopService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private languageBackendService: LanguageBackendService,
    private router: Router,
    private backendMessageService: BackendMessageService,
    private languageFormService: LanguageFormService,
    private authenticationService: AuthenticationService,
    private productTypeBackendService: ProductTypeBackendService) {
    console.log('creating component:CreateProductTypeComponent');
  }
  async ngOnInit(): Promise<void> {
    this.initColumnNamesInSelectedLanguage();
    this.route.queryParamMap.subscribe((queryParams) => {
      this.operatiomMode = (queryParams.get('mode'));
      this.selectedRecordToupdateId = queryParams.get('recordId');
      this.productTypeId = queryParams.get('productTypeId');
    });
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.maxLength(2), Validators.minLength(2)]),

    }, {updateOn: 'change'});
    await this.getInitDataFromBackend();
  }
  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNamesInSelectedLanguage = this.authenticationService.orderNamesInSelectedLanguage;
  }
  async getInitDataFromBackend(): Promise<void> {
    this.languages = this.authenticationService.languages;
    this.languageFormService.languages = this.languages;
    if (this.operatiomMode === OperationModeEnum.UPDATE) {
      const foundRecord =  await this.backendService.findRecordById(this.selectedRecordToupdateId).toPromise();
      this.recordToUpdate = foundRecord.body;
      this.languageFormService.namesInAllLanguages = this.recordToUpdate.vocabulary.localizedNames;
      this.formTitleAddOrUpdate = this.orderNamesInSelectedLanguage.updateProductTop;
      this.code.setValue(this.recordToUpdate.code);
    }
    else {
      this.formTitleAddOrUpdate = this.orderNamesInSelectedLanguage.addNewProductTop;
    }
  }

  onSubmit(): void {
    const localizedNames: LocalizedName[] = [];
    this.languageFormService.languageNames.forEach((languageInput) => {
      const localizedDimensionName: LocalizedName = {
        language: {id: languageInput.nativeElement.id},
        nameInThisLanguage: languageInput.nativeElement.value
      };
      localizedNames.push(localizedDimensionName);
    });
    this.createProductTopDto = {
      localizedNames,
      code: this.code.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createProductTopDto).subscribe((productTop) => {
        if(this.productTypeId) {
          this.productTypeBackendService.findRecordById(this.productTypeId).subscribe((productType)=> {
            this.selectedProductType = productType.body;
            this.selectedProductType.tops.push(productTop.body);
            const productTypeDto:CreateProductTypeDto = {
              ...this.selectedProductType,
              localizedNames: this.selectedProductType.vocabulary.localizedNames
            }
            this.productTypeBackendService.updateRecordById(this.productTypeId, productTypeDto).subscribe((updatedProductType)=>{
              console.log('ProductBottom added To selected ProductTYpe bottoms list');
            },error => {
              console.log('error during adding ProductBottom  to selected ProductTYpe bottoms list');
            });

          });
        }

        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForCreateNew();
        navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForCreateNew(error);

      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createProductTopDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForUpdate();
        navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);

      });
    }
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }

  cleanOperationMessage(): void {
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }
}
