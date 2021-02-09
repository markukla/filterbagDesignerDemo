import HttpException from "./HttpException";

class VocabularyNotFoundException extends HttpException{

    constructor(id:string) {

        if(id){
            super(404,`Vocabulary with id ${id} not found`);
        }

    }
}
export default VocabularyNotFoundException;
