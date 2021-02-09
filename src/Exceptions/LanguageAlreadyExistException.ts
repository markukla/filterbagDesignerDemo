import HttpException from "./HttpException";

class LanguageAlreadyExistException extends HttpException {
    constructor(languageCode: string) {

        if(languageCode){
            super(400, `Language with LanguageCOde= ${languageCode} already exists`);
        }


    }
}

export default LanguageAlreadyExistException;
