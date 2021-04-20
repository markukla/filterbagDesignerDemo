import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import Product from './product.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';
import {Vocabulary} from "../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity";


class ProductType {
  public id?: number;
  vocabulary?: Vocabulary;
  code: string;
  productsWithThisType?: Product[];
  tops?: ProductTop[];
  bottoms?: ProductBottom[];
  softDeleteDate?: Date;
}

export default ProductType;


