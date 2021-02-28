import {AfterContentChecked, Component, Input, OnInit} from '@angular/core';
import DimensionCode from '../../DimensionCodes/DimensionCodesTypesAnClasses/diemensionCode.entity';
import {DimensionCodeTableService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-table.service';
import {DimensionCodeBackendService} from '../../DimensionCodes/DimensionCodeServices/dimension-code-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {SearchService} from '../../helpers/directive/SearchDirective/search.service';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {LanguageBackendService} from '../languageServices/language-backend.service';
import Language from '../LanguageTypesAndClasses/languageEntity';
import {API_URL} from '../../Config/apiUrl';
import {OperationStatusServiceService} from '../../OperationStatusComponent/operation-status/operation-status-service.service';
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {
  generalNamesInSelectedLanguage, generalUserNames,
  languageNames
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";

@Component({
  selector: 'app-language-main',
  templateUrl: './language-main.component.html',
  styleUrls: ['./language-main.component.css']
})
export class LanguageMainComponent implements OnInit, AfterContentChecked {
  @Input()
  records: Language[];
  createNewMaterialDescription = 'Dodaj Nowy';
  // tslint:disable-next-line:ban-types
  deleTedRecordMessage: any;
  operationStatusMessage: string;
  deleteButtonInfo: string;
  showUpdateForm = false;
  updateButtonInfo;
  materialId: number;
  selectedLanguageLang: string;
  recordNumbers: number;
  languageCodeDescription: string;
  languageNameDescription: string;
  languageActiveDescription: string;
  tableColumnDescriptions: string[];
  showConfirmDeleteWindow: boolean;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  languageNames = languageNames;
  userNames = generalUserNames;
  rootUrl = API_URL;


  constructor(public tableService: GeneralTableService,
              public backendService: LanguageBackendService,
              private router: Router,
              private searChService: SearchService,
              private activedIdParam: ActivatedRoute,
              private authenticationService: AuthenticationService,
              public statusService: OperationStatusServiceService) {
  }
  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();
    this.getRecords();
    this.materialId = this.tableService.selectedId;
    this.deleteButtonInfo = this.generalNamesInSelectedLanguage.deleteButtonInfo;
    this.updateButtonInfo = this.generalNamesInSelectedLanguage.updateButtonInfo;
  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    this.userNames = this.authenticationService.generalUserNames;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;
    this.languageNames = this.authenticationService.languageNamesInselectedLanguage;
    this.languageCodeDescription = this.languageNames.languageCode;
    this.languageNameDescription = this.languageNames.languageName
    this.languageActiveDescription = this.userNames.active;
  }

  ngAfterContentChecked(): void {
    if (this.records) {
      this.recordNumbers = this.records.length;
    }
  }
  getRecords(): void {
    this.backendService.getRecords().subscribe((records) => {
      this.tableService.records.length = 0;
      this.tableService.records = records.body;
      this.records = this.tableService.getRecords();
      this.searChService.orginalArrayCopy = [...this.tableService.getRecords()];
    });

  }

  selectRecordtoDeleteAndShowConfirmDeleteWindow(materialId: number): void {
    this.statusService.resetOperationStatus([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
    this.showConfirmDeleteWindow = true;
    this.tableService.selectedId = materialId;
  }
  deleteSelectedRecordFromDatabase(recordId: number, deleteConfirmed: boolean): void {
    if (deleteConfirmed === true) {
      this.backendService.deleteRecordById(String(recordId)).subscribe((response) => {
        this.operationSuccessStatusMessage = this.generalNamesInSelectedLanguage.operationDeleteSuccessStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      }, error => {
        this.operationFailerStatusMessage =  this.generalNamesInSelectedLanguage.operationDeleteFailerStatusMessage;
        this.tableService.selectedId = null;
        this.showConfirmDeleteWindow = false;
        this.statusService.makeOperationStatusVisable();
        this.statusService.resetOperationStatusAfterTimeout([this.operationFailerStatusMessage, this.operationSuccessStatusMessage]);
      });
    }
    else {
      this.showConfirmDeleteWindow = false;
    }
  }

  updateSelectedRecord(recordId: number): void {
    this.tableService.selectedId = recordId;
    this.router.navigateByUrl(`/languages/create?mode=update&languageId=${recordId}`);
  }

  getSelectedLanguageFromNamesInAllLanguages(localizedNames: LocalizedName[], selectedLanguageLang: string): string {
    const localizedNameInGivenLanguage: LocalizedName[] = [];
    localizedNames.forEach((localizedName) => {
      if (localizedName.languageCode === selectedLanguageLang) {
        localizedNameInGivenLanguage.push(localizedName);
      }
    });
    return localizedNameInGivenLanguage[0].nameInThisLanguage;
  }


  createNewRecord(): void {
    this.router.navigateByUrl(`/languages/create?mode=createNew`);
  }
  getFlagUrl(language: Language): string {
    const flagUlr = this.rootUrl +  language.flagUrl;
    return flagUlr;

  }
}
