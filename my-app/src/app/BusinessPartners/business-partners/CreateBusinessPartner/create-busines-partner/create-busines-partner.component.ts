import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BusinesPartnerBackendService} from '../../BusinessPartnerServices/busines-partner-backend.service';
import {BusinessPartnerValidatorService} from '../../BusinessPartnerServices/business-partner-validator.service';
import {AuthenticationService} from '../../../../LoginandLogOut/AuthenticationServices/authentication.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from '../../../../helpers/otherGeneralUseFunction/getNameInGivenLanguage';
import {
  generalNamesInSelectedLanguage,
  generalUserNames,
  orderNames
} from '../../../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription';
import {GeneratePassordAlgoritm} from "../../../../helpers/directive/GeneratePasswordDirective/generatePassordAlgoritm";
import {navigateToUrlAfterTimout} from "../../../../helpers/otherGeneralUseFunction/navigateToUrlAfterTimeOut";
import {BackendMessageService} from "../../../../helpers/ErrorHandling/backend-message.service";
import RoleEnum from "../../../../Users/users/userTypes/roleEnum";

@Component({
  selector: 'app-create-busines-partner',
  templateUrl: './create-busines-partner.component.html',
  styleUrls: ['./create-busines-partner.component.css']
})
export class CreateBusinesPartnerComponent implements OnInit {

  operationStatusMessage: string;
  userNamesInSelectedLanguage = generalUserNames;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;
  noParnterFoundInfo: string;
  constructor(
    private authenticationService: AuthenticationService,
    private bakcendService: BusinesPartnerBackendService,
    public validatorService: BusinessPartnerValidatorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private backendMessageService: BackendMessageService) {

  }

  // @ts-ignore
  userForm = new FormGroup({
    // tslint:disable-next-line:max-line-length
    code: new FormControl('', [Validators.nullValidator, Validators.required]),
    businesPartnerCompanyName: new FormControl('', [Validators.nullValidator, Validators.required]),
    fulName: new FormControl('', [Validators.nullValidator, Validators.required]),
    // tslint:disable-next-line:max-line-length
    email: new FormControl('', {updateOn: 'change', validators: [Validators.nullValidator, Validators.required, Validators.email], asyncValidators: [this.validatorService.emailAsyncValidator()]}),
    // tslint:disable-next-line:max-line-length
    password: new FormControl('', [Validators.nullValidator, Validators.required, Validators.minLength(8),  this.validatorService.patternValidator(/(?=(.*\d){2})/, { hasNumber: true }), this.validatorService.patternValidator(/[A-Z]/, { hasCapitalCase: true }), this.validatorService.patternValidator(/[a-z]/, { hasSmallCase: true })]),
    confirmPassword: new FormControl('', [Validators.required]),
    // tslint:disable-next-line:max-line-length
    active: new FormControl(false),
    // tslint:disable-next-line:max-line-length
  }, {updateOn: 'change', validators: [this.validatorService.passwordMatchValidator({NoPassswordMatch: true})]});

  // tslint:disable-next-line:typedef
  get fulName() {
    return this.userForm.get('fulName');
  }
  // tslint:disable-next-line:typedef
  get code() {
    return this.userForm.get('code');
  }
  // tslint:disable-next-line:typedef
  get businesPartnerCompanyName() {
    return this.userForm.get('businesPartnerCompanyName');
  }
  // tslint:disable-next-line:typedef
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  // tslint:disable-next-line:typedef
  get email() {
    return this.userForm.get('email');
  }
  // tslint:disable-next-line:typedef
  get password() {
    return this.userForm.get('password');
  }
  // tslint:disable-next-line:typedef
  get active() {
    return this.userForm.get('active');
  }
  // tslint:disable-next-line:typedef
  get isAdmin() {
    return this.userForm.get('isAdmin');
  }


  onSubmit(): void {
    this.bakcendService.addOneRecord(this.userForm.value).subscribe((user) => {
      this.operationStatusMessage = this.userNamesInSelectedLanguage.partnerAddSuccessStatusMessage;
      navigateToUrlAfterTimout(this.authenticationService._previousUrl, this.router);

    }, error => {
      this.operationStatusMessage = this.backendMessageService.returnErrorToUserBasingOnBackendErrorStringForCreateNew(error);

    });
  }
  closeAndGoBack(): void {
    /*this.router.navigateByUrl('businessPartners/1');*/
    this.router.navigateByUrl('businessPartners');
  }

  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.userNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNames, this.authenticationService.vocabulariesInSelectedLanguage);
  }
  cleanOperationMessage(): void {
    setTimeout(() => {
      this.operationStatusMessage = null;
    }, 2000);
  }


  generatePassword() {
    const passordGenerator = new GeneratePassordAlgoritm();
    const generetedPassword= passordGenerator.generatePassword(10)
    this.password.setValue(generetedPassword)
    this.confirmPassword.setValue(generetedPassword);

  }

  searchParnterInSap() {
    this.noParnterFoundInfo = undefined;

    this.bakcendService.findOneBusinessPartnerFromSapByCode(this.code.value).subscribe((result)=>{
      const foundPartner = result.body;
      if(foundPartner) {
        this.businesPartnerCompanyName.setValue(foundPartner.Cardname);
        if(this.authenticationService.userRole=== RoleEnum.EDITOR) {

          this.businesPartnerCompanyName.disable();
          this.code.disable();
        }


        this.fulName.setValue(foundPartner.CntcPerson);
        this.email.setValue(foundPartner.e_mail_CntcPerson);

      }
      else if(!foundPartner) {
        this.noParnterFoundInfo = this.generalNamesInSelectedLanguage.noParnterFoundInSap;
      }
    }, error => {
      this.noParnterFoundInfo= this.generalNamesInSelectedLanguage.noParnterFoundInSap;
      console.error( 'error occured during importing parnter data from SAP');
    });
  }
}
