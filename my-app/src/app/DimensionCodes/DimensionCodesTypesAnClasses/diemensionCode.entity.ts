import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';
import Vocabulary from "../../../../../src/Models/Vocabulary/vocabulary.entity";


class DimensionCode {
    public id?: number;
    dimensionCode: string;
    vocabulary: Vocabulary;
    dimensionRole: DimensionRoleEnum;
    softDeleteDate?: Date;
}

export default DimensionCode;
