import DimensionCode from "../Models/DimesnionCodes/diemensionCode.entity";
import LocalizedName from "../Models/DimesnionCodes/localizedName";
import DimensionRoleEnum from "../Models/DimesnionCodes/dimensionRoleEnum";

const LocalizedDimensionNamesForL: LocalizedName[] = []
const dlugosc: LocalizedName = {
    nameInThisLanguage:'długość',
    languageCode: 'PL'
};
LocalizedDimensionNamesForL.push(dlugosc);
const L: DimensionCode = {
    localizedDimensionNames: LocalizedDimensionNamesForL,
    dimensionCode: 'L',
    dimensionRole: DimensionRoleEnum.SECONDINDEXDIMENSION,

}
const LocalizedDimensionNamesForD: LocalizedName[] = []
const srednica: LocalizedName = {
    nameInThisLanguage:'średnica',
    languageCode: 'PL'
};
LocalizedDimensionNamesForD.push(dlugosc);
const D: DimensionCode = {
    localizedDimensionNames: LocalizedDimensionNamesForD,
    dimensionCode: 'D',
    dimensionRole: DimensionRoleEnum.FIRSTINDEXDIMENSION,

}
const initialDimensionsForDatabase = [D,L];
export {initialDimensionsForDatabase};
