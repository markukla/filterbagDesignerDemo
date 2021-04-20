
import LocalizedName from "../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName";

export class MaterialDto{
  id?: number;
  materialCode: string;
  materialName: string;
  localizedNames: LocalizedName[];
}
