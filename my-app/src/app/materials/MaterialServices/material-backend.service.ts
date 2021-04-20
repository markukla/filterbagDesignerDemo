import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Material} from '../MaterialsMainComponent/material';
import {API_URL} from '../../Config/apiUrl';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';
import {getSelectedLanguageFromNamesInAllLanguages} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {MaterialForTabelCell} from "../MaterialsMainComponent/materialForTabelCell";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";
import {MaterialDto} from "../MaterialsMainComponent/materialDto";


@Injectable({
  providedIn: 'root'
})
export class MaterialBackendService {
  rootURL = API_URL;
  endpointUrl = '/api/materials';
  constructor(private http: HttpClient,
              private materialTableService: GeneralTableService,
              private authenticationService: AuthenticationService) {
  }

  getRecords(): Observable<HttpResponse<Material[]>> {
    return this.http.get<Material[]>(this.rootURL + this.endpointUrl, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(material: MaterialDto): Observable<HttpResponse<Material>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Material>(this.rootURL + this.endpointUrl, material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.materialTableService.addRecordToTable(material.body);
      }));
  }

  deleteRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.materialTableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, material: MaterialDto): Observable<HttpResponse<Material>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.patch<Material>(updateUrl, material, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
      this.materialTableService.updateTableRecord(Number(id), material.body);
      }));
  }
  findMaterialBycode(materiaCodeObject: any): Observable<Material> {
    const url = `${this.rootURL + this.endpointUrl}/codes`;
    return this.http.post<any>(url, materiaCodeObject);

  }
  findMaterialByName(materialNameObject: any): Observable<Material> {
    const url = `${this.rootURL + this.endpointUrl}/names`;
    return this.http.post<any>(url, materialNameObject);

  }

  findRecordBycode(materiaCode: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/codes/${materiaCode}`;
    return this.http.get<boolean>(url);

  }
  findRecordByName(materiaName: string): Observable<boolean> {
    const url = `${this.rootURL + this.endpointUrl}/names/${materiaName}`;
    return this.http.get<boolean>(url);

  }
  findRecordById(materialToUpdateId: string): Observable<HttpResponse<Material>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/${materialToUpdateId}`;
    return this.http.get<Material>(getUrl, {observe: 'response'} );
  }
  createMaterialForTableCellFromMaterial(material: Material): MaterialForTabelCell {
    // tslint:disable-next-line:max-line-length
    const descriptionInSelectedLanguage = getSelectedLanguageFromNamesInAllLanguages(material.vocabulary.localizedNames, this.authenticationService.selectedLanguageCode);
    const materialForTabelCell: MaterialForTabelCell = {
      ...material,
      descriptionInSelectedLanguage: descriptionInSelectedLanguage,
    };
    return materialForTabelCell;
  }

}
