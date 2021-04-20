import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import CreateDimensionCodeDto from '../DimensionCodesTypesAnClasses/createDimensionCode.dto';
import {API_URL} from '../../Config/apiUrl';
import {
  getSelectedLanguageFromNamesInAllLanguages,
  setTabelColumnAndOtherNamesForSelectedLanguage
} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";

import {DimensionCodeForTableCell} from "../DimensionCodesTypesAnClasses/dimensionCodeForTableCell";
import DimensionCode from "../DimensionCodesTypesAnClasses/diemensionCode.entity";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";
import {dimensionNames} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";
import DimensionRoleEnum from "../DimensionCodesTypesAnClasses/dimensionRoleEnum";
import {GeneralTableService} from "../../util/GeneralTableService/general-table.service";

@Injectable({
  providedIn: 'root'
})
export class DimensionCodeBackendService {
  rootURL = API_URL;
  endpointUrl = '/api/dimensionCodes';
  dimensionNames = dimensionNames;

  constructor(private http: HttpClient,
              private tableService: GeneralTableService,
              private authenticationService: AuthenticationService) {
  }

  getRecords(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  getFirstIndexDimensions(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl + '/roles/indexDimensions/first', {observe: 'response'});
  }

  getSecondIndexDimensions(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl + '/roles/indexDimensions/second', {observe: 'response'});

  }
  getNonIndexDimensions(): Observable<HttpResponse<DimensionCode[]>> {
    return this.http.get<DimensionCode[]>(this.rootURL + this.endpointUrl + '/roles/indexDimensions/non', {observe: 'response'});

  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateDimensionCodeDto): Observable<HttpResponse<DimensionCode>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<DimensionCode>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createProductTypeForTableCellFromProductTop(record.body));
      }));
  }

  deleteRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.tableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, updatedRecord: CreateDimensionCodeDto): Observable<HttpResponse<DimensionCode>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<DimensionCode>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), this.createProductTypeForTableCellFromProductTop(record.body));
      }));
  }

  findRecordBycode(code: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/codes/${code}`;
    return this.http.get<boolean>(url);
  }

  findRecordByName(name: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/names/${name}`;
    return this.http.get<boolean>(url);
  }

  findRecordBycodeForUpdate(id: string, code: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/${id}/codes/${code}`;
    return this.http.get<boolean>(url);
  }

  findRecordByNameForUpdate(id: string, name: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/${id}/names/${name}`;
    return this.http.get<boolean>(url);
  }

  findRecordById(recordToUpdateId: string): Observable<HttpResponse<DimensionCode>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${recordToUpdateId}`;
    return this.http.get<DimensionCode>(getUrl, {observe: 'response'});
  }

  createProductTypeForTableCellFromProductTop(diemensionCode: DimensionCode): DimensionCodeForTableCell{
    // tslint:disable-next-line:max-line-length
    const localizedNameInSelectedLanguage = getSelectedLanguageFromNamesInAllLanguages(diemensionCode.vocabulary.localizedNames, this.authenticationService.selectedLanguageCode);
    setTabelColumnAndOtherNamesForSelectedLanguage(this.dimensionNames, this.authenticationService.vocabulariesInSelectedLanguage);
    let dimensionRole: string;
    if(diemensionCode.dimensionRole === DimensionRoleEnum.FIRSTINDEXDIMENSION) {
      dimensionRole = dimensionNames.dimensionRoleFirstIndex;
    }
    else if(diemensionCode.dimensionRole === DimensionRoleEnum.SECONDINDEXDIMENSION) {
      dimensionRole = dimensionNames.dimensionRoleSecondIndex;
    }
    else {
      dimensionRole = dimensionNames.dimensionRoleNoIndex;
    }
    const productTypeForTableCell: DimensionCodeForTableCell = {
      ...diemensionCode,
      localizedDimensionName: localizedNameInSelectedLanguage,
      dimensionRole: dimensionRole

    };
    return productTypeForTableCell;
  }
}
