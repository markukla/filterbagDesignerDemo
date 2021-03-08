import Product from './product.entity';
import ProductType from './productType.entity';
import LocalizedName from '../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName';


class ProductBottom {
    public id?: number;
    localizedNames: LocalizedName [];
    code: string;
    productsWithThisBottom?: Product[];
    productTypesWithThisBottom?: ProductType[];
    softDeleteDate?: Date;
}

export default ProductBottom;
