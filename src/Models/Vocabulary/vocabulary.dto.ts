import {IsArray, IsObject, IsString, Length} from "class-validator";
import Language from "../Languages/language.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";

class CreateVocabularyDto
{

    @IsString()
    variableName:string;
    @IsArray()
    localizedNames: LocalizedName [];

}
export default CreateVocabularyDto;
