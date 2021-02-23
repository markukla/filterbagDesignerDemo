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
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  otherRecordAlreadyExist = 'rekord który próbowałeś dodać już istnieję w bazie danych';
  generalErrorMessageForCreate = ' Wystąpił błąd: nie udało się dodać nowego rekordu do bazy danych, spróbuj ponownie';
  generalSuccessMessageForCreate = 'Dodano nowy rekord do bazy danych';
  generalSuccessMessageForUpdate = 'Zaktualizowano wybrany  rekord w  bazie danych';
  generalErrorMessageForUpdate = ' Wystąpił błąd: Dodawania/aktualizacja nie powiodły się, spróbuj ponownie'
  otherRecordWithThisNameAlreadyExist = 'w bazie danych istnieje już inny rekord z podaną nazwą:';
  otherRecordWithThisCodeAlreadyExist = 'inny rekord z podanym kodem już istnieje w bazie danych'



  constructor(private authenticationService: AuthenticationService) {
    this.initColumnNamesInSelectedLanguage();
    this.otherRecordAlreadyExist = this.generalNamesInSelectedLanguage.otherRecordAlreadyExist;
    this.generalErrorMessageForCreate = this.generalNamesInSelectedLanguage.operationAddFailerStatusMessage;
    this.generalSuccessMessageForCreate = this.generalNamesInSelectedLanguage.operationAddSuccessStatusMessage;
    this.generalSuccessMessageForUpdate = this.generalNamesInSelectedLanguage.operationUpdateSuccessStatusMessage;
    this.generalErrorMessageForUpdate = this.generalNamesInSelectedLanguage.operationUpdateFailerStatusMessage;



  }

  returnErrorToUserBasingOnBackendErrorStringForCreateNew(error: HttpErrorResponse): string {
    const errorMessage = error.error.message.toUpperCase().trim();
    const errorToExpect = 'already exist'.toUpperCase().trim();
    if (errorMessage.includes(errorToExpect)) {
      console.log(errorMessage);
      return this.generalErrorMessageForCreate + ' ' + this.otherRecordAlreadyExist;
    } else {
      return this.generalErrorMessageForCreate;
    }
  }
  returnErrorToUserBasingOnBackendErrorStringForUpdate(error: HttpErrorResponse): string {
    const errorMessage = error.error.message.toUpperCase();
    const errorToExpect = 'already exist'.toUpperCase();
    if (errorMessage.includes(errorToExpect)) {
      console.log(`error.error.message = ${error.error.message}`);
      return this.generalErrorMessageForUpdate + ' '+ this.otherRecordAlreadyExist;
    } else {
      return this.generalErrorMessageForUpdate;
    }
  }

  returnSuccessMessageToUserForSuccessBackendResponseForCreateNew(): string {
    return this.generalSuccessMessageForCreate;

  }

  returnSuccessMessageToUserForSuccessBackendResponseForUpdate(): string {
    return this.generalSuccessMessageForUpdate;

  }

  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);


  }

}
