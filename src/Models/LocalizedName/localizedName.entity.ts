import Language from "../Languages/language.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Vocabulary from "../Vocabulary/vocabulary.entity";
import ProductTop from "../Products/productTop.entity";
import ProductBottom from "../Products/productBottom.entity";
import ProductType from "../Products/productType.entity";
import Dimension from "../OrderDetail/dimension";
import DimensionCode from "../DimesnionCodes/diemensionCode.entity";

@Entity("localizedNames")
class LocalizedName{
    @PrimaryGeneratedColumn()
    public id?: number;
    @ManyToOne(()=>Language, {eager: true})
    language: Language;
    @Column()
    nameInThisLanguage:string;
    @ManyToOne(()=>Vocabulary, (vocabulary: Vocabulary)=>vocabulary.localizedNames)
    vocabulary: Vocabulary;
    @ManyToOne(()=>ProductTop, (productTop: ProductTop)=>productTop.localizedNames)
    productTop: ProductTop;
    @ManyToOne(()=>ProductBottom, (productBottom: ProductBottom)=>productBottom.localizedNames)
    productBottom: ProductBottom;
    @ManyToOne(()=>ProductType, (productType: ProductType)=>productType.localizedNames)
    productType: ProductType;
    @ManyToOne(()=>DimensionCode, (dimensionCode: DimensionCode)=>dimensionCode.localizedDimensionNames)
    dimensionCode: DimensionCode;



    constructor(language: Language|any, nameInThisLanguage: string) {
        this.language = language;
        this.nameInThisLanguage = nameInThisLanguage;
    }
}
export default LocalizedName;

