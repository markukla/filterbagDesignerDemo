
class LocalizedName{
    languageCode: string;
    nameInThisLanguage:string;

    constructor(languageCode: string, nameInThisLanguage: string) {
        this.languageCode = languageCode;
        this.nameInThisLanguage = nameInThisLanguage;
    }
}
export default LocalizedName;

