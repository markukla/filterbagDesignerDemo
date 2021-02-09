import {IsArray, IsString, Length} from "class-validator";
import {Column} from "typeorm";
import LocalizedName from "../DimesnionCodes/localizedName";

//this class represents fields filled by the user, oter fields like url addresses will be obtained in other way
class CreateProductTopDto{



    @IsArray()
    localizedNames: LocalizedName [];
    @IsString()
    code:string;







}
export default CreateProductTopDto;
