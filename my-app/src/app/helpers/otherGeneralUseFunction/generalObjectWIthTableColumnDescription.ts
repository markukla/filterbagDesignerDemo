export const generalNamesInSelectedLanguage = {
  search: '',
  deleteButtonInfo: '',
  updateButtonInfo: '',
  seeDrawing: '',
  seeHistory: '',
  operationAddSuccessStatusMessage: '',
  operationAddFailerStatusMessage: '',
  operationUpdateSuccessStatusMessage: '',
  operationUpdateFailerStatusMessage: '',
  operationDeleteSuccessStatusMessage: '',
  operationDeleteFailerStatusMessage: '',
  name: '',
  code: '',
  select: '',
  closeButtonDescription: '',
  thisFieldIsRequired: '',
  saveButtonDescription: '',
  addNewButtonDescription: '',
  quantity: '',
  addNamesInAllLanguages: '',
  selectDrawingToUpload: 'Wybierz rysunke do udostępnienia',
  selectingDrawingIsRequired: 'Wybranie rysunku jest wymagane',
  upload: 'Udostępnij',
  uploadingDrawingIsRequired: 'Udostępnienie rysunku jest wymagane',
  drawingAddedSuccessStatus: 'Dodano rysunek',
  drawingAddedFailerStatus: 'Wystąpił błąd nie udało się dodać rysunku',
  onlyPngFormatIsAllowed: 'tylko format .png jest dozwolony',
  wrongEmailOrPassword: 'Nieprawidłowy email lub hasło',
  yourAccountIsInactive: 'Nie możesz się zalogować, Twoje konto jest nieaktywne, skontaktuj się z administratorem',
  loginFailerStatus: 'Wystąpił błąd, logowanie niepomyślne',
  chooseLanguageVersion: 'Wybierz wersję językową, klikająć na flagę',
  logInButtonDescription: 'Zaloguj się',
  thisCodeIstaken: 'Ten kod jest już zajęty',
  thisNameIsTaken: 'Podana nazwa jest już zajęta',
  codeMustContain2Characters: 'Kod musi zawierać 2 znaki',
  otherRecordAlreadyExist: 'rekord który próbowałeś dodać już istnieję w bazie danych',
  otherRecordWithThisCodeAlreadyExist: 'inny rekord z podanym kodem już istnieje w bazie danych',
  otherRecordWithThisNameAlreadyExist: 'w bazie danych istnieje już inny rekord z podaną nazwą:',
  yes: 'Tak',
  no: 'Nie',
  confirmDeletingMessage: 'Czy na pewno chcesz usunąć wybrany element?',
  orders: 'Zapytania',
  partners: 'Parnterzy Handlowi',
  materials: 'Materiały',
  products: 'Produkty',
  users: 'Użytkownicy',
  dimensionCodes: 'Kody Wymiarów',
  languages: 'Języki',
  dictionary: 'Słownik',
  logout: 'Wyloguj',
  checkAll: 'Zaznacz Wszystkie',
  uncheckAll: 'Odznacz Wszystkie',
  giveMaterialDescriptionInAllLanguages: 'Podaj opis Materiału we wszystkich językach',
  materialDescription:'Opis Materiału',
  addMaterialDescriptionToDrawingTabel: 'Zaznacz aby dodać opis materiału do informacji na rysunku',
  or:'Lub',
  nameOfVariableInAplication: 'Nazwa Zmiennej w aplikacji',

  // added in production database but not in initialVocabularryToDatabase.ts
  addNewProductBlueprint: 'Dodaj nowy projekt produktu',
  numberOfDrawing: 'Nr rysunku',
  filtratingMaterial: 'Materiał Filtracyjny',
  allDimensionsInMilimeters: 'Wszystkie wymiary w milimetrach',
  addNewFraze: 'Dodaj Nową Frazę',
  language: 'Język',



/*  <a [routerLink]="['/orders']" routerLinkActive="active"> Zamówienia</a>
  <a [routerLink]="['/businessPartners']" routerLinkActive="active"> Partnerzy</a>
  <a [routerLink]="['/materials']" routerLinkActive="active"> Materialy</a>
  <a [routerLink]="['/products']" routerLinkActive="active"> Produkty</a>
     <a [routerLink]="['/users']" routerLinkActive="active"> Użytkownicy</a>
    <a [routerLink]="['/dimensionCodes']" routerLinkActive="active"> Kody Wymiarów</a>
    <a [routerLink]="['/languages']" routerLinkActive="active"> Języki </a>
     <a [routerLink]="['/vocabularies']" routerLinkActive="active"> Słownik</a>
     <a [routerLink]="['/changePasswordByLoggedUser']" routerLinkActive="active"> Zmień swoje hasło</a>
      <button (click)="this.authenticationService.logOut()"> Wyloguj</button>
  </span>

  </div>
  <div *ngIf="this.authenticationService.userRole && this.authenticationService.userRole === this.editor">
  <span>
     <a [routerLink]="['/orders']" routerLinkActive="active"> Zamówienia</a>
    <a [routerLink]="['/businessPartners']" routerLinkActive="active"> Partnerzy</a>
    <a [routerLink]="['/changePasswordByLoggedUser']" routerLinkActive="active"> Zmień swoje hasło</a>
    <button (click)="this.authenticationService.logOut()"> Wyloguj</button>*/


};

export const generalUserNames = {
  partnerCode: '',
  partnerCompanyName: '',
  addNewBusinessPartner: '',
  addNewUser: '',
  fullName: '',
  email: 'email',
  changePassword: '',
  blockUser: '',
  unblockUser: '',
  businessPartnerOrders: '',
  userStatusBlocked: '',
  userStatusActive: '',
  userHasBennBlockedMessage: '',
  userHasBeenUnblockedMessage: '',
  admins: '',
  editors: '',
  userAddSuccessStatusMessage: '',
  userAddFailerStatusMessage: '',
  userUpdateSuccessStatusMessage: '',
  userUpdateFailerStatusMessage: '',
  userDeleteSuccessStatusMessage: '',
  userDeleteFailerStatusMessage: '',
  partnerAddSuccessStatusMessage: '',
  partnerAddFailerStatusMessage: '',
  partnerUpdateSuccessStatusMessage: '',
  partnerUpdateFailerStatusMessage: '',
  partnerDeleteSuccessStatusMessage: '',
  partnerDeleteFailerStatusMessage: '',
  updateBusinessPartner: '',
  updateUser: '',
  emailIsAlreadyTaken: '',
  emailMustBeValid: '',
  passwordIsRequired: '',
  passwordMustContain8Characters: '',
  passwordMustContain1CapitalLetter: '',
  passwordMustContain2Digest: '',
  passwordMustContain1smallLetter: '',
  noMatchBetweenPasswords: '',
  repeatPassword: '',
  repeatingPasswordIsRequired: '',
  password: 'password',
  active: '',
  passwordChangeSuccessStatus: '',
  passwordChangeFailerStatus: '',
  admin: '',
  editor: '',
  status: '',
  changeYourPassword: 'Zmień swoje hasło',
  currentPassword: '',
  newPassword: '',
};

export const orderNames = {
  orderNumber: '',
  businessPartner: '',
  creator: '',
  index: '',
  date: '',
  createNewOrder: '',
  submitButtonNext: '',
  ChangeMaterialButtonInfo: '',
  ConfirmMaterial: '',
  ChangePartner: '',
  ConfirmPartner: '',
  ChangeProduct: '',
  ConfirmProduct: '',
  submitOrder: '',
  updateOrder: '',
  canNotFindProductForGivenParameters: '',
  orderAddSuccess: '',
  orderAddFailer: '',
  orderUpdateSuccess: '',
  orderUpdateFailer: '',
  orderDeleteSuccess: '',
  orderDeleteFailer: '',
  choosingOptionFromListIsRequires: '',
  choosingAndConfrimPartnerIsRequired: '',
  choosingAndConfirmProductIsRequired: '',
  choosingAndConfirmMaterialIsRequired: '',
  changeDrawingParameters: '',
  yourCommentToOrder: '',
  comments:'Uwagi:',
  businessPartnerName: 'Nazwa Parnera Handlowego',
  businessPartners: 'Partne Handlowy',
  productType: 'Typ Produktu',
  productTop: 'Wykończenie góra',
  productBottom: 'Wykończenie dół',
  pressButtonToChooseProductByDrawing: 'naciśnij przycisk aby wybrać product na podstawie rysunku',
  chooseProductByDrawingButtonDescription: 'Wybierz Product klikając na rysunek',
  chooseProductByParameters: ' Wybierz produkt określając parametry produktu',
  productMaterial: 'Materiał Produktu',
  addNewProductBottom: 'Dodaj nowe wykończenie dołu',
  addNewProductTop: 'Dodaj nowe wykończenie góry',
  addNewProductType: 'Dodaj nowy typ produktu',
  addNewProduct: '',
  updateProductBottom: '',
  updateProductTop: '',
  updateProductType: '',
  updateProduct: '',
  productBottomCode: '',
  productBottomName: '',
  productBottoms: 'Wykończenia Dna',
  productTops: 'Wykończenia Góry',
  productTopsCode: 'Kod Wykończenia Góry',
  productTopsName: 'Nazwa Wykończenia Góry',
  productTypes: 'Typy Produktów',
  productTypeCode: 'Kod Typu Produktu',
  productTypeName: 'Nazwa Typu Produktu',
  changeDrawing: 'Zmień Rysunek',
  allDimensionsMustBeUnique: 'Wszystkie wymiary muszą być unikalne, Wymiar ${input} został dodany więcej niż jeden raz',
  addFirstIndexDimension: 'Proszę dodać wymiar będący pierwszym wymiarem indeksu',
  addSecondIndexDimension: 'Proszę dodać wymiar będący drugim wymiarem do indeksu',
  tooManyFirstIndexDimensions: 'Dodałeś więcej niż jeden wymiar będący pierwszym wymiarem indeksu. Możesz dodać tylko jeden',
  tooManySecondIndexDimensions: 'Dodałeś więcej niż jeden wymiar będący drugim wymiarem indeksu. Możesz dodać tylko jeden',
  giveValuesToAllDimension: 'Prosze podać wartość dla wymiaru: ',
  giveValueOfWorkingTemperature: 'Prosze podać wartość temperatury pracy',
  setWorkignSide: 'Prosze zaznaczyć stronę pracującą',
  fillFormToCreateDimension: 'Wypełnij formularz aby utworzyć wymiar',
  pressAndHoldLeftMouseButtonToDrag: 'Po utworzeniu: złap i przytrzymaj lewym przyciskiem aby przeciągnąc',
  toRotateOrChangeSize: 'Aby obrócić lub zmienić rozmiar',
  rightClickOnDrawing: 'naciśnij prawym przyciskiem na rysunku poza wymiarem',
  dubleLeftClicToRotate: 'aby obrócić naciśnij dwukrotnie lewym przyciskiem na wymiar',
  useActiveCornerToChangeSieze: 'aby zmienić rozmiar użyj aktywnego naroznika',
  afterEditionRightClickTOenableDragging: 'po edycjj wymiaru naciśnij prawym przyciskiem poza wymiarem żeby ponownie uaktywnić tryb przeciągania',
  rightCLickOnDimensionToRemove: 'aby usunąc wymiar najedź na niego kursorem i naciśnij prawym przyciskiem myszy',

  confirmButtonDescription: 'Zatwierdź',
  printButtonDescription:   'Drukuj',
  saveToPdfButtonDescription: 'Zapisz do pdf',
  addProduct: 'Dodaj Produkt',
  backButtonDescription: 'Wstecz',
  create: 'Utwórz',
  dimension: 'Wymiar',
  rotateTable: 'Obróć Tabelę',
  changeDrawingSize: 'Zmień Rozmiar Rysunku',
  considerDeletingProducts: 'Uwaga Istnieją produkty z wykończeniem góry/ dna /typem produktu, które chcesz usunąc. Rozważ usunięcię tych produktów z ich głównej tabeli, żeby zachować spójność danych.',
  Form: 'Formularz',
  deleteConnectedProducts:'Zaznacz jeśli chcesz usunąc powiązane produkty',

  indexAlreadyExistsForOtherOrderNumber:'Utworzony indeks już istnieje dla innego numeru zamówienia',
  canNotCreateOrderZLetterReached:'Nie można utworzyć nowego zapytania- nie można utworzyć nowej wersji indeksu, osiągnięto maksymalne oznaczenie wersji indeksu Z',
  newIndexWillBeCreatedWithNextVersionLetter:'Zostanie utworzony inny indeks z kolejną dostępną literą w alfabecie jako oznaczeniem wersji:'



};

export const drawingTableFormNames = {
  workingTemperature: '',
  antielectrostatic: '',
  workingSide: '',
  workingSideExternal: '',
  workingSideInternal: '',
  material: '',

};
export const dimensionNames = {
  dimensionCode: 'Kod wymiaru',
  dimensionRole: 'Rola wymiaru',
  dimensionRoleFirstIndex: 'Pierwszy wymiar indeksu',
  dimensionRoleSecondIndex: 'Drugi wymiar indeksu',
  dimensionRoleNoIndex: 'Wymiar nie wchcodzący do indeksu',
  dimensionName:'',
  selectDimensionRole: ''

}
export const languageNames = {
  languageCode: 'Kod Języka',
  languageName: 'Nazwa Języka',
  flag: 'Flaga',

}

export const materialNamesInSelectedLanguage = {
  materialCode: '',
  materialName: '',
  addNewMaterial: '',
  updateMaterial: '',
  quantity: '',
  search: '',
  materialCodeMustContain6CHaracters: ''
};
