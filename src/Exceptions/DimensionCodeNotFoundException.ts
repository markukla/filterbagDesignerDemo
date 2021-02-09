import HttpException from "./HttpException";
import LocalizedName from "../Models/DimesnionCodes/localizedName";

class DimensionCodeNotFoundException extends HttpException{

    constructor(id?:string) {

        if(id){
            super(404,`DimensionCode with id ${id} not found`);
        }
        else {
            super(404,`Searched DimensionCode not found`);
        }

    }
}
export default DimensionCodeNotFoundException;
