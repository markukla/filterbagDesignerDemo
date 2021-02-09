import HttpException from "./HttpException";

class VocabularyAlreadyExistException extends HttpException {
    constructor(variableName: string) {

         if(variableName){
            super(400, `Vocabulary with variableName= ${variableName} already exists`);
        }



    }
}

export default VocabularyAlreadyExistException;
