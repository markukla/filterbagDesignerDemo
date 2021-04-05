import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "../Products/product.entity";
import ProductType from "../Products/productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";
import DimensionRoleEnum from "./dimensionRoleEnum";


@Entity("dimensionCodes")
class DimensionCode {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    dimensionCode:string;

    @ManyToMany(()=>LocalizedName,{eager:true, cascade:true})
    @JoinTable({name:"vocabulary_dimesnionCode_id_pairs"})
    localizedDimensionNames: LocalizedName [];
    @Column({default: DimensionRoleEnum.NOINDEXDIMENSION})
    dimensionRole: DimensionRoleEnum
    @Column({nullable: true})
    softDeleteDate?:Date;
}

export default DimensionCode;
