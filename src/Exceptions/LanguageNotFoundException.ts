import HttpException from "./HttpException";
import LocalizedName from "../Models/DimesnionCodes/localizedName";

class LanguageNotFoundException extends HttpException{

    constructor(id:string) {

        if(id){
            super(404,`Language with id ${id} not found`);
        }

    }
}
export default LanguageNotFoundException;
