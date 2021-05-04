import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {UserBackendService} from '../../../../Users/UserServices/user-backend.service';
import {UsersTableService} from '../../../../Users/UserServices/users-table.service';
import {UserValidatorService} from '../../../../Users/UserServices/user-validator.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserHasAdminRole} from '../../../../helpers/otherGeneralUseFunction/checkUserRolesFunction';
import {BusinesPartnerBackendService} from '../../BusinessPartnerServices/busines-partner-backend.service';
import {BusinessPartnerTableService} from '../../BusinessPartnerServices/business-partner-table.service';
import {BusinessPartnerValidatorService} from '../../BusinessPartnerServices/business-partner-validator.service';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {
  generalNamesInSelectedLanguage,
  generalUserNames, orderNames
} from '../../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';
import {GeneralTableService} from "../../../../util/GeneralTableService/general-table.service";
import {BusinessPartnersComponent} from "../../BusinessPartnerMainComponent/business-partners.component";
import {navigateToUrlAfterTimout} from "../../../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";
import {BackendMessageService} from "../../../../helpers/ErrorHandling/backend-message.service";

@Component({
  selector: 'app-update-business-partner',
  templateUrl: './update-business-partner.component.html',
  styleUrls: ['./update-business-partner.component.css']
})
export class UpdateBusinessPartnerComponent implements OnInit, AfterContentChecked {

  operationStatusMessage: string;
  selectedId: string;
  userNamesInSelectedLanguage = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;
  userForm: FormGroup;


  constructor(
    private authenticationService: AuthenticationService,
    private backendService: BusinesPartnerBackendService,
    private tableService: GeneralTableService,
    public validatorService: BusinessPartnerValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private backendMessageService: BackendMessageService) {
  }

  ngOnInit(): void {
   // this.selectedId = String(this.tableService.selectedId);
    this.route.queryParamMap.subscribe((queryParams) => {

      this.selectedId = queryParams.get('parnterId');

    });
    this.userForm = new FormGroup({
      code: new FormControl('', [Validators.nullValidator, Validators.required]),
      businesPartnerCompanyName: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      fulName: new FormControl('', [Validators.nullValidator, Validators.required]),
      // tslint:disable-next-line:max-line-length
      email: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.nullValidator, Validators.required, Validators.email],
        asyncValidators: [this.validatorService.emailAsyncValidatorForUpdate(this.selectedId)]
      }),
      active: new FormControl(false),
      // tslint:disable-next-line:max-line-length
      isAdmin: new FormControl(false),
    }, {updateOn: 'change'});
    // tslint:disable-next-line:typedef

    this.initColumnNamesInSelectedLanguage();
    this.setCurrentValueOfFormFields();
  }


  // @ts-ignore

  get code() {
    return this.userForm.get('code');
  }
  // tslint:disable-next-line:typedef
  get businesPartnerCompanyName() {
    return this.userForm.get('businesPartnerCompanyName');
  }
  // tslint:disable-next-line:typedef
  get fulName() {
    return this.userForm.get('fulName');
  }

  // tslint:disable-next-line:typedef
  get email() {
    return this.userForm.get('email');
  }

  // tslint:disable-next-line:typedef
  get active() {
    return this.userForm.get('active');
  }

  // tslint:disable-next-line:typedef
  get isAdmin() {
    return this.userForm.get('isAdmin');
  }

  setCurrentValueOfFormFields(): void {
    this.backendService.findRecordById(this.selectedId).subscribe((user) => {
      const foundUser = user.body;
      this.fulName.setValue(user.body.fulName);
      this.email.setValue(user.body.email);
      this.active.setValue(user.body.active);
      this.code.setValue(user.body.code);
      this.businesPartnerCompanyName.setValue(user.body.businesPartnerCompanyName);
      if (UserHasAdminRole(foundUser)) {
        this.isAdmin.setValue(true);
      } else {
        this.isAdmin.setValue(false);
      }
    });

  }

  onSubmit(): void {
    this.backendService.updateRecordById(this.selectedId, this.userForm.value).subscribe((user) => {
      this.operationStatusMessage = this.userNamesInSelectedLanguage.partnerUpdateSuccessStatusMessage;
      navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);
    }, error => {
      this.operationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForUpdate(error);
      this.cleanOperationMessageAndGoBack();
    });
  }

  closeAndGoBack(): void {
    /*for version with pagination: this.router.navigateByUrl('businessPartners/1');*/
    this.router.navigateByUrl('businessPartners');
  }

  initColumnNamesInSelectedLanguage(): void {
    this.userNamesInSelectedLanguage = this.authenticationService.generalUserNames;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
  }

  cleanOperationMessageAndGoBack(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
      /*this.router.navigateByUrl('businessPartners/1')*/
      this.router.navigateByUrl('businessPartners');
    }, 2000);
  }

  ngAfterContentChecked(): void {
  }


}
