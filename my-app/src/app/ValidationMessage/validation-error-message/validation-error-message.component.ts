import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from "../../LoginandLogOut/AuthenticationServices/authentication.service";

@Component({
  selector: 'app-validation-error-message',
  templateUrl: './validation-error-message.component.html',
  styleUrls: ['./validation-error-message.component.css']
})
export class ValidationErrorMessageComponent implements OnInit {
  @Input()
  userInputErrorsMessages: string[];
  @Output()
  confirmButtonClickedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  confirmButtonDescription: string
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.confirmButtonDescription = this.authService.orderNamesInSelectedLanguage.confirmButtonDescription;
  }

  confirmButtonAction(): void {
    this.confirmButtonClickedEvent.emit(true);
  }

}
