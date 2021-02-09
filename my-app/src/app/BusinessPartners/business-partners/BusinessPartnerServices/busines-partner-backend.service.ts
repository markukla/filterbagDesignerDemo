import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {UsersTableService} from '../../../Users/UserServices/users-table.service';
import {Observable} from 'rxjs';
import User from '../../../Users/users/userTypes/user';
import CreatePrivilegedUserDto from '../../../Users/users/userTypes/createUserDto';
import {tap} from 'rxjs/operators';
import UpdatePrivilegedUserWithouTPasswordDto from '../../../Users/users/userTypes/updatePriviligedUser';
import CHangePasswordByAdminDto from '../../../Users/users/userTypes/changePasswordDto';
import BlockUserDto from '../../../Users/users/userTypes/blockUseDto';
import CreateBusinessPartnerDto from '../../BusinessPartnerTypes/createBusinessPartnerDto';
import UpdateBussinessPartnerWithoutPassword from '../../BusinessPartnerTypes/updateBusinessPartnerDto';
import {BusinessPartnerTableService} from './business-partner-table.service';
import {API_URL} from '../../../Config/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class BusinesPartnerBackendService {

  rootURL = API_URL;

  constructor(private http: HttpClient,
              private partnerTableService: BusinessPartnerTableService
  ) {
  }

  getAllRecords(): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(this.rootURL + '/business_partners', {observe: 'response'});
  }
  // tslint:disable-next-line:typedef
  addOneRecord(createpartner: CreateBusinessPartnerDto): Observable<HttpResponse<User>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<User>(this.rootURL + '/business_partners', createpartner, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.partnerTableService.addRecordToTable(user.body);
      }));
  }

  deleteOneRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL}/business_partners/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.partnerTableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, updateUserDto: UpdateBussinessPartnerWithoutPassword): Observable<HttpResponse<User>> {
    const updateUrl = `${this.rootURL}/business_partners/${id}`;
    return this.http.patch<User>(updateUrl, updateUserDto, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.partnerTableService.updateTableRecord(Number(id), user.body);

      }));
  }
  // tslint:disable-next-line:typedef


  findRecordById(id: string): Observable<HttpResponse<User>> {
    const getUrl = `${this.rootURL}/business_partners/${id}`;
    return this.http.get<User>(getUrl, {observe: 'response'} );
  }

  findUserByEmail(email: string): Observable<boolean> {
    const getUrl = `${this.rootURL}/business_partners/emails/${email}`;
    return this.http.get<boolean>(getUrl);
  }
  findOtherUserByEmail(email: string, id: string): Observable<boolean>{
    const getUrl = `${this.rootURL}/business_partners/${id}/emails/${email}`;
    return this.http.get<boolean>(getUrl);
  }
  changeUserPasswordById(id: string, passwordData: CHangePasswordByAdminDto): Observable<HttpResponse<User>> {
    const url = `${this.rootURL}/business_partners/${id}/changePassword`;
    return this.http.patch<User>(url, passwordData, { observe: 'response'} );
  }
  blodkUserById(id: string, activeData: BlockUserDto): Observable<HttpResponse<User>> {
    const url = `${this.rootURL}/business_partners/${id}/blockOrUnblock`;
    return this.http.patch<User>(url, activeData, { observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((user) => {
        this.partnerTableService.updateTableRecord(Number(id), user.body);

      }));
  }
}
