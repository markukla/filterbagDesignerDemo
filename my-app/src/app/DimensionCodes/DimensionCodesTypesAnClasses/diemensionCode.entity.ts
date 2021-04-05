import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';


class DimensionCode {
    public id?: number;
    dimensionCode: string;
    localizedDimensionNames: LocalizedName [];
    dimensionRole: DimensionRoleEnum;
    softDeleteDate?: Date;
}

export default DimensionCode;
