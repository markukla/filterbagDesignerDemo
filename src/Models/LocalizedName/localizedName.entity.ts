import Language from "../Languages/language.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Vocabulary from "../Vocabulary/vocabulary.entity";
import ProductTop from "../Products/productTop.entity";
import ProductBottom from "../Products/productBottom.entity";
import DimensionCode from "../DimesnionCodes/diemensionCode.entity";
import Material from "../Materials/material.entity";

@Entity("localizedNames")
  class LocalizedName {
    @PrimaryGeneratedColumn()
    public id?: number;
    @ManyToOne(() => Language, {eager: true})
    language: Language;
    @Column()
    nameInThisLanguage: string;
    @ManyToOne(() => Vocabulary, (vocabulary: Vocabulary) => vocabulary.localizedNames)
    vocabulary: Vocabulary;
    /*
    @ManyToOne(() => ProductTop, (productTop: ProductTop) => productTop.localizedNames)
    productTop: ProductTop;
    @ManyToOne(() => ProductBottom, (productBottom: ProductBottom) => productBottom.localizedNames)
    productBottom: ProductBottom;
    @ManyToOne(()=>ProductType, (productType: ProductType)=>productType.localizedNames)
    productType: ProductType;
    @ManyToOne(() => DimensionCode, (dimensionCode: DimensionCode) => dimensionCode.localizedDimensionNames)
    dimensionCode: DimensionCode;
    @ManyToOne(() => DimensionCode, (dimensionCode: DimensionCode) => dimensionCode.localizedDimensionNames)
    material: Material;
*/
  @Column({nullable: true})
  softDeleteDate?:Date;
    constructor(language: Language | any, nameInThisLanguage: string) {
        this.language = language;
        this.nameInThisLanguage = nameInThisLanguage;
    }
}
export default LocalizedName;
