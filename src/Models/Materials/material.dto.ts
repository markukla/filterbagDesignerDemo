import {IsArray, IsString, Length} from "class-validator";
import LocalizedName from "../LocalizedName/localizedName.entity";

class CreateMaterialDto{


    @Length(6 ,6)
    @IsString()
    materialCode:string;
    @IsString()
    materialName:string;
    @IsArray()
    localizedNames: LocalizedName [];


}
export default CreateMaterialDto;
