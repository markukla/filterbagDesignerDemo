import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";


@Entity("productTops")
class ProductTop {
    @PrimaryGeneratedColumn()
    public id?: number;
    @ManyToMany(()=>LocalizedName,{eager:true, cascade:true})
    @JoinTable({name:"vocabulary_productTop_id_pairs"})
    localizedNames: LocalizedName [];
    @Column()
    code:string;
    @OneToMany(()=>Product,(productsWithThisTop :Product)=>productsWithThisTop.productTop)
    productsWithThisTop?:Product[]
    @ManyToMany(()=>ProductType,(productTypeswithThisTop:ProductType)=>productTypeswithThisTop.topsForThisProductType)
    productTypeswithThisTop?:ProductType[]
    @Column({nullable: true})
    softDeleteDate?:Date;
}

export default ProductTop;
