import { Component, OnInit } from '@angular/core';
import {UserBackendService} from '../UserServices/user-backend.service';
import {UserValidatorService} from '../UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersTableService} from '../UserServices/users-table.service';
import CHangePasswordByAdminDto from '../users/userTypes/changePasswordDto';
import {UserHasAdminRole} from '../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from '../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {
  generalNamesInSelectedLanguage,
  generalUserNames, orderNames
} from '../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {GeneratePassordAlgoritm} from "../../helpers/directive/GeneratePasswordDirective/generatePassordAlgoritm";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  operationStatusMessage: string;
  selectedId: string;
  userNamesInSelectedLanguage = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;
  admin: string;
  editor: string;
  userForm: FormGroup;

  constructor(
    private userBackendService: UserBackendService,
    private userTableService: GeneralTableService,
    public userValidatorService: UserValidatorService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) {


  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {

      this.selectedId = queryParams.get('userId');

    });
    this.userForm = new FormGroup({
      // tslint:disable-next-line:max-line-length
      password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.userValidatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.userValidatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.userValidatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, {updateOn: 'change', validators: [this.userValidatorService.passwordMatchValidator({NoPassswordMatch: true})]})
    this.initColumnNamesInSelectedLanguage();
    this.getSelectedUserData();
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
  onSubmit(): void {
    const changePasswordData: CHangePasswordByAdminDto = {newPassword: this.password.value};
    this.userBackendService.changeUserPasswordById(this.selectedId, changePasswordData).subscribe((user) => {
      this.operationStatusMessage = this.userNamesInSelectedLanguage.passwordChangeSuccessStatus;
      this.cleanOperationMessage();
    }, error => {
      this.operationStatusMessage = this.userNamesInSelectedLanguage.passwordChangeFailerStatus;
      this.cleanOperationMessage();
    });
  }
  closeAndGoBack(): void {
    this.router.navigateByUrl('/users');
  }


  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    this.userNamesInSelectedLanguage = this.authenticationService.generalUserNames;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
    this.admin = this.userNamesInSelectedLanguage.admin;
    this.editor = this.userNamesInSelectedLanguage.editor;
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
    }, 2000);
  }
  getSelectedUserData(): void {
    this.userBackendService.findUserById(this.selectedId).subscribe((user) => {
      if (user.body) {
        this.userFulname = user.body.fulName;
        this.userEmail = user.body.email;
        if (UserHasAdminRole(user.body)) {
          this.userStatus = this.userNamesInSelectedLanguage.admin;
        }
        else {
          this.userStatus = this.userNamesInSelectedLanguage.editor;
        }
      }
    });
  }

  generatePassword() {
    const passordGenerator = new GeneratePassordAlgoritm();
    this.password.setValue(passordGenerator.generatePassword(10));
  }



}
