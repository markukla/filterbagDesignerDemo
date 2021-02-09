import {IsBoolean, IsEmail, IsString} from "class-validator";

class UpdateBussinessPartnerWithoutPassword  {
    @IsString()
    fulName: string;
    @IsEmail()
    email: string;
    @IsString()
    code: string;
    @IsString()
    businesPartnerCompanyName: string;
    @IsBoolean()
    active: boolean;


}
export default UpdateBussinessPartnerWithoutPassword;
