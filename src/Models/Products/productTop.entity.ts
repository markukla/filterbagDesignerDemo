import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../DimesnionCodes/localizedName";


@Entity("productTops")
class ProductTop {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({ type:"jsonb"})
    localizedNames: LocalizedName [];

    @Column({unique:true})
    code:string;

    @OneToMany(()=>Product,(productsWithThisTop :Product)=>productsWithThisTop.productTop)
    productsWithThisTop?:Product[]
    @ManyToMany(()=>ProductType,(productTypeswithThisTop:ProductType)=>productTypeswithThisTop.topsForThisProductType)
    productTypeswithThisTop?:ProductType[]

}

export default ProductTop;
