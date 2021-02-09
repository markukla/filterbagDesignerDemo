import {IS_BOOLEAN, IsArray, IsEnum, IsString} from "class-validator";
import LocalizedName from "../DimesnionCodes/localizedName";
import DimensionRoleEnum from "../DimesnionCodes/dimensionRoleEnum";
import {Column, PrimaryGeneratedColumn} from "typeorm";

class LanguageDto {

    @IsString()
    languageCode: string;
    @IsString()
    languageName: string;
    @IsString()
    flagUrl: string;
    active: boolean;
}

export default LanguageDto;
