import ProductTop from './productTop.entity';
import ProductBottom from './productBottom.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {Vocabulary} from "../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity";

class CreateProductTypeDto {
  vocabulary?: Vocabulary;
  localizedNames: LocalizedName [];
  code: string;
  tops?: ProductTop[]| any[];  // insteed of using whole objects we nan use id of each product type eg [{"id"=1},{"id=2"}]
  bottoms?: ProductBottom[]| any[];
}

export default CreateProductTypeDto;
