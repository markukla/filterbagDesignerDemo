import ProductType from './productType.entity';
import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import DimensionTextFIeldInfo from './dimensionTextFIeldInfo';
import {TabelAndDrawinglnformation} from "./tabeAndDrawinglnformation";



class Product{
    public id?: number;
    productType: ProductType;
    productBottom: ProductBottom;
    productTop: ProductTop;
    urlOfOrginalDrawing: string;
    urlOfThumbnailDrawing: string; // smaller drawing obtained by library
    dimensionsTextFieldInfo: DimensionTextFIeldInfo[];
    softDeleteDate?: Date;
    drawinAndTableInfo: TabelAndDrawinglnformation
}

export default Product;
