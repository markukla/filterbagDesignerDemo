import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges, ViewChild,
  ViewChildren
} from '@angular/core';
import {ProductTopBackendService} from '../../ProductTop/ProductTopServices/product-top-backend.service';
import {ValidateProductTopService} from '../../ProductTop/ProductTopServices/validate-product-top.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTypeBackendService} from '../ProductTypeServices/product-type-backend.service';
import {ValidateProductTypeService} from '../ProductTypeServices/validate-product-type.service';
import ProductBottom from '../../ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../ProductTypesAndClasses/productTop.entity';
import {ProductBottomBackendService} from '../../ProductBottom/ProductBottomServices/product-bottom-backend.service';
import {ProductBottomTableService} from '../../ProductBottom/ProductBottomServices/product-bottom-table.service';
import {ProductTopTableService} from '../../ProductTop/ProductTopServices/product-top-table.service';
import OperationModeEnum from '../../../util/OperationModeEnum';
import LocalizedName from '../../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import CreateProductTopDto from '../../ProductTypesAndClasses/createProductTop.dto';
import Language from '../../../Languages/LanguageTypesAndClasses/languageEntity';
import CreateProductTypeDto from '../../ProductTypesAndClasses/createProductType.dto';
import ProductType from '../../ProductTypesAndClasses/productType.entity';
import {AuthenticationService} from '../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {LanguageFormService} from '../../../LanguageForm/language-form.service';
import {BackendMessageService} from '../../../helpers/ErrorHandling/backend-message.service';
import {
  getSelectedLanguageFromNamesInAllLanguages,
  setTabelColumnAndOtherNamesForSelectedLanguage
} from '../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {
  generalNamesInSelectedLanguage,
  orderNames
} from "../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";

@Component({
  selector: 'app-create-product-type',
  templateUrl: './create-product-type.component.html',
  styleUrls: ['./create-product-type.component.css']
})
export class CreateProductTypeComponent implements OnInit, AfterContentChecked {
  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  selectedTopsId: any[] = [];
  selectedBottomsId: any[] = [];
  form: FormGroup;
  createProductTypeDto: CreateProductTypeDto;
  localizedNames: LocalizedName[] = [];
  recordToUpdate: ProductType;
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
  formTitileCreateOrUpdate: string;
  checkAllTops = true;
  checkAllBottoms = true;
  @ViewChildren('bottomCheckbox', {read: ElementRef}) bottomCheckBox: ElementRef[];
  @ViewChildren('topsCheckbox', {read: ElementRef}) topscheckBox: ElementRef[];  //checkOrUncheckBottomsButton
  @ViewChild('checkOrUncheckBottomsButton', {read: ElementRef}) checkAllBottomsButton: ElementRef;
  @ViewChild('checkOrUncheckTopsButton', {read: ElementRef}) checkAllTopsButton: ElementRef;
  checkOrUncheckAllTopsButtonDescription: string;
  checkOrUncheckAllBottomsButtonDescription: string;

  constructor(
    private backendService: ProductTypeBackendService,
    public validationService: ValidateProductTypeService,
    private backendMessageService: BackendMessageService,
    private authenticationService: AuthenticationService,
    private languageFormService: LanguageFormService,
    private topsBackendService: ProductTopBackendService,
    private bottomsBackendService: ProductBottomBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    console.log('creating component:CreateProductTypeComponent');
    this.getDataToDropdownLists();
  }

  async ngOnInit(): Promise<void> {
    this.initColumnNamesInSelectedLanguage();
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    }, {updateOn: 'change'});
    this.route.queryParamMap.subscribe((queryParams) => {
      this.operatiomMode = (queryParams.get('mode'));
      this.selectedRecordToupdateId = queryParams.get('recordId');
    });
    await this.getInitDataFromBackend();

  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNamesInSelectedLanguage = this.authenticationService.orderNamesInSelectedLanguage;
  }
// tslint:disable-next-line:typedef
  getDataToDropdownLists(): void {
    this.topsBackendService.getRecords().subscribe((records) => {
      this.allTopsToSelect = records.body;
    }, error => {
      console.log('error during requesting productTops');
    });
    this.bottomsBackendService.getRecords().subscribe((records) => {
      this.allBotomsToselect = records.body;
    }, error => {
      console.log('error during requesting productBottoms');
    });
  }


  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }
  async getInitDataFromBackend(): Promise<void> {
    this.languages = this.authenticationService.languages;
    this.languageFormService.languages = this.languages;
    if (this.operatiomMode === OperationModeEnum.UPDATE) {
      const foundRecord =  await this.backendService.findRecordById(this.selectedRecordToupdateId).toPromise();
      this.recordToUpdate = foundRecord.body;
      this.languageFormService.namesInAllLanguages = this.recordToUpdate.localizedNames;
      this.code.setValue(this.recordToUpdate.code);
      this.formTitileCreateOrUpdate = this.orderNamesInSelectedLanguage.updateProductType;
    }
    else {
      this.formTitileCreateOrUpdate = this.orderNamesInSelectedLanguage.addNewProductType;
    }
  }

  onSubmit(): void {
    const localizedNames: LocalizedName[] = [];
    this.languageFormService.languageNames.forEach((languageInput) => {
      const localizedDimensionName: LocalizedName = {
        languageCode: languageInput.nativeElement.id,
        nameInThisLanguage: languageInput.nativeElement.value
      };
      localizedNames.push(localizedDimensionName);
    });
    this.topscheckBox.forEach((topCheckBox) => {
      if(topCheckBox.nativeElement.checked === true) {
        const selectedTopId = Number(topCheckBox.nativeElement.id.substring(8));
        const selectedTopObject = {id: selectedTopId};
        this.selectedTopsId.push(selectedTopObject );
      }

    });
    this.bottomCheckBox.forEach((bottomCheckbox) => {
      if (bottomCheckbox.nativeElement.checked === true){
      const selectedBottomId = Number(bottomCheckbox.nativeElement.id.substring(11));
      const selectedBottomObject = {id: selectedBottomId};
      this.selectedBottomsId.push(selectedBottomObject);
      }
    });
    this.createProductTypeDto = {
      localizedNames,
      bottomsForThisProductType: this.selectedBottomsId,
      topsForThisProductType: this.selectedTopsId,
      code: this.code.value,
    };
    if(this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createProductTypeDto).subscribe((record) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForCreateNew();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForCreateNew(error);
        this.cleanOperationMessage();
      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createProductTypeDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForUpdate();
        this.cleanOperationMessage();
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
        this.cleanOperationMessage();
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
  getNameInSelectedLanguage(localizedNames: LocalizedName[]): string {
    return getSelectedLanguageFromNamesInAllLanguages(localizedNames, this.authenticationService.selectedLanguageCode);
}

  setCheckedpropertyOfTopsCheckBoxForUpdateMode(checkBoxId: string): boolean {
    let checked: boolean = false;
    let checBoxWithSameIdLikeInDatabaseExists: boolean;
    if (this.recordToUpdate && this.recordToUpdate.topsForThisProductType) {
      this.recordToUpdate.topsForThisProductType.forEach((top) => {
        const idToCompareWithCheckboxId = `topInput${top.id}`;
        if (checkBoxId === idToCompareWithCheckboxId ) {
          checBoxWithSameIdLikeInDatabaseExists = true;
        }
      });
    }
    if (checBoxWithSameIdLikeInDatabaseExists === true) {
      checked = true;
    }
    else {
      checked = false;
    }
    return checked;
  }

  setCheckedpropertyOfBotttomCheckBoxForUpdateMode(checkBoxId: string): boolean {
    let checked: boolean = false;
    let checBoxWithSameIdLikeInDatabaseExists: boolean;
    if (this.recordToUpdate && this.recordToUpdate.bottomsForThisProductType) {
      this.recordToUpdate.bottomsForThisProductType.forEach((bottom) => {
        const idToCompareWithCheckboxId = `bottomInput${bottom.id}`;
        if (checkBoxId === idToCompareWithCheckboxId ) {
          checBoxWithSameIdLikeInDatabaseExists = true;
        }
      });
    }
    if (checBoxWithSameIdLikeInDatabaseExists === true) {
      checked = true;
    }
    else {
      checked = false;
    }
    return checked;
  }
  setCheckBoxInitPropertiesForUpdateMode(): void {
    if (this.topscheckBox && this.topscheckBox.length > 0) {
    this.topscheckBox.forEach((topCheckbox) => {
      if (this.setCheckedpropertyOfTopsCheckBoxForUpdateMode(topCheckbox.nativeElement.id) === true) {
        topCheckbox.nativeElement.checked = true;
      }
      else {
        topCheckbox.nativeElement.checked = false;
      }
    });
    }
    if (this.bottomCheckBox && this.bottomCheckBox.length > 0) {
      this.bottomCheckBox.forEach((bottomCheckBox) => {
        if (this.setCheckedpropertyOfBotttomCheckBoxForUpdateMode(bottomCheckBox.nativeElement.id) === true) {
          bottomCheckBox.nativeElement.checked = true;
        }
        else {
          bottomCheckBox.nativeElement.checked = false;
        }
      });
    }
  }

  checkOrUncheckAllTops():void {

    this.topscheckBox.forEach((top)=> {
      if(this.checkAllTops) {
        top.nativeElement.checked = true;
      }
      else {
        top.nativeElement.checked = false;
      }

    });

    if(this.checkAllTops ===true) {
      this.checkAllTops =false
    }
    else {
      this.checkAllTops = true;
    }

  }

  checkOrUncheckAllBottoms(): void {
    this.bottomCheckBox.forEach((bottom)=> {
      if(this.checkAllBottoms) {
        bottom.nativeElement.checked = true;
      }
      else {
        bottom.nativeElement.checked = false;
      }

    });

    if(this.checkAllBottoms ===true) {
      this.checkAllBottoms =false
    }
    else {
      this.checkAllBottoms = true;
    }


  }
  setCHeckOrUncheckAllButtonDescriptions(): void {
    if(this.topscheckBox && this.topscheckBox.length>0) {
      const allTopsChecked: boolean = this.topscheckBox.filter(top=>top.nativeElement.checked ===true).length ===this.topscheckBox.length;

      if(allTopsChecked === false){
        this.checkOrUncheckAllTopsButtonDescription = this.generalNamesInSelectedLanguage.checkAll;
        this.checkAllTops = true;
      }
      else {
        this.checkOrUncheckAllTopsButtonDescription = this.generalNamesInSelectedLanguage.uncheckAll;
        this.checkAllTops = false;
      }
    }
    if(this.bottomCheckBox && this.bottomCheckBox.length>0) {
      const allBottomsChecked: boolean = this.bottomCheckBox.filter(bottom=>bottom.nativeElement.checked ===true).length ===this.bottomCheckBox.length;
      if(allBottomsChecked === false){
        this.checkOrUncheckAllBottomsButtonDescription = this.generalNamesInSelectedLanguage.checkAll;
        this.checkAllBottoms =true;
      }
      else {
        this.checkOrUncheckAllBottomsButtonDescription = this.generalNamesInSelectedLanguage.uncheckAll;
        this.checkAllBottoms = false;
      }
    }

  }

  ngAfterContentChecked(): void {
    this.setCHeckOrUncheckAllButtonDescriptions();
  }
}
