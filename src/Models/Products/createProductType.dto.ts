import {IsArray, IsObject, IsString, Length} from "class-validator";
import {Column} from "typeorm";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";
import LocalizedName from "../DimesnionCodes/localizedName";

//this class represents fields filled by the user, oter fields like url addresses will be obtained in other way
class CreateProductTypeDto{



    @IsArray()
    localizedNames: LocalizedName [];
    @IsString()
    code:string;
    @IsArray()
    topsForThisProductType:ProductTop[];  // insteed of using whole objects we nan use id of each product type eg [{"id"=1},{"id=2"}]
    @IsArray()
    bottomsForThisProductType:ProductBottom[];






}
export default CreateProductTypeDto;
