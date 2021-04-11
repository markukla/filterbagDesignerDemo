import {TableRecord} from '../../GenericServices/tableRecord';
import LocalizedName from "../../DimensionCodes/DimensionCodesTypesAnClasses/localizedName";

export class Material{
  id?: number;
  materialCode: string;
  materialName: string;
  localizedNames: LocalizedName[];
}
