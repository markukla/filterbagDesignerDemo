import Language from "../Models/Languages/language.entity";

const PL: Language = {
    active: true,
    languageCode: 'PL',
    languageName: 'polski',
    flagUrl: '\\images\\1612045171756polska_flaga.jpg'
}
const CZE: Language = {
    active: true,
    languageCode: 'CZE',
    languageName: 'polski',
    flagUrl: '\\images\\1612045202729czeska_flaga.png'
}
const Languages: Language[] = [PL, CZE];
export {Languages};
