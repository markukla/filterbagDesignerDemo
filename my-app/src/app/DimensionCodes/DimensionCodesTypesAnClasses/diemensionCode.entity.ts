import LocalizedName from './localizedName';
import DimensionRoleEnum from './dimensionRoleEnum';
import {Vocabulary} from "../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity";



class DimensionCode {
    public id?: number;
    dimensionCode: string;
    vocabulary: Vocabulary;
    dimensionRole: DimensionRoleEnum;
    softDeleteDate?: Date;
}

export default DimensionCode;
