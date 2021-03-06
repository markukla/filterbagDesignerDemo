import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import ProductBottom from '../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../Products/ProductTypesAndClasses/productTop.entity';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import DimensionRoleEnum from '../../DimensionCodes/DimensionCodesTypesAnClasses/dimensionRoleEnum';
import CreateDimensionCodeDto from '../../DimensionCodes/DimensionCodesTypesAnClasses/createDimensionCode.dto';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import {DimensionCodeBackendService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ValidateDiemensionCodeService} from '../../DimensionCodes/DimensionCodeServices/validate-diemension-code.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageDto} from '../LanguageTypesAndClasses/languageDto';
import {LanguageBackendService} from '../languageServices/language-backend.service';
import {ValidateLanguageService} from '../languageServices/validate-language.service';
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import Language from '../LanguageTypesAndClasses/languageEntity';
import OrderOperationMode from '../../Orders/OrdersTypesAndClasses/orderOperationMode';
import {getBackendErrrorMesage} from '../../helpers/errorHandlingFucntion/handleBackendError';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";
import {
  generalNamesInSelectedLanguage, generalUserNames,
  languageNames, orderNames
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {navigateToUrlAfterTimout} from "../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";
import ProductModeEnum from "../../Products/ProductTypesAndClasses/productMode";

@Component({
  selector: 'app-create-or-update-language',
  templateUrl: './create-or-update-language.component.html',
  styleUrls: ['./create-or-update-language.component.css']
})
export class CreateOrUpdateLanguageComponent implements OnInit {

  operationMessage: string;
  showoperationStatusMessage: string;
  allBotomsToselect: ProductBottom[];
  allTopsToSelect: ProductTop[];
  languageForm: FormGroup;
  createLanguageDto: LanguageDto;
  languageToUpdateId: string;
  languageToUpdate: Language;
  languageOperationMode: string;
  uploadSuccessStatus = false;
  flagDrawing: string;
  uploadOperationMessage: string;
  upladDrawingForm: FormGroup;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  languageNamesInSelectedLanguage = languageNames;
  orderNames= orderNames;
  userNames = generalUserNames;
  changeDrawingClicked= false;

  constructor(
    private backendService: LanguageBackendService,
    public validationService: ValidateLanguageService,
    private searchService: SearchService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe(queryParams => {
      this.languageOperationMode = queryParams.get('mode');
      this.languageToUpdateId = queryParams.get('languageId');
    });
    this.languageForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      languageCode: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      languageName: new FormControl('', [Validators.nullValidator && Validators.required]),
      active: new FormControl(false, [])

    }, {updateOn: 'change'});
    this.upladDrawingForm = new FormGroup({
      file: new FormControl('', Validators.required),
      fileSource: new FormControl('', [Validators.required])
    });
    this.initColumnNamesInSelectedLanguage();
    await this.initFormValuesForUpdateMode();
  }
  initColumnNamesInSelectedLanguage(): void {
    this.userNames = this.authenticationService.generalUserNames;
    this.orderNames= this.authenticationService.orderNamesInSelectedLanguage;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.languageNamesInSelectedLanguage = this.authenticationService.languageNamesInselectedLanguage;

  }
  // tslint:disable-next-line:typedef
  get file() {
    return this.upladDrawingForm.get('file');
  }

// tslint:disable-next-line:typedef
  get lamguageCode() {
    return this.languageForm.get('languageCode');
  }

  // tslint:disable-next-line:typedef
  get languageName() {
    return this.languageForm.get('languageName');
  }

  // tslint:disable-next-line:typedef
  get active() {
    return this.languageForm.get('active');
  }

  async initFormValuesForUpdateMode(): Promise<void> {
    if (this.languageOperationMode === 'update') {
      const foundRecord = await this.backendService.findRecordById(this.languageToUpdateId).toPromise();
      this.languageToUpdate = foundRecord.body;
      this.active.setValue(this.languageToUpdate.active);
      this.languageName.setValue(this.languageToUpdate.languageName);
      this.lamguageCode.setValue(this.languageToUpdate.languageCode);
    }
  }

  onUpload(): void {
    this.uploadSuccessStatus = false;
    const formData = new FormData();
    formData.append('file', this.upladDrawingForm.get('fileSource').value);
    this.backendService.uploadDrawing(formData).subscribe((urls) => {
      this.flagDrawing = urls.urlOfOrginalDrawing;
      this.uploadOperationMessage = this.generalNamesInSelectedLanguage.drawingAddedSuccessStatus;
      this.uploadSuccessStatus = true;
    }, error => {
      this.uploadSuccessStatus = false;
      const errorMessage = getBackendErrrorMesage(error);
      if (errorMessage.includes('.png files are allowed')) {
        this.uploadOperationMessage = generalNamesInSelectedLanguage.drawingAddedFailerStatus + ''+ generalNamesInSelectedLanguage.onlyPngFormatIsAllowed;
      } else {
        this.uploadOperationMessage = this.generalNamesInSelectedLanguage.drawingAddedFailerStatus
      }
    });

  }
  onFileChange(event): void {
    if (event.target.files.length > 0) {
      this.uploadOperationMessage = null;
      const file = event.target.files[0];
      this.upladDrawingForm.patchValue({
        fileSource: file
      });
    }
  }

  // tslint:disable-next-line:typedef
  onSubmit(): void {
    this.createLanguageDto = {
      languageCode: this.lamguageCode.value,
      languageName: this.languageName.value,
      active: this.active.value,
      flagUrl: this.flagDrawing
    };
    if (this.languageOperationMode === 'createNew') {
      this.backendService.addRecords(this.createLanguageDto).subscribe((language) => {
        this.authenticationService.languages.push(language.body);
        this.showoperationStatusMessage = this.generalNamesInSelectedLanguage.operationAddSuccessStatusMessage;
        navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
      }, error => {
        this.showoperationStatusMessage = this.generalNamesInSelectedLanguage.operationAddFailerStatusMessage;

      });
    } else if (this.languageOperationMode === 'update') {
      this.backendService.updateRecordById(this.languageToUpdateId, this.createLanguageDto).subscribe((language) => {
        this.authenticationService.languages.forEach((languageInservice, index, self)=>{
          if(languageInservice.id=== language.body.id ){
            self[index] = language.body;
          }
        });
        this.showoperationStatusMessage = this.generalNamesInSelectedLanguage.operationUpdateSuccessStatusMessage;
        navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
      }, error => {
        this.showoperationStatusMessage = this.generalNamesInSelectedLanguage.operationUpdateFailerStatusMessage;

      });
    }
  }

  closeAndGoBack(): void {
    this.router.navigateByUrl('/languages');
  }

  cleanOperationMessage(): void {
    this.languageForm.reset();
    setTimeout(() => {
      this.showoperationStatusMessage = null;
    }, 2000);
  }
  showChangeDrawingButton(): boolean {
    if (this.languageOperationMode === 'update' && !this.file.value) {
      return true;
    } else {
      return false;
    }
  }

  onDrawingCHangeForUpdate(): void {
    this.changeDrawingClicked = true;
  }
  createNewOrChangeDrawingClicked(): boolean {
    if (this.languageOperationMode === 'createNew' || this.changeDrawingClicked) {
      return true;
    } else {
      return false;
    }
  }
  allowSubmit(): boolean {
    if (this.languageOperationMode === 'createNew') {
      if (this.languageForm.valid && this.uploadSuccessStatus === true) {
        return true;
      } else {
        return false;
      }
    } else if (this.languageOperationMode === 'update' && this.changeDrawingClicked === false) {
      if (this.languageForm.valid) {
        return true;
      } else {
        return false;
      }
    } else if (this.languageOperationMode === 'update' && this.changeDrawingClicked === true) {
      if (this.languageForm.valid && this.uploadSuccessStatus === true) {
        return true;
      } else {
        return false;
      }
    }
  }


}
