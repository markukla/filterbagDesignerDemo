import DimensionTextFIeldInfo from './dimensionTextFIeldInfo';
import ProductType from './productType.entity';
import ProductBottom from './productBottom.entity';
import ProductTop from './productTop.entity';
import {TabelAndDrawinglnformation} from "./tabeAndDrawinglnformation";


class CreateProductDto{
    productType: ProductType;
    productTop: ProductTop;
    productBottom: ProductBottom;
    dimensionsCodes?: string;
    dimensionsTextFieldInfo?: DimensionTextFIeldInfo[];
    urlOfOrginalDrawing?: string;
    urlOfThumbnailDrawing?: string;
    drawinAndTableInfo?: TabelAndDrawinglnformation


}
export default CreateProductDto;
