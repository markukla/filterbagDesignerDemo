import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {MaterialBackendService} from './material-backend.service';
import {catchError, map} from 'rxjs/operators';
import {GeneralTableService} from '../../util/GeneralTableService/general-table.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateMaterialCodeUniqueService {
  constructor(private materialBackendService: MaterialBackendService,
              private materialTableService: GeneralTableService) {
    console.log(this.materialBackendService);
  }

  materialCodeValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.materialBackendService.findRecordBycode(ctrl.value).pipe(map(istaken => (istaken ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }

  materialNameValidator(): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.materialBackendService.findRecordByName(ctrl.value).pipe(map(istaken => (istaken ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }


  materialCodeValidatorForUpdate(selectedMaterialId: number): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.materialBackendService.findMaterialBycode({code: ctrl.value}).pipe(map
        (istaken => (istaken && istaken.id !== selectedMaterialId ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }

  materialNameValidatorForUpdate(selectedMaterialId: number): AsyncValidatorFn {
    return (
      ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      // tslint:disable-next-line:max-line-length
      return this.materialBackendService.findMaterialByName({name: ctrl.value}).pipe(map(istaken => (istaken && istaken.id !== selectedMaterialId ? {taken: true} : null)),
        catchError(() => of(null))
      );
    };
  }
}
