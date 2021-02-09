import {Column} from "typeorm";


import {IsArray, IsBoolean, IsEmail, IsNumber, IsString} from "class-validator";



class CHangePasswordByAdminDto {

    @IsString()
    newPassword: string;

}

export default CHangePasswordByAdminDto;



