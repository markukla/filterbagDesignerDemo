import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmDeleteServiceService} from "../confirm-delete-service.service";
import {setTabelColumnAndOtherNamesForSelectedLanguage} from "../../helpers/otherGeneralUseFunction/getNameInGivenLanguage";
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";
import {
  generalNamesInSelectedLanguage,
  orderNames
} from "../../helpers/otherGeneralUseFunction/generalObjectWIthTableColumnDescription";

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {
  @Input()
  showConfirmDeleteWindow: boolean;
  @Input()
  showconsiderDeletingProducts: boolean;
  confirmDeleteDescritpion: string;
  confirmDeleteButtonDescription: string;
  resignFromDeletingButtonDescription: string;
  operationFailerStatusMessage: string;
  operationSuccessStatusMessage: string;
  generalNamesInSelectedLanguage = generalNamesInSelectedLanguage;
  orderNames = orderNames;
  @Output() deleteConfirmedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  allowProductRemoval: boolean;
  @Output() deleteProductConfirmedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.initColumnNamesInSelectedLanguage();

  }
  initColumnNamesInSelectedLanguage(): void {
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:max-line-length
    this.orderNames = this.authenticationService.orderNamesInSelectedLanguage;
    this.generalNamesInSelectedLanguage = this.authenticationService.generalNamesInSelectedLanguage;;
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
  emitProductRemovalAllowed(): void {
    if(this.allowProductRemoval) {
      this.deleteProductConfirmedEvent.emit(true);
    }
  }
}
