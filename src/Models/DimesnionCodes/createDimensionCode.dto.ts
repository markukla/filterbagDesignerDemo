import {IsArray, IsEnum, IsObject, IsString} from "class-validator";
import ProductType from "../Products/productType.entity";
import ProductTop from "../Products/productTop.entity";
import ProductBottom from "../Products/productBottom.entity";
import DimensionTextFIeldInfo from "../Products/dimensionTextFIeldInfo";
import {Column} from "typeorm";
import LocalizedName from "./localizedName";
import RoleEnum from "../Role/role.enum";
import DimensionRoleEnum from "./dimensionRoleEnum";

class CreateDimensionCodeDto {

    @IsString()
    dimensionCode: string;

    @IsArray()
    localizedDimensionNames: LocalizedName [];
    @IsEnum(DimensionRoleEnum)
    dimensionRole: DimensionRoleEnum;
}

export default CreateDimensionCodeDto;
