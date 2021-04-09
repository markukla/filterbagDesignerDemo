import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChildren} from '@angular/core';
import ProductBottom from '../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../Products/ProductTypesAndClasses/productTop.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DimensionCodeBackendService} from '../DimensionCodeServices/dimension-code-backend.service';
import {ValidateDiemensionCodeService} from '../DimensionCodeServices/validate-diemension-code.service';
import DimensionRoleEnum from '../DimensionCodesTypesAnClasses/dimensionRoleEnum';
import CreateDimensionCodeDto from '../DimensionCodesTypesAnClasses/createDimensionCode.dto';
import LocalizedName from '../DimensionCodesTypesAnClasses/localizedName';
import DimensionCode from '../DimensionCodesTypesAnClasses/diemensionCode.entity';
import OperationModeEnum from '../../util/OperationModeEnum';
import {LanguageBackendService} from '../../Languages/languageServices/language-backend.service';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';
import {LanguageFormService} from '../../LanguageForm/language-form.service';
import BackendErrorResponse from '../../helpers/ErrorHandling/backendErrorResponse';
import {BackendMessageService} from '../../helpers/ErrorHandling/backend-message.service';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  dimensionNames,
  generalNamesInSelectedLanguage
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {navigateToUrlAfterTimout} from "../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";

@Component({
  selector: 'app-create-dimension-code',
  templateUrl: './create-dimension-code.component.html',
  styleUrls: ['./create-dimension-code.component.css']
})
export class CreateDimensionCodeComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  form: FormGroup;
  // tslint:disable-next-line:max-line-length
  allDimensionRolesToSelect: DimensionRoleEnum[] = [DimensionRoleEnum.FIRSTINDEXDIMENSION, DimensionRoleEnum.SECONDINDEXDIMENSION, DimensionRoleEnum.NOINDEXDIMENSION];
  firstIndexDimensionRole: string;
  secondIndexDimensionRole: string;
  noIndexDimensionRole: string;
  createDimensionCodeDto: CreateDimensionCodeDto;
  localizedNames: LocalizedName[] = [];
  createdDimensinoCode: DimensionCode;
  recordToUpdate: DimensionCode;
  operatiomMode: string;
  closeButtonDescription: string;
  addNewDimensionCodeDescription: string;
  dimensionCodeDescription: string;
  thisFiledIsRequiredDescription: string;
  codeCanNotBeShortedThan2CharactersDescription: string;
  codeCanNotBeLongerThan2CharactersDescription: string;
  SelectDimensionRoleDescription: string;
  giveNameForAllLanguagesDescription: string;
  saveButtonDescription: string;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  dimensionCodeNames = dimensionNames;

  @Output()
  createdDimensionEmiter: EventEmitter<DimensionCode>;
  selectedRecordToupdateId: string;
  languages: Language[];

  constructor(
    private backendService: DimensionCodeBackendService,
    public validationService: ValidateDiemensionCodeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private languageBackendService: LanguageBackendService,
    private router: Router,
    private backendMessageService: BackendMessageService,
    private languageFormService: LanguageFormService,
    private authenticationService: AuthenticationService) {
    console.log('creating component:CreateProductTypeComponent');
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
  }

  async ngOnInit(): Promise<void> {
    Object.keys(this).forEach(e => console.log(`key= ${e}, value= ${this[e]} `));
    this.createdDimensionEmiter = new EventEmitter<DimensionCode>();
    this.route.queryParamMap.subscribe((queryParams) => {
      this.operatiomMode = (queryParams.get('mode'));
      this.selectedRecordToupdateId = queryParams.get('recordId');
    });
    this.form = new FormGroup({
      // tslint:disable-next-line:max-line-length
      role: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      code: new FormControl('', [Validators.nullValidator && Validators.required], [this.validationService.codeValidator()]),

    }, {updateOn: 'change'});
    this.initColumnNamesInSelectedLanguage();
    await this.getInitDataFromBackend();
  }

  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.dimensionCodeNames = this.authenticationService.dimensionNamesInSelectedLanguage;
    this.firstIndexDimensionRole = dimensionNames.dimensionRoleFirstIndex;
    this.secondIndexDimensionRole = dimensionNames.dimensionRoleSecondIndex;
    this.noIndexDimensionRole = dimensionNames.dimensionRoleNoIndex;
  }

  // tslint:disable-next-line:typedef
  get role() {
    return this.form.get('role');
  }

  // tslint:disable-next-line:typedef
  get code() {
    return this.form.get('code');
  }

  async getInitDataFromBackend(): Promise<void> {
    this.languages = this.authenticationService.languages;
    this.languageFormService.languages = this.languages;
    if (this.operatiomMode === OperationModeEnum.UPDATE) {
      const foundRecord = await this.backendService.findRecordById(this.selectedRecordToupdateId).toPromise();
      this.recordToUpdate = foundRecord.body;
      this.languageFormService.namesInAllLanguages = this.recordToUpdate.localizedDimensionNames;
      this.role.setValue(this.recordToUpdate.dimensionRole);
      this.code.setValue(this.recordToUpdate.dimensionCode);
    }
  }

  onSubmit(): void {
    const localizedDimensionNames: LocalizedName[] = [];
    this.languageFormService.languageNames.forEach((languageInput) => {
      const localizedDimensionName: LocalizedName = {
        language: {id: languageInput.nativeElement.id},
        nameInThisLanguage: languageInput.nativeElement.value
      };
      localizedDimensionNames.push(localizedDimensionName);
    });
    this.createDimensionCodeDto = {
      localizedDimensionNames,
      dimensionCode: this.code.value,
      dimensionRole: this.role.value,
    };
    if (this.operatiomMode === OperationModeEnum.CREATENEW) {
      this.backendService.addRecords(this.createDimensionCodeDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForCreateNew();
        this.createdDimensinoCode = material.body;
        this.createdDimensionEmiter.emit(this.createdDimensinoCode);
        navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForCreateNew(error);

      });
    } else if (this.operatiomMode === OperationModeEnum.UPDATE) {
      this.backendService.updateRecordById(this.selectedRecordToupdateId, this.createDimensionCodeDto).subscribe((material) => {
        this.showoperationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForCreateNew();
        this.createdDimensinoCode = material.body;
        this.createdDimensionEmiter.emit(this.createdDimensinoCode);
        navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
      }, error => {
        this.showoperationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForCreateNew(error);

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
