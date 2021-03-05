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

  @HostListener('dblclick')
// tslint:disable-next-line:typedef
  setValueOfPasswordFormControlToGeneeatedPassword() {
    this.passwordInput.setValue(this.generatePassword(10));

    }

    @HostListener('mouseenter')
    changeInputTypeToTextToMakeItVisavel () {
    this.renderer.setProperty(this.targetElement.nativeElement, 'type', 'text');
    }

  @HostListener('mouseleave')
  changeInputTypeTopasswordToHide () {
    this.renderer.setProperty(this.targetElement.nativeElement, 'type', 'password');
  }


  generatePassword(passwordLength) {
    var numberChars = "0123456789";
    var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lowerChars = "abcdefghijklmnopqrstuvwxyz";
    var allChars = numberChars + upperChars + lowerChars;
    var randPasswordArray = Array(passwordLength);
    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = numberChars;
    randPasswordArray = randPasswordArray.fill(allChars, 4);
    return this.shuffleArray(randPasswordArray.map(function(x) { return x[Math.floor(Math.random() * x.length)] })).join('');
  }


   shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }


}
