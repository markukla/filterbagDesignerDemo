import {IsBoolean, IsEmail, IsString} from "class-validator";

class UpdatePrivilegedUserWithouTPasswordDto {
    @IsString()
    fulName: string;

    @IsEmail()
    email: string;
    @IsBoolean()
    isAdmin: boolean;
    @IsBoolean()
    active: boolean;

}
export default UpdatePrivilegedUserWithouTPasswordDto;
