import { Component, OnInit } from '@angular/core';
import {BusinesPartnerBackendService} from '../BusinessPartners/business-partners/BusinessPartnerServices/busines-partner-backend.service';
import {BusinessPartnerTableService} from '../BusinessPartners/business-partners/BusinessPartnerServices/business-partner-table.service';
import {BusinessPartnerValidatorService} from '../BusinessPartners/business-partners/BusinessPartnerServices/business-partner-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import CHangePasswordByAdminDto from '../Users/users/userTypes/changePasswordDto';
import {UserHasAdminRole} from '../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import {AuthenticationBackendService} from '../LoginandLogOut/AuthenticationServices/authentication.backend.service';
import {ChangePasswordDto} from '../LoginandLogOut/AuthenticationServices/changePasswordDto';
import {AuthenticationService} from '../LoginandLogOut/AuthenticationServices/authentication.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  generalNamesInSelectedLanguage,
  generalUserNames, orderNames
} from "../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {navigateToUrlAfterTimout} from "../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";

@Component({
  selector: 'app-change-password-component',
  templateUrl: './change-password-for-logged-user.component.html',
  styleUrls: ['./change-password-for-logged-user.component.css']
})
export class ChangePasswordForLoggedUserComponent implements OnInit {

  operationStatusMessage: string;
  selectedId: string;
  userNamesInSelectedLanguage = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;
  userForm: FormGroup;

  constructor(
    private backendService: AuthenticationBackendService,
    private authenticationService: AuthenticationService,
    public validatorService: BusinessPartnerValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
  }
  ngOnInit(): void {
    this.userForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.validatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.validatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.validatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {updateOn: 'change', validators: [this.validatorService.passwordMatchValidator({NoPassswordMatch: true})]})
    this.initColumnNamesInSelectedLanguage();
  }

  // @ts-ignore


  // tslint:disable-next-line:typedef
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  // tslint:disable-next-line:typedef
  userFulname: string;
  userEmail: string;
  userStatus: string;
  // tslint:disable-next-line:typedef
  get password() {
    return this.userForm.get('password');
  }
  // tslint:disable-next-line:typedef
  get oldPassword() {
    return this.userForm.get('oldPassword');
  }
  onSubmit(): void {
    const changePasswordData: ChangePasswordDto = {
      newPassword: this.password.value,
      oldPassword: this.oldPassword.value
    };
    this.backendService.changePasswordByLoggedUser(changePasswordData).subscribe((user) => {
      this.operationStatusMessage = this.userNamesInSelectedLanguage.passwordChangeSuccessStatus;
      navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
    }, error => {
      this.operationStatusMessage = this.userNamesInSelectedLanguage.passwordChangeFailerStatus;

    });
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl(this.authenticationService._previousUrl);
  }


  initColumnNamesInSelectedLanguage(): void {
    this.userNamesInSelectedLanguage = this.authenticationService.generalUserNames;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
    }, 2000);
  }


}
