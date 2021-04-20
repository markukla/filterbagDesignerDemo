import Product from './product.entity';
import ProductType from './productType.entity';
import {Vocabulary} from "../../Vocablulaty/VocabularyTypesAndClasses/VocabularyEntity";

class ProductTop {
  public id?: number;
  vocabulary: Vocabulary;
  code: string;
  products?: Product[];
  productTypes?: ProductType[];
  softDeleteDate?: Date;

}

export default ProductTop;
