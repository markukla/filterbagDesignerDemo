import {Injectable} from '@angular/core';
import LoggedUser from '../authenticationTypesAndClasses/logedUser';
import User from '../../Users/users/userTypes/user';
import TokenData from '../authenticationTypesAndClasses/tokenData';
import RoleEnum from '../../Users/users/userTypes/roleEnum';
import Language from '../../Languages/LanguageTypesAndClasses/languageEntity';
import {Vocabulary} from '../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity';
import {filter} from 'rxjs/operators';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {VocabularyForTableCell} from '../../Vocablulaty/VocabularyTypesAndClasses/VocabularyForTableCell';
import {Subscription} from "rxjs";
import {NavigationEvent} from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker-view-model";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  dimensionNames,
  drawingTableFormNames,
  generalNamesInSelectedLanguage,
  generalUserNames, languageNames, materialNamesInSelectedLanguage, orderNames
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {AuthenticationBackendService} from "./authentication.backend.service";
import {VocabularyBackendServiceService} from "../../Vocablulaty/VocabularyServices/vocabulary-backend-service.service";
export let browserRefresh = false;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loggedUser: LoggedUser;
  user: User;
  tokenData: TokenData;
  tokenString: string;
  userRole: RoleEnum;
  selectedLanguageCode: string;
  languages: Language [];
  subscription: Subscription;
  vocabulariesInSelectedLanguage: VocabularyForTableCell[];
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  generalUserNames = generalUserNames
  orderNamesInSelectedLanguage = orderNames;
  languageNamesInselectedLanguage = languageNames;
  drawingTableFormNamesInSelectedLanguage = drawingTableFormNames;
  dimensionNamesInSelectedLanguage = dimensionNames;
  materialNamesInSelectedLanguage = materialNamesInSelectedLanguage;

  private previousUrl: string;
  private currentUrl: string;
  private routeHistory: string[];

  constructor(public router: Router,
              private authBackenService: AuthenticationBackendService,
              private vocabularyBackendService: VocabularyBackendServiceService) {
    this.logInFromSessionStorageAndInitColumNamesForSelectedLanguage();
    this.routeHistory = [];
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this._setURLs(event);
      });
/* router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
      if(performance.navigation.type ===1) {
        this.refreshPage(this._currentUrl);
      }
    });*/







  }
  private refreshPage(currrenturl: string): void  {
    this.router.navigateByUrl(currrenturl);
  }
  private _setURLs(event: NavigationEnd): void {
    const tempUrl = this.currentUrl;
    this.previousUrl = tempUrl;
    this.currentUrl = event.urlAfterRedirects;
    this.routeHistory.push(event.urlAfterRedirects);
  }

  get _previousUrl(): string {
    return this.previousUrl;
  }

  get _currentUrl(): string {
    return this.currentUrl;
  }

  get _routeHistory(): string[] {
    return this.routeHistory;
  }
  setLogedUserUserAndToken(loggedUser: LoggedUser): void {
    this.loggedUser = loggedUser;
    if (loggedUser) {
      this.user = loggedUser.user;
      this.tokenData = loggedUser.tokenData;
      this.tokenString = loggedUser.tokenData.token;
      this.setUserRole();
    }
    else {
      this.user = undefined;
      this.tokenData = undefined;
      this.tokenString = undefined;
      this.userRole = undefined;
    }
  }

  getLogedUser(): LoggedUser {
    return this.loggedUser;
  }
  setUserRole(): void {
    if (this.UserHasAdminRole(this.user)){
      this.userRole = RoleEnum.ADMIN;
    }
    if (this.UserHasEditorRoleButIsNotAdmin(this.user)) {
      this.userRole = RoleEnum.EDITOR;
    }
    if (this.UserHasPartnerRole(this.user)) {
      this.userRole = RoleEnum.PARTNER;
    }
  }
  public UserHasAdminRole = (user: User): boolean => {
    let isAdmin = false;

    user.roles.forEach(role => {
      if (role.rolename === RoleEnum.ADMIN) {
        isAdmin = true;

      }
    });


    return isAdmin;

  }
  public UserHasEditorRoleButIsNotAdmin = (user: User): boolean => {
    let isEditorButNotAdmin = false;
    let isAdmin = false;
    let isEditor = false;
    user.roles.forEach(role => {
      if (role.rolename === RoleEnum.ADMIN) {
        isAdmin = true;

      }
      if (role.rolename === RoleEnum.EDITOR) {
        isEditor = true;

      }
    });
    if (isEditor && !isAdmin) {
      isEditorButNotAdmin = true;
    }


    return isEditorButNotAdmin;

  }
  public UserHasPartnerRole = (user: User): boolean => {
    let isPartner = false;

    user.roles.forEach(role => {
      if (role.rolename === RoleEnum.PARTNER) {
        isPartner = true;

      }
    });


    return isPartner;

  }
  logInFromSessionStorageAndInitColumNamesForSelectedLanguage(): void {
    const logedUserInSession: LoggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    console.log(logedUserInSession);
    if (logedUserInSession) {
      this.setLogedUserUserAndToken(logedUserInSession);
      const selectedLanguageCodeInSessionStorage = sessionStorage.getItem('languageCode');
      const vocabulariesInselctedLanguageInSessionStorage = sessionStorage.getItem('vocabulariesInSelectedLanguage');
      if (selectedLanguageCodeInSessionStorage && vocabulariesInselctedLanguageInSessionStorage) {
        this.selectedLanguageCode = selectedLanguageCodeInSessionStorage;
        this.vocabulariesInSelectedLanguage = JSON.parse(vocabulariesInselctedLanguageInSessionStorage);
        this.setallNamesToSelectedLanguage();
      }
    }
  }

  resetAuthenticationServiceProperties(): void {
    this.loggedUser = null;
    this.user = null;
    this.tokenData = null;
    this.tokenString = null;
    this.userRole = null;
    this.selectedLanguageCode = null;
    this.vocabulariesInSelectedLanguage = null;
    this.generalNamesInSelectedLanguage = null;
    this.generalUserNames = null;
    this.orderNamesInSelectedLanguage = null;
    this.previousUrl = null;
    this.currentUrl = null;
    this.routeHistory = null;

  }

  logOut(): void {
    this.authBackenService.logout().subscribe((logoutResponse) => {
      sessionStorage.clear();
      // this.setLogedUserUserAndToken(null);
      this.resetAuthenticationServiceProperties();
      this.router.navigateByUrl('/');
    });
  }

  setallNamesToSelectedLanguage(): void {
    this.vocabulariesInSelectedLanguage.forEach((vocabulary) => {

    });
    setTabelColumnAndOtherNamesForSelectedLanguage(this.orderNamesInSelectedLanguage, this.vocabulariesInSelectedLanguage);
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalUserNames, this.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.drawingTableFormNamesInSelectedLanguage, this.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.dimensionNamesInSelectedLanguage, this.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.materialNamesInSelectedLanguage, this.vocabulariesInSelectedLanguage);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.languageNamesInselectedLanguage, this.vocabulariesInSelectedLanguage);

  }

  setSelectedLanguageCodeAndVocabullaryTableInSelectedLanguage(languageCode: string, vocabularies: Vocabulary []): void {
   if(languageCode && vocabularies) {
     this.selectedLanguageCode = languageCode;
     sessionStorage.setItem('languageCode', this.selectedLanguageCode);
     this.vocabulariesInSelectedLanguage = [];
     // tslint:disable-next-line:max-line-length
     vocabularies.forEach((vocabulary) => {
       this.vocabulariesInSelectedLanguage.push(this.vocabularyBackendService.createVocabularryForTableCellFromVocabulary(vocabulary, this.selectedLanguageCode));
     });
     sessionStorage.setItem('vocabulariesInSelectedLanguage', JSON.stringify(this.vocabulariesInSelectedLanguage));
     this.setallNamesToSelectedLanguage();
   }

  }
}

