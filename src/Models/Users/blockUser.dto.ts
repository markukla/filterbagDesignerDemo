import {IsBoolean, IsEmail, IsString} from "class-validator";

class BlockUserDto {

    @IsBoolean()
    active: boolean;

}
export default BlockUserDto;
