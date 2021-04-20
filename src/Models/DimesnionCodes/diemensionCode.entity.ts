import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Product from "../Products/product.entity";
import ProductType from "../Products/productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";
import DimensionRoleEnum from "./dimensionRoleEnum";
import Vocabulary from "../Vocabulary/vocabulary.entity";


@Entity("dimensionCodes")
class DimensionCode {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    dimensionCode:string;
    @OneToOne(()=>Vocabulary, {eager: true, cascade:true,  onUpdate:"CASCADE"})
    @JoinColumn()
    vocabulary: Vocabulary;
    /*
    @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.dimensionCode,{eager:true, cascade:true})
   // @JoinTable({name:"vocabulary_dimesnionCode_id_pairs"})
    localizedDimensionNames: LocalizedName [];

     */
    @Column({default: DimensionRoleEnum.NOINDEXDIMENSION})
    dimensionRole: DimensionRoleEnum
    @Column({nullable: true})
    softDeleteDate?:Date;
}

export default DimensionCode;
