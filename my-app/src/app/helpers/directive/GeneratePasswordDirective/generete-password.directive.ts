import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {UserBackendService} from "../../../Users/UserServices/user-backend.service";
import {SearchService} from "../SearchDirective/search.service";
import {FormControl} from "@angular/forms";

@Directive({
  selector: '[appGeneretePassword]'
})
export class GeneretePasswordDirective {

  @Input('appGeneretePassword') passwordInput: FormControl;

  // tslint:disable-next-line:max-line-length

  constructor(private renderer: Renderer2,
              private targetElement: ElementRef,
              ) {
  }


    @HostListener('mouseenter')
    changeInputTypeToTextToMakeItVisavel () {
    this.renderer.setProperty(this.targetElement.nativeElement, 'type', 'text');
    }

  @HostListener('mouseleave')
  changeInputTypeTopasswordToHide () {
    this.renderer.setProperty(this.targetElement.nativeElement, 'type', 'password');
  }

}
