import Language from "../Models/Languages/language.entity";

const PL: Language = {
    active: true,
    languageCode: 'PL',
    languageName: 'polski',
    flagUrl: '\\images\\flaga_polski.png'
}
const CZE: Language = {
    active: true,
    languageCode: 'CS',
    languageName: 'czeski',
    flagUrl: '\\images\\flaga_czech.png'
}
const Languages: Language[] = [PL, CZE];
export {Languages};
