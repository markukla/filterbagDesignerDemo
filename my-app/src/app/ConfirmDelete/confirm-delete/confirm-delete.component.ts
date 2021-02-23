import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmDeleteServiceService} from "../confirm-delete-service.service";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";
import {generalNamesInSelectedLanguage} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {
  @Input()
  showConfirmDeleteWindow: boolean;
  confirmDeleteDescritpion: string;
  confirmDeleteButtonDescription: string;
  resignFromDeletingButtonDescription: string;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  @Output() deleteConfirmedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();

  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    setTabelColumnAndOtherNamesForSelectedLanguage(this.generalNamesInSelectedLanguage, this.authenticationService.vocabulariesInSelectedLanguage);
    this.confirmDeleteButtonDescription = this.generalNamesInSelectedLanguage.yes;
    this.confirmDeleteDescritpion = this.generalNamesInSelectedLanguage.confirmDeletingMessage;
    this.resignFromDeletingButtonDescription = this.generalNamesInSelectedLanguage.no;
  }
  confirmDeleteButtonAction(): void {
    this.showConfirmDeleteWindow = false;
    this.deleteConfirmedEvent.emit(true);
  }

  resignFromDeletingButtonAction(): void {
    this.showConfirmDeleteWindow = false;
    this.deleteConfirmedEvent.emit(false);
  }
}
