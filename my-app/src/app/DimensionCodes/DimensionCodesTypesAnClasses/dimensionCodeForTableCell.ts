import Product from "../../Products/ProductTypesAndClasses/product.entity";
import ProductType from "../../Products/ProductTypesAndClasses/productType.entity";
import LocalizedName from "./localizedName";
import DimensionRoleEnum from "./dimensionRoleEnum";

export class DimensionCodeForTableCell {
  public id?: number;
  dimensionCode: string;
  localizedDimensionName: string;
  dimensionRole: string;
}
