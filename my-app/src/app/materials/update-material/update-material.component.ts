import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Material} from '../MaterialsMainComponent/material';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {ValidateMaterialCodeUniqueService} from '../MaterialServices/validate-material-code-unique.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {
  generalNamesInSelectedLanguage,
  materialNamesInSelectedLanguage
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {BackendMessageService} from "../../helpers/ErrorHandling/backend-message.service";
import {navigateToUrlAfterTimout} from "../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";
import LocalizedName from "../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName";
import {LanguageFormService} from "../../LanguageForm/language-form.service";
import {MaterialDto} from "../MaterialsMainComponent/materialDto";

@Component({
  selector: 'app-update-material',
  templateUrl: './update-material.component.html',
  styleUrls: ['./update-material.component.css']
})
export class UpdateMaterialComponent implements OnInit {
  operationStatusMessage: string;
  materialToUpdate: Material;
  materialToUpdateId: number;
  materialForm: FormGroup;
  materialNamesInSelectedLanguage = materialNamesInSelectedLanguage;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  selectedMaterialId: string;

  constructor(private materialTableService: GeneralTableService,
              private backendMessageService: BackendMessageService,
              private materialBackendService: MaterialBackendService,
              public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private languageFormService: LanguageFormService) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {

      this.selectedMaterialId = queryParams.get('materialId');

    });
    this.languageFormService.languages = this.authenticationService.languages;
    this.materialForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      materialCode: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6),   Validators.maxLength(6)], [this.validateMaterialCodeUniqueService.materialCodeValidatorForUpdate(Number(this.selectedMaterialId))]),
      // tslint:disable-next-line:max-line-length
      materialName: new FormControl('', [Validators.nullValidator && Validators.required], [this.validateMaterialCodeUniqueService.materialNameValidatorForUpdate(Number(this.selectedMaterialId))]),
    }, {updateOn: 'change'});

    this.initColumnNamesInSelectedLanguage();
    this.materialToUpdateId = this.materialTableService.selectedId;
    console.log(`materialToUpdateId= ${this.materialToUpdateId}`);
    this.materialBackendService.findRecordById(String(this.selectedMaterialId)).subscribe((material) => {
        this.materialToUpdate = material.body;
        this.materialForm.controls.materialCode.setValue(this.materialToUpdate.materialCode);
        this.materialForm.controls.materialName.setValue(this.materialToUpdate.materialName);
        this.languageFormService.namesInAllLanguages = this.materialToUpdate.vocabulary.localizedNames;
      },
      error => {
        console.log(`This error occured: ${error.error}`);
      });
  }

  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.materialNamesInSelectedLanguage = this.authenticationService.materialNamesInSelectedLanguage;
  }
  // tslint:disable-next-line:typedef
  get materialCode() {
    return this.materialForm.get('materialCode');
  }

  // tslint:disable-next-line:typedef
  get materialName() {
    return this.materialForm.get('materialName');
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
    const material: MaterialDto = {
      localizedNames,
      materialCode: this.materialCode.value,
      materialName: this.materialName.value
    };
    /*
          Old verssion= classic updated
          this.materialBackendService.updateRecordById(this.selectedMaterialId, material).subscribe((material) => {
            this.operationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForUpdate();
          navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
          }, error => {
            this.operationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);

          }
        )
*/
this.materialBackendService.deleteRecordById(this.selectedMaterialId).subscribe(success=>{
  this.materialBackendService.addRecords(material).subscribe((addedMaterial=>{
    this.operationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForUpdate();
    navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
  }), error => {
    this.operationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
  })
}, error => {
  this.operationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
  console.log('could not remove old material')
});




  }
 resetMaterialFormValueAndOperationStatus(): void {
    setTimeout(() => {
      this.materialForm.reset();
      this.operationStatusMessage = '';
    }, 1500);
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }
}


