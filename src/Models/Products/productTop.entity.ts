import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";


@Entity("productTops")
class ProductTop {
    @PrimaryGeneratedColumn()
    public id?: number;
    @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.productTop,{eager:true, cascade:true})
   // @JoinTable({name:"localizedN_productTop_id_pairs"})
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
