import HttpException from "./HttpException";
import LocalizedName from "../Models/LocalizedName/localizedName.entity";

class LanguageNotFoundException extends HttpException{

    constructor(id:string) {

        if(id){
            super(404,`Language with id ${id} not found`);
        }

    }
}
export default LanguageNotFoundException;
