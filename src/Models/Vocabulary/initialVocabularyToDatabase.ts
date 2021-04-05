import {Column} from "typeorm";
import LocalizedName from "../LocalizedName/localizedName.entity";
import Vocabulary from "./vocabulary.entity";
const initialVocabularyForDatabase: Vocabulary[] = [];

const materialTable1: Vocabulary = {
    variableName : 'materialCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod Materiału'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(materialTable1);
const materialTable2: Vocabulary = {
    variableName: 'materialName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Materiału'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(materialTable2);
const materialTable3: Vocabulary = {
    variableName: 'addNewMaterial',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj Nowy Materiał'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(materialTable3);

const materialTable4: Vocabulary = {
    variableName: 'materialCodeMustContain6CHaracters',
    localizedNames: [new LocalizedName({id:1}, 'Kod materiału musi zawierać 6 znaków'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(materialTable4);

const materialTable5: Vocabulary = {
    variableName: 'updateMaterial',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj Materiał'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(materialTable5);




const generalTable1: Vocabulary = {
    variableName: 'quantity',
    localizedNames: [new LocalizedName({id:1}, 'Ilość'), new LocalizedName({id:2}, 'Ilość po czesku')]
}
initialVocabularyForDatabase.push(generalTable1);
const generalTable2: Vocabulary = {
    variableName: 'search',
    localizedNames: [new LocalizedName({id:1}, 'Wyszukaj'), new LocalizedName({id:2}, 'Wyszukaj po czesku')]
}
initialVocabularyForDatabase.push(generalTable2)
const generalTable3: Vocabulary = {
    variableName: 'deleteButtonInfo',
    localizedNames: [new LocalizedName({id:1}, 'Usuń'), new LocalizedName({id:2}, 'Usuń po czesku')]
}
initialVocabularyForDatabase.push(generalTable3);
const generalTable4: Vocabulary = {
    variableName: 'updateButtonInfo',
    localizedNames: [new LocalizedName({id:1}, 'Modyfikuj'), new LocalizedName({id:2}, 'Modyfikuj po czesku')]
}
initialVocabularyForDatabase.push(generalTable4);
const generalTable5: Vocabulary = {
    variableName: 'operationAddSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Dodano nowy rekord do bazy danych'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalTable5);
const generalTable6: Vocabulary = {
    variableName: 'operationAddFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Nie udało się dodać nowego rekordu do bazy danych'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable6);


const generalTable7: Vocabulary = {
    variableName: 'operationUpdateSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Pomyślnie zaktualizowano wybrany rekord w bazie danych'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalTable7);
const generalTable8: Vocabulary = {
    variableName: 'operationUpdateFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Nie udało się zaktualizować wybranego rekordu w bazie danych'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable8);

const generalTable9: Vocabulary = {
    variableName: 'operationDeleteSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Usunięto wybrany rekord'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalTable9);
const generalTable10: Vocabulary = {
    variableName: 'operationDeleteFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Nie udało się usunąć wybranego rekordu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable10);
const generalTable11: Vocabulary = {
    variableName: 'name',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable11);
const generalTable12: Vocabulary = {
    variableName: 'seeDrawing',
    localizedNames: [new LocalizedName({id:1}, 'Zobacz Rysunek'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable12);
const generalTable13: Vocabulary = {
    variableName: 'seeHistory',
    localizedNames: [new LocalizedName({id:1}, 'Zobacz Historię'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable13);

const generalTable14: Vocabulary = {
    variableName: 'code',
    localizedNames: [new LocalizedName({id:1}, 'Kod'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable14);

const generalTable15: Vocabulary = {
    variableName: 'select',
    localizedNames: [new LocalizedName({id:1}, 'Wybierz'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable15);
const generalTable16: Vocabulary = {
    variableName: 'closeButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Zamknij'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable16);
const generalTable17: Vocabulary = {
    variableName: 'thisFieldIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'To pole jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable17);

const generalTable18: Vocabulary = {
    variableName: 'saveButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Zapisz'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable18);

const generalTable19: Vocabulary = {
    variableName: 'addNewButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj Nowy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable19);

const generalTable21: Vocabulary = {
    variableName: 'addNamesInAllLanguages',
    localizedNames: [new LocalizedName({id:1}, 'Podaj nazwy we wszystkich językach'), new LocalizedName({id:2}, '{id:2} ....')]
}

initialVocabularyForDatabase.push(generalTable21);

const generalTable22: Vocabulary = {
    variableName: 'selectDrawingToUpload',
    localizedNames: [new LocalizedName({id:1}, 'Wybierz rysunke do udostępnienia'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable22);

const generalTable23: Vocabulary = {
    variableName: 'selectingDrawingIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Wybranie rysunku jest wymagane'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable23);

const generalTable24: Vocabulary = {
    variableName: 'upload',
    localizedNames: [new LocalizedName({id:1}, 'Udostępnij'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable24);

const generalTable25: Vocabulary = {
    variableName: 'uploadingDrawingIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Udostępnienie rysunku jest wymagane'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable25);


const generalTable26: Vocabulary = {
    variableName: 'drawingAddedSuccessStatus',
    localizedNames: [new LocalizedName({id:1}, 'Dodano rysunek'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable26);

const generalTable27: Vocabulary = {
    variableName: 'drawingAddedFailerStatus',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd nie udało się dodać rysunku'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable27);

const generalTable28: Vocabulary = {
    variableName: 'onlyPngFormatIsAllowed',
    localizedNames: [new LocalizedName({id:1}, 'tylko format .png jest dozwolony'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable28);

const generalTable29: Vocabulary = {
    variableName: 'thisCodeIstaken',
    localizedNames: [new LocalizedName({id:1}, 'Podany kod jest już zajęty'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable29);

const generalTable30: Vocabulary = {
    variableName: 'thisNameIsTaken',
    localizedNames: [new LocalizedName({id:1}, 'Podana nazwa jest już zajęta'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable30);

const generalTable32: Vocabulary = {
    variableName: 'codeMustContain2Characters',
    localizedNames: [new LocalizedName({id:1}, 'Kod musi zawierać 2 znaki.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable32);

const generalTable33: Vocabulary = {
    variableName: 'otherRecordAlreadyExist',
    localizedNames: [new LocalizedName({id:1}, 'rekord który próbowałeś dodać już istnieję w bazie danych'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable33);

const generalTable34: Vocabulary = {
    variableName: 'otherRecordWithThisCodeAlreadyExist',
    localizedNames: [new LocalizedName({id:1}, 'inny rekord z podanym kodem już istnieje w bazie danych'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable34);

const generalTable35: Vocabulary = {
    variableName: 'otherRecordWithThisNameAlreadyExist',
    localizedNames: [new LocalizedName({id:1}, 'w bazie danych istnieje już inny rekord z podaną nazwą:'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable35);

const generalTable36: Vocabulary = {
    variableName: 'yes',
    localizedNames: [new LocalizedName({id:1}, 'Tak'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable36);

const generalTable37: Vocabulary = {
    variableName: 'no',
    localizedNames: [new LocalizedName({id:1}, 'Nie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable37);

const generalTable38: Vocabulary = {
    variableName: 'confirmDeletingMessage',
    localizedNames: [new LocalizedName({id:1}, 'Czy na pewno chcesz usunąć wybrany element?'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable38);

const generalTable39: Vocabulary = {
    variableName: 'orders',
    localizedNames: [new LocalizedName({id:1}, 'Zamówienia'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable39);

const generalTable40: Vocabulary = {
    variableName: 'partners',
    localizedNames: [new LocalizedName({id:1}, 'Parnterzy Handlowi'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable40);

const generalTable41: Vocabulary = {
    variableName: 'materials',
    localizedNames: [new LocalizedName({id:1}, 'Materiały'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable41);

const generalTable42: Vocabulary = {
    variableName: 'products',
    localizedNames: [new LocalizedName({id:1}, 'Produkty'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable42);

const generalTable43: Vocabulary = {
    variableName: 'users',
    localizedNames: [new LocalizedName({id:1}, 'Użytkownicy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable43);

const generalTable44: Vocabulary = {
    variableName: 'dimensionCodes',
    localizedNames: [new LocalizedName({id:1}, 'Kody Wymiarów'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable44);

const generalTable45: Vocabulary = {
    variableName: 'languages',
    localizedNames: [new LocalizedName({id:1}, 'Języki'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable45);

const generalTable46: Vocabulary = {
    variableName: 'dictionary',
    localizedNames: [new LocalizedName({id:1}, 'Słownik'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable46);

const generalTable47: Vocabulary = {
    variableName: 'logout',
    localizedNames: [new LocalizedName({id:1}, 'Wyloguj'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable47);


const generalTable48: Vocabulary = {
    variableName: 'rotateTable',
    localizedNames: [new LocalizedName({id:1}, 'Obróć Tabelę'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable48);

const generalTable49: Vocabulary = {
    variableName: 'changeDrawingSize',
    localizedNames: [new LocalizedName({id:1}, 'Zmień rozmiar rysunku'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable49);

const generalTable50: Vocabulary = {
    variableName: 'considerDeletingProducts',
    localizedNames: [new LocalizedName({id:1}, 'Uwaga Istnieją produkty z wykończeniem góry/ dna, które chcesz usunąc. Rozważ usunięcię tych produktów z ich głównej tabeli, żeby zachować spójność danych.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable50);

const generalTable51: Vocabulary = {
    variableName: 'Form',
    localizedNames: [new LocalizedName({id:1}, 'Formularz'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable51);

const generalTable52: Vocabulary = {
    variableName: 'deleteConnectedProducts',
    localizedNames: [new LocalizedName({id:1}, 'Zaznacz jeśli chcesz usunąć powiązane produkty'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable52);

const generalTable53: Vocabulary = {
    variableName: 'checkAll',
    localizedNames: [new LocalizedName({id:1}, 'Zaznacz Wszystkie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable53);

const generalTable54: Vocabulary = {
    variableName: 'uncheckAll',
    localizedNames: [new LocalizedName({id:1}, 'Odznacz Wszystkie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalTable54);















const generalUser1: Vocabulary = {
    variableName: 'partnerCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod parntera handlowego'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser1)
const generalUser2: Vocabulary = {
    variableName: 'partnerCompanyName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Partnera Handlowego'), new LocalizedName({id:2}, '{id:2} ....')]
}
const generalUser3: Vocabulary = {
    variableName: 'addNewBusinessPartner',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj nowego Partnera Handlowego'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser3)
const generalUser4: Vocabulary = {
    variableName: 'addNewUser',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj nowego użytkownika'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser4)

const generalUser5: Vocabulary = {
    variableName: 'fullName',
    localizedNames: [new LocalizedName({id:1}, 'Imię i nazwisko'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser5)
const generalUser6: Vocabulary = {
    variableName: 'email',
    localizedNames: [new LocalizedName({id:1}, 'email'), new LocalizedName({id:2}, 'email')]
}
initialVocabularyForDatabase.push(generalUser6)

const generalUser7: Vocabulary = {
    variableName: 'changePassword',
    localizedNames: [new LocalizedName({id:1}, 'Zmień Hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser7)
const generalUser8: Vocabulary = {
    variableName: 'blockUser',
    localizedNames: [new LocalizedName({id:1}, 'Zablokuj Użytkownika'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser8)
const generalUser9: Vocabulary = {
    variableName: 'unblockUser',
    localizedNames: [new LocalizedName({id:1}, 'Odblokuj użytkownika'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser9)
const generalUser10: Vocabulary = {
    variableName: 'businessPartnerOrders',
    localizedNames: [new LocalizedName({id:1}, 'Zapytania o indeks worka'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser10)

const generalUser11: Vocabulary = {
    variableName: 'userStatusBlocked',
    localizedNames: [new LocalizedName({id:1}, 'Zablokowany'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser11)
const generalUser12: Vocabulary = {
    variableName: 'userStatusActive',
    localizedNames: [new LocalizedName({id:1}, 'Aktywny'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser12)

const generalUser13: Vocabulary = {
    variableName: 'userHasBennBlockedMessage',
    localizedNames: [new LocalizedName({id:1}, 'Użytkownik został zablokowany'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser13)
const generalUser14: Vocabulary = {
    variableName: 'userHasBeenUnblockedMessage',
    localizedNames: [new LocalizedName({id:1}, 'Użytkownik został odblokowany'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser14)
const generalUser15: Vocabulary = {
    variableName: 'admins',
    localizedNames: [new LocalizedName({id:1}, 'Administatorzy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser15)
const generalUser16: Vocabulary = {
    variableName: 'editors',
    localizedNames: [new LocalizedName({id:1}, 'Edytorzy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser16)

const generalUser17: Vocabulary = {
    variableName: 'userAddSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Dodano nowego użytkownika.'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(generalUser17);
const generalUser18: Vocabulary = {
    variableName: 'userAddFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd,  nie udało się dodać nowego użytkownika.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser18);


const generalUser19: Vocabulary = {
    variableName: 'userUpdateSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Pomyślnie zaktualizowano dane wybranego użytkownika.'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalUser19);
const generalUser20: Vocabulary = {
    variableName: 'userUpdateFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, nie udało się zaktualizować danych użytkownika.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser20);

const generalUser21: Vocabulary = {
    variableName: 'userDeleteSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Usunięto wybranego użytkownika.'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalUser21);
const generalUser22: Vocabulary = {
    variableName: 'userDeleteFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, nie udało się usunać wybranego użytkownika.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser22);

const generalUser23: Vocabulary = {
    variableName: 'partnerAddSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Dodano nowego Partnera Handlowego.'), new LocalizedName({id:2}, 'Cze...')]
}
initialVocabularyForDatabase.push(generalUser23);
const generalUser24: Vocabulary = {
    variableName: 'partnerAddFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd,  nie udało się dodać nowego Partnera Handlowego.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser24);


const generalUser25: Vocabulary = {
    variableName: 'partnerUpdateSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Pomyślnie zaktualizowano dane wybranego Partnera Handlowego.'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalUser25);
const generalUser26: Vocabulary = {
    variableName: 'partnerUpdateFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, nie udało się zaktualizować danych Partnera Handlowego.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser26);

const generalUser27: Vocabulary = {
    variableName: 'partnerDeleteSuccessStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Usunięto wybranego Partnera Handlowego.'), new LocalizedName({id:2}, 'Dodano nowy rekord do bazy danych po czesku')]
}
initialVocabularyForDatabase.push(generalUser27);
const generalUser28: Vocabulary = {
    variableName: 'partnerDeleteFailerStatusMessage',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, nie udało się usunać wybranego Partnera Handlowego.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser28);

const generalUser29: Vocabulary = {
    variableName: 'updateBusinessPartner',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj dane wybranego partnera handlowego.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser29);

const generalUser30: Vocabulary = {
    variableName: 'updateUser',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj dane wybranego użytkownika.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser30);
const generalUser31: Vocabulary = {
    variableName: 'emailIsAlreadyTaken',
    localizedNames: [new LocalizedName({id:1}, 'Podany email jest zajęty przez innego użytkownika.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser31);

const generalUser32: Vocabulary = {
    variableName: 'emailMustBeValid',
    localizedNames: [new LocalizedName({id:1}, 'Email musi być prawidłowym adresem email.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser32);

const generalUser33: Vocabulary = {
    variableName: 'passwordIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Podanie hasła jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser33);

const generalUser34: Vocabulary = {
    variableName: 'passwordMustContain8Characters',
    localizedNames: [new LocalizedName({id:1}, 'Hasło musi zawierać minimum 8 znaków.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser34);

const generalUser35: Vocabulary = {
    variableName: 'passwordMustContain1CapitalLetter',
    localizedNames: [new LocalizedName({id:1}, 'Hasło musi zawierać przynajmniej jedną dużą literę..'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser35);

const generalUser36: Vocabulary = {
    variableName: 'passwordMustContain2Digest',
    localizedNames: [new LocalizedName({id:1}, 'Hasło musi zawierać co najmniej 2 cyfry.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser36);

const generalUser37: Vocabulary = {
    variableName: 'passwordMustContain1smallLetter',
    localizedNames: [new LocalizedName({id:1}, 'Hasło musi zawierać co najmniej jedną małą literę.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser37);

const generalUser38: Vocabulary = {
    variableName: 'noMatchBetweenPasswords',
    localizedNames: [new LocalizedName({id:1}, 'Podane hasła są niezgodne.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser38);

const generalUser39: Vocabulary = {
    variableName: 'repeatPassword',
    localizedNames: [new LocalizedName({id:1}, 'Powtórz hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser39);

const generalUser40: Vocabulary = {
    variableName: 'repeatingPasswordIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Powtórzenie hasła jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser40);

const generalUser41: Vocabulary = {
    variableName: 'password',
    localizedNames: [new LocalizedName({id:1}, 'Hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser41);

const generalUser42: Vocabulary = {
    variableName: 'active',
    localizedNames: [new LocalizedName({id:1}, 'Aktywny'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser42);

const generalUser43: Vocabulary = {
    variableName: 'passwordChangeSuccessStatus',
    localizedNames: [new LocalizedName({id:1}, 'Hasło zostało zmienione.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser43);

const generalUser44: Vocabulary = {
    variableName: 'passwordChangeFailerStatus',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, nie udało się zmienić hasła.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser44);

const generalUser45: Vocabulary = {
    variableName: 'admin',
    localizedNames: [new LocalizedName({id:1}, 'Administator'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser45);

const generalUser46: Vocabulary = {
    variableName: 'editor',
    localizedNames: [new LocalizedName({id:1}, 'Edytor'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser46);

const generalUser47: Vocabulary = {
    variableName: 'status',
    localizedNames: [new LocalizedName({id:1}, 'Status'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser47);

const generalUser48: Vocabulary = {
    variableName: 'changeYourPassword',
    localizedNames: [new LocalizedName({id:1}, 'Zmień swoje hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser48);

const generalUser49: Vocabulary = {
    variableName: 'currentPassword',
    localizedNames: [new LocalizedName({id:1}, 'Aktualne hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser49);

const generalUser50: Vocabulary = {
    variableName: 'newPassword',
    localizedNames: [new LocalizedName({id:1}, 'Nowe hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser50);

const generalUser51: Vocabulary = {
    variableName: 'wrongEmailOrPassword',
    localizedNames: [new LocalizedName({id:1}, 'Nieprawidłowy email lub hasło'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser51);

const generalUser52: Vocabulary = {
    variableName: 'yourAccountIsInactive',
    localizedNames: [new LocalizedName({id:1}, 'Nie możesz się zalogować, Twoje konto jest nieaktywne, skontaktuj się z administratorem'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser52);

const generalUser53: Vocabulary = {
    variableName: 'loginFailerStatus',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, logowanie niepomyślne'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser53);

const generalUser54: Vocabulary = {
    variableName: 'chooseLanguageVersion',
    localizedNames: [new LocalizedName({id:1}, 'Wybierz wersję językową, klikająć na flagę wybranego kraju.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser54);

const generalUser55: Vocabulary = {
    variableName: 'logInButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Zaloguj'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(generalUser55);










const orderName1: Vocabulary = {
    variableName: 'orderNumber',
    localizedNames: [new LocalizedName({id:1}, 'Nr Zapytania'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName1)
const orderName2: Vocabulary = {
    variableName: 'creator',
    localizedNames: [new LocalizedName({id:1}, 'Opracował'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName2)
const orderName3: Vocabulary = {
    variableName: 'index',
    localizedNames: [new LocalizedName({id:1}, 'Indeks'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName3)
const orderName4: Vocabulary = {
    variableName: 'date',
    localizedNames: [new LocalizedName({id:1}, 'Data'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName4)
const orderName5: Vocabulary = {
    variableName: 'createNewOrder',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj Nowe Zapytanie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName5)
const orderName6: Vocabulary = {
    variableName: 'businessPartner',
    localizedNames: [new LocalizedName({id:1}, 'Partner Handlowy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName6)

const orderName7: Vocabulary = {
    variableName: 'submitButtonNext',
    localizedNames: [new LocalizedName({id:1}, 'Dalej'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName7)
const orderName8: Vocabulary = {
    variableName: 'ChangeMaterialButtonInfo',
    localizedNames: [new LocalizedName({id:1}, 'Zmień materiał'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName8)
const orderName9: Vocabulary = {
    variableName: 'ConfirmMaterial',
    localizedNames: [new LocalizedName({id:1}, 'Zatwierdź materiał'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName9)
const orderName10: Vocabulary = {
    variableName: 'ChangePartner',
    localizedNames: [new LocalizedName({id:1}, 'Zmień Partnera Handlowego'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName10)
const orderName11: Vocabulary = {
    variableName: 'ConfirmPartner',
    localizedNames: [new LocalizedName({id:1}, 'Zatwierdź Partnera Handlowego'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName11)
const orderName12: Vocabulary = {
    variableName: 'ChangeProduct',
    localizedNames: [new LocalizedName({id:1}, 'Zmień parametry produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName12)

const orderName13: Vocabulary = {
    variableName: 'ConfirmProduct',
    localizedNames: [new LocalizedName({id:1}, 'Zatwierdź parametry produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName13)
const orderName14: Vocabulary = {
    variableName: 'submitOrder',
    localizedNames: [new LocalizedName({id:1}, 'Złóż zapytanie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName14)
const orderName15: Vocabulary = {
    variableName: 'updateOrder',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj zapytanie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName15)
const orderName16: Vocabulary = {
    variableName: 'canNotFindProductForGivenParameters',
    localizedNames: [new LocalizedName({id:1}, 'Nie znaleziono produktu o podanych parametrach.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName16)
const orderName17: Vocabulary = {
    variableName: 'orderAddSuccess',
    localizedNames: [new LocalizedName({id:1}, 'Utworzono nowe zapytanie.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName17)
const orderName18: Vocabulary = {
    variableName: 'orderAddFailer',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił bląd, nie udało się dodać nowego zapytania.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName18)

const orderName19: Vocabulary = {
    variableName: 'orderUpdateSuccess',
    localizedNames: [new LocalizedName({id:1}, 'Zaktualizowano wybrane zapytanie'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName19)
const orderName20: Vocabulary = {
    variableName: 'orderUpdateFailer',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd nie udało się zaktualizować zapytania.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName20)
const orderName21: Vocabulary = {
    variableName: 'orderDeleteSuccess',
    localizedNames: [new LocalizedName({id:1}, 'Usunięto wybrane zapytanie.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName21)
const orderName22: Vocabulary = {
    variableName: 'orderDeleteFailer',
    localizedNames: [new LocalizedName({id:1}, 'Wystąpił błąd, nie udało się usunąć wybranego zapytania.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName22)
const orderName23: Vocabulary = {
    variableName: 'choosingOptionFromListIsRequires',
    localizedNames: [new LocalizedName({id:1}, 'Wybranie opcji z listy jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName23)
const orderName24: Vocabulary = {
    variableName: 'choosingAndConfrimPartnerIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Wybranie i zatwierdzenie Partnera Handlowego jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName24)
const orderName25: Vocabulary = {
    variableName: 'choosingAndConfirmProductIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Wybranie i zatwierdzenie produktu jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName25)
const orderName26: Vocabulary = {
    variableName: 'choosingAndConfirmMaterialIsRequired',
    localizedNames: [new LocalizedName({id:1}, 'Wybranie i zatwierdzenie materiału jest wymagane.'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName26)
const orderName27: Vocabulary = {
    variableName: 'changeDrawingParameters',
    localizedNames: [new LocalizedName({id:1}, 'Zmień wymiary produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName27)
const orderName28: Vocabulary = {
    variableName: 'yourCommentToOrder',
    localizedNames: [new LocalizedName({id:1}, 'Twoje uwagi do zamówienia'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName28)
const orderName29: Vocabulary = {
    variableName: 'businessPartnerName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Partnera Handlowego'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName29)

const orderName31: Vocabulary = {
    variableName: 'productType',
    localizedNames: [new LocalizedName({id:1}, 'Typ produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName31)
const orderName32: Vocabulary = {
    variableName: 'productTop',
    localizedNames: [new LocalizedName({id:1}, 'Wykończenie Góry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName32)
const orderName33: Vocabulary = {
    variableName: 'productBottom',
    localizedNames: [new LocalizedName({id:1}, 'Wykończenie Dna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName33)
const orderName34: Vocabulary = {
    variableName: 'pressButtonToChooseProductByDrawing',
    localizedNames: [new LocalizedName({id:1}, 'Naciśńij przycisk aby wybrać produkt na podstawie rysunku'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName34)
const orderName35: Vocabulary = {
    variableName: 'chooseProductByDrawingButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Wybierz produkt klikając na rysunek'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName35)
const orderName36: Vocabulary = {
    variableName: 'chooseProductByParameters',
    localizedNames: [new LocalizedName({id:1}, 'Wybierz produkt określając jego parametry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName36)

const orderName37: Vocabulary = {
    variableName: 'productMaterial',
    localizedNames: [new LocalizedName({id:1}, 'Materiał produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName37)

const orderName38: Vocabulary = {
    variableName: 'updateProductBottom',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj wykończenie dna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName38)

const orderName39: Vocabulary = {
    variableName: 'updateProductTop',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj wykończenie góry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName39)

const orderName40: Vocabulary = {
    variableName: 'updateProductType',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj typ produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName40)

const orderName41: Vocabulary = {
    variableName: 'addNewProductBottom',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj nowe wykończenie dna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName41)

const orderName42: Vocabulary = {
    variableName: 'addNewProductTop',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj nowe wykończenie góry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName42)

const orderName43: Vocabulary = {
    variableName: 'addNewProductType',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj nowy typ produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName43)

const orderName44: Vocabulary = {
    variableName: 'addNewProduct',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj nowy produkt'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName44)

const orderName45: Vocabulary = {
    variableName: 'updateProduct',
    localizedNames: [new LocalizedName({id:1}, 'Aktualizuj produkt'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName45)

const orderName46: Vocabulary = {
    variableName: 'productBottomCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod Wykończenia Dna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName46)

const orderName47: Vocabulary = {
    variableName: 'productBottomName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Wykończenia Dna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName47)

const orderName48: Vocabulary = {
    variableName: 'productBottoms',
    localizedNames: [new LocalizedName({id:1}, 'Wykończenia Dna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName48)

const orderName49: Vocabulary = {
    variableName: 'productTops',
    localizedNames: [new LocalizedName({id:1}, 'Wykończenia Góry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName49)

const orderName50: Vocabulary = {
    variableName: 'productTopsCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod Wykończenia Góry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName50)

const orderName51: Vocabulary = {
    variableName: 'productTopsName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Wykończenia Góry'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName51)

const orderName52: Vocabulary = {
    variableName: 'productTypes',
    localizedNames: [new LocalizedName({id:1}, 'Typy Produktów'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName52)

const orderName53: Vocabulary = {
    variableName: 'productTypeCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod Typu Produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName53)

const orderName54: Vocabulary = {
    variableName: 'productTypeName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Typu Produktu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName54)

const orderName55: Vocabulary = {
    variableName: 'changeDrawing',
    localizedNames: [new LocalizedName({id:1}, 'Zmień Rysunek'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName55)


const orderName56: Vocabulary = {
    variableName: 'fillFormToCreateDimension',
    localizedNames: [new LocalizedName({id:1}, 'Wypełnij formularz aby utworzyć wymiar'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName56)

const orderName57: Vocabulary = {
    variableName: 'pressAndHoldLeftMouseButtonToDrag',
    localizedNames: [new LocalizedName({id:1}, 'Po utworzeniu: złap i przytrzymaj lewym przyciskiem aby przeciągnąc'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName57)

const orderName58: Vocabulary = {
    variableName: 'toRotateOrChangeSize',
    localizedNames: [new LocalizedName({id:1}, 'Aby obrócić lub zmienić rozmiar'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName58)

const orderName59: Vocabulary = {
    variableName: 'rightClickOnDrawing',
    localizedNames: [new LocalizedName({id:1}, 'naciśnij prawym przyciskiem na rysunku poza wymiarem'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName59)

const orderName60: Vocabulary = {
    variableName: 'dubleLeftClicToRotate',
    localizedNames: [new LocalizedName({id:1}, 'aby obrócić naciśnij dwukrotnie lewym przyciskiem na wymiar'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName60)

const orderName61: Vocabulary = {
    variableName: 'useActiveCornerToChangeSieze',
    localizedNames: [new LocalizedName({id:1}, 'aby zmienić rozmiar użyj aktywnego naroznika'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName61)

const orderName62: Vocabulary = {
    variableName: 'afterEditionRightClickTOenableDragging',
    localizedNames: [new LocalizedName({id:1}, 'po edycjj wymiaru naciśnij prawym przyciskiem poza wymiarem żeby ponownie uaktywnić tryb przeciągania'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName62)

const orderName63: Vocabulary = {
    variableName: 'rightCLickOnDimensionToRemove',
    localizedNames: [new LocalizedName({id:1}, 'aby usunąc wymiar najedź na niego kursorem i naciśnij prawym przyciskiem myszy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName63)

const orderName64: Vocabulary = {
    variableName: 'giveValuesToAllDimension',
    localizedNames: [new LocalizedName({id:1}, 'Prosze podać wartości wszystkich wymiarów'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName64)

const orderName65: Vocabulary = {
    variableName: 'giveValueOfWorkingTemperature',
    localizedNames: [new LocalizedName({id:1}, 'Prosze podać wartość temperatury pracy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName65)

const orderName66: Vocabulary = {
    variableName: 'setWorkignSide',
    localizedNames: [new LocalizedName({id:1}, 'Prosze zaznaczyć stronę pracującą'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName66)

const orderName67: Vocabulary = {
    variableName: 'allDimensionsMustBeUnique',
    localizedNames: [new LocalizedName({id:1}, 'Wszystkie wymiary muszą być unikalne, więcej niż jeden raz dodano wymiar: '), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName67)

const orderName68: Vocabulary = {
    variableName: 'addFirstIndexDimension',
    localizedNames: [new LocalizedName({id:1}, 'Proszę dodać wymiar będący pierwszym wymiarem indeksu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName68)

const orderName69: Vocabulary = {
    variableName: 'addSecondIndexDimension',
    localizedNames: [new LocalizedName({id:1}, 'Proszę dodać wymiar będący drugim wymiarem do indeksu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName69)

const orderName70: Vocabulary = {
    variableName: 'tooManyFirstIndexDimensions',
    localizedNames: [new LocalizedName({id:1}, 'Dodano więcej niż jeden wymiar będący pierwszym wymiarem indeksu. Można dodać tylko jeden'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName70)

const orderName72: Vocabulary = {
    variableName: 'tooManySecondIndexDimensions',
    localizedNames: [new LocalizedName({id:1}, 'Dodano więcej niż jeden wymiar będący drugim wymiarem indeksu. Można dodać tylko jeden'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName72)

const orderName73: Vocabulary = {
    variableName: 'confirmButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Zatwierdź'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName73)

const orderName74: Vocabulary = {
    variableName: 'printButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Drukuj'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName74)

const orderName75: Vocabulary = {
    variableName: 'addProduct',
    localizedNames: [new LocalizedName({id:1}, 'Dodaj Produkt'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName75)

const orderName76: Vocabulary = {
    variableName: 'backButtonDescription',
    localizedNames: [new LocalizedName({id:1}, 'Wstecz'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName76)

const orderName77: Vocabulary = {
    variableName: 'create',
    localizedNames: [new LocalizedName({id:1}, 'Utworz'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName77)

const orderName78: Vocabulary = {
    variableName: 'dimension',
    localizedNames: [new LocalizedName({id:1}, 'Wymiar'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(orderName78)












const drawingTableName1: Vocabulary = {
    variableName: 'workingTemperature',
    localizedNames: [new LocalizedName({id:1}, 'Temperatura Pracy'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(drawingTableName1);

const drawingTableName2: Vocabulary = {
    variableName: 'antielectrostatic',
    localizedNames: [new LocalizedName({id:1}, 'Antyelektrostatyczność'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(drawingTableName2);

const drawingTableName3: Vocabulary = {
    variableName: 'workingSide',
    localizedNames: [new LocalizedName({id:1}, 'Strona Pracująca'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(drawingTableName3);
const drawingTableName4: Vocabulary = {
    variableName: 'workingSideExternal',
    localizedNames: [new LocalizedName({id:1}, 'Zewnętrzna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(drawingTableName4);
const drawingTableName5: Vocabulary = {
    variableName: 'workingSideInternal',
    localizedNames: [new LocalizedName({id:1}, 'Wewnętrzna'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(drawingTableName5);

const drawingTableName6: Vocabulary = {
    variableName: 'material',
    localizedNames: [new LocalizedName({id:1}, 'Materiał'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(drawingTableName6);

const dimensionNames1: Vocabulary = {
    variableName: 'dimensionCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod Wymiaru'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames1);

const dimensionNames2: Vocabulary = {
    variableName: 'dimensionRole',
    localizedNames: [new LocalizedName({id:1}, 'Rola Wymiaru'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames2);

const dimensionNames3: Vocabulary = {
    variableName: 'dimensionRoleFirstIndex',
    localizedNames: [new LocalizedName({id:1}, 'Pierwszy Wymiar Indeksu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames3);

const dimensionNames4: Vocabulary = {
    variableName: 'dimensionRoleSecondIndex',
    localizedNames: [new LocalizedName({id:1}, 'Drugi Wymiar Indeksu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames4);

const dimensionNames5: Vocabulary = {
    variableName: 'dimensionRoleNoIndex',
    localizedNames: [new LocalizedName({id:1}, 'Wymiar nie wchodzący do indeksu'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames5);

const dimensionNames6: Vocabulary = {
    variableName: 'dimensionName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Wymiaru'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames6);

const dimensionNames7: Vocabulary = {
    variableName: 'selectDimensionRole',
    localizedNames: [new LocalizedName({id:1}, 'Wybierz rolę wymiaru'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(dimensionNames7);

const languageNames1: Vocabulary = {
    variableName: 'languageCode',
    localizedNames: [new LocalizedName({id:1}, 'Kod Języka'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(languageNames1);

const languageNames2: Vocabulary = {
    variableName: 'languageName',
    localizedNames: [new LocalizedName({id:1}, 'Nazwa Języka'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(languageNames2);

const languageNames3: Vocabulary = {
    variableName: 'flag',
    localizedNames: [new LocalizedName({id:1}, 'Flaga'), new LocalizedName({id:2}, '{id:2} ....')]
}
initialVocabularyForDatabase.push(languageNames3);








export {initialVocabularyForDatabase};


