import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../DimesnionCodes/localizedName";


@Entity("productBottoms")
class ProductBottom {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({ type:"jsonb"})
    localizedNames: LocalizedName [];

    @Column()
    code:string;
    @OneToMany(()=>Product,(productWithThisBottom:Product)=>productWithThisBottom.productBottom)
    productsWithThisBottom?:Product[];
    @ManyToMany(()=>ProductType,(productType:ProductType)=>productType.bottomsForThisProductType)
    productTypesWithThisBottom?:ProductType[]
    @Column({nullable: true})
    softDeleteDate?:Date;



}

export default ProductBottom;
