import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';


class CreateDimensionCodeDto {
    dimensionCode: string;
    localizedNames: LocalizedName [];
    dimensionRole: DimensionRoleEnum;
}

export default CreateDimensionCodeDto;
