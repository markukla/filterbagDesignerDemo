import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "../Products/product.entity";
import ProductType from "../Products/productType.entity";
import LocalizedName from "./localizedName";
import DimensionRoleEnum from "./dimensionRoleEnum";


@Entity("dimensionCodes")
class DimensionCode {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    dimensionCode:string;

    @Column({ type:"jsonb"})
    localizedDimensionNames: LocalizedName [];
    @Column({default: DimensionRoleEnum.NOINDEXDIMENSION})
    dimensionRole: DimensionRoleEnum
    @Column({nullable: true})
    softDeleteDate?:Date;
}

export default DimensionCode;
