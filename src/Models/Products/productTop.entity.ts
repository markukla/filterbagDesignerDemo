import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";
import Vocabulary from "../Vocabulary/vocabulary.entity";


@Entity("productTops")
class ProductTop {
    @PrimaryGeneratedColumn()
    public id?: number;
    @OneToOne(()=>Vocabulary, {eager: true, cascade:true,  onUpdate:"CASCADE"})
    @JoinColumn()
    vocabulary: Vocabulary;
    /* @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.productTop,{eager:true, cascade:true})
   // @JoinTable({name:"localizedN_productTop_id_pairs"})
    localizedNames: LocalizedName [];*/

    @Column()
    code:string;
    @OneToMany(()=>Product,(productsWithThisTop :Product)=>productsWithThisTop.productTop)
    products?:Product[]
    @ManyToMany(()=>ProductType,(productTypeswithThisTop:ProductType)=>productTypeswithThisTop.tops)
    productTypes?:ProductType[]
    @Column({nullable: true})
    softDeleteDate?:Date;
}

export default ProductTop;
