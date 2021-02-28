import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Material} from '../MaterialsMainComponent/material';
import {MaterialBackendService} from '../MaterialServices/material-backend.service';
import {MaterialTableService} from '../MaterialServices/material-table.service';
import {HttpErrorResponse} from '@angular/common/http';
import HttpException from '../../helpers/ErrorHandling/httpException';
import {getBackendErrrorMesage} from '../../helpers/errorHandlingFucntion/handleBackendError';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {ValidateMaterialCodeUniqueService} from '../MaterialServices/validate-material-code-unique.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  generalNamesInSelectedLanguage,
  materialNamesInSelectedLanguage
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {BackendMessageService} from "../../helpers/ErrorHandling/backend-message.service";

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

  constructor(private materialTableService: GeneralTableService,
              private backendMessageService: BackendMessageService,
              private materialBackendService: MaterialBackendService,
              public validateMaterialCodeUniqueService: ValidateMaterialCodeUniqueService,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.materialForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      materialCode: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(6),   Validators.maxLength(6)], [this.validateMaterialCodeUniqueService.materialCodeValidatorForUpdate()]),
      // tslint:disable-next-line:max-line-length
      materialName: new FormControl('', [Validators.nullValidator && Validators.required], [this.validateMaterialCodeUniqueService.materialNameValidatorForUpdate()]),
    }, {updateOn: 'change'});
    this.initColumnNamesInSelectedLanguage();
    this.materialToUpdateId = this.materialTableService.selectedId;
    console.log(`materialToUpdateId= ${this.materialToUpdateId}`);
    this.materialBackendService.findRecordById(String(this.materialToUpdateId)).subscribe((material) => {
        this.materialToUpdate = material.body;
        this.materialForm.controls.materialCode.setValue(this.materialToUpdate.materialCode);
        this.materialForm.controls.materialName.setValue(this.materialToUpdate.materialName);
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
    // tslint:disable-next-line:max-line-length
    console.log(`materialFOrrmValu= ${this.materialForm.value}`);
    // tslint:disable-next-line:max-line-length
    this.materialBackendService.updateRecordById(String(this.materialTableService.selectedId), this.materialForm.value).subscribe((material) => {
        this.operationStatusMessage = this.backendMessageService.returnSuccessMessageToUserForSuccessBackendResponseForUpdate();
        this.resetMaterialFormValueAndOperationStatus();
      }, error => {
       this.operationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
        this.resetMaterialFormValueAndOperationStatus();
      }
    );


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


