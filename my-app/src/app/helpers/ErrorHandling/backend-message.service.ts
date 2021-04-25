import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from '../../LoginandLogOut/AuthenticationServices/authentication.service';
import {generalNamesInSelectedLanguage} from "../otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../otherGeneralUseFunction/getNameInGivenLanguage";

@Injectable({
  providedIn: 'root'
})
export class BackendMessageService {
  // tslint:disable-next-line:variable-name
  backendError: HttpErrorResponse;
  generalNamesInSelectedLanguage: any;
  otherRecordAlreadyExist = 'rekord który próbowałeś dodać już istnieję w bazie danych';
  generalErrorMessageForCreate = ' Wystąpił błąd: nie udało się dodać nowego rekordu do bazy danych, spróbuj ponownie';
  generalSuccessMessageForCreate = 'Dodano nowy rekord do bazy danych';
  generalSuccessMessageForUpdate = 'Zaktualizowano wybrany  rekord w  bazie danych';
  generalErrorMessageForUpdate = ' Wystąpił błąd: Dodawania/aktualizacja nie powiodły się, spróbuj ponownie'
  otherRecordWithThisNameAlreadyExist = 'w bazie danych istnieje już inny rekord z podaną nazwą:';
  otherRecordWithThisCodeAlreadyExist = 'inny rekord z podanym kodem już istnieje w bazie danych'



  constructor(private authenticationService: AuthenticationService) {

  }

  returnErrorToUserBasingOnBackendErrorStringForCreateNew(error: HttpErrorResponse): string {
    this.initColumnNamesInSelectedLanguage();
    let errorMessage: string;
    if(error && error.error) {
      errorMessage=error.error.message.toUpperCase();
    }

    const errorToExpect = 'already exist'.toUpperCase();
    if(errorMessage&&errorMessage.includes('code'.toUpperCase())){
      return this.generalErrorMessageForCreate + ' ' + this.otherRecordWithThisCodeAlreadyExist;
    }
    else if(errorMessage&&errorMessage.includes('name'.toUpperCase())){
      return this.generalErrorMessageForCreate + ' ' + this.otherRecordWithThisNameAlreadyExist;
    }
   else if (errorMessage&&errorMessage.includes(errorToExpect)) {
      console.log(errorMessage);
      return this.generalErrorMessageForCreate + ' ' + this.otherRecordAlreadyExist;
    } else {
      return this.generalErrorMessageForCreate;
    }
  }
  returnErrorToUserBasingOnBackendErrorStringForUpdate(error: HttpErrorResponse): string {
    this.initColumnNamesInSelectedLanguage();
    let errorMessage: string;
    if(error && error.error) {
       errorMessage = error.error.message.toUpperCase();
    }


    const errorToExpect = 'already exist'.toUpperCase();
    if(errorMessage&&errorMessage.includes('code'.toUpperCase())){
      return this.generalErrorMessageForUpdate+ ' ' + this.otherRecordWithThisCodeAlreadyExist;
    }
    else if(errorMessage&&errorMessage.includes('name'.toUpperCase())){
      return this.generalErrorMessageForUpdate + ' ' + this.otherRecordWithThisNameAlreadyExist;
    }
    else if (errorMessage&&errorMessage.includes(errorToExpect)) {
      console.log(`error.error.message = ${error.error.message}`);
      return this.generalErrorMessageForUpdate + ' '+ this.otherRecordAlreadyExist;
    } else {
      return this.generalErrorMessageForUpdate;
    }
  }

  returnSuccessMessageToUserForSuccessBackendResponseForCreateNew(): string {
    this.initColumnNamesInSelectedLanguage();
    console.log(`this.generalSuccessMessageForCreate = ${this.generalSuccessMessageForCreate}`)
    return this.generalSuccessMessageForCreate;


  }

  returnSuccessMessageToUserForSuccessBackendResponseForUpdate(): string {
    this.initColumnNamesInSelectedLanguage();
    return this.generalSuccessMessageForUpdate;

  }

  initColumnNamesInSelectedLanguage(): void {
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    console.log(`this.generalNamesInSelectedLanguage= ${this.generalNamesInSelectedLanguage}`);
    console.log(`this.generalNamesInSelectedLanguageoperationAddSuccessStatusMessage= ${this.generalNamesInSelectedLanguage.operationAddSuccessStatusMessage}`)
    console.log(`authenticationService.generalUserNames.operationAddSuccessStatusMessage= ${this.authenticationService.generalNamesInSelectedLanguage.operationAddSuccessStatusMessage}`)
    this.otherRecordAlreadyExist = this.generalNamesInSelectedLanguage.otherRecordAlreadyExist;
    this.generalErrorMessageForCreate = this.generalNamesInSelectedLanguage.operationAddFailerStatusMessage;
    this.generalSuccessMessageForCreate = this.generalNamesInSelectedLanguage.operationAddSuccessStatusMessage;
    this.generalSuccessMessageForUpdate = this.generalNamesInSelectedLanguage.operationUpdateSuccessStatusMessage;
    this.generalErrorMessageForUpdate = this.generalNamesInSelectedLanguage.operationUpdateFailerStatusMessage;
    this.otherRecordWithThisCodeAlreadyExist = this.generalNamesInSelectedLanguage.otherRecordWithThisCodeAlreadyExist;
    this.otherRecordWithThisNameAlreadyExist= this.generalNamesInSelectedLanguage.otherRecordWithThisNameAlreadyExist;
  }

}
