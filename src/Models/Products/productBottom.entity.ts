import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";
import Vocabulary from "../Vocabulary/vocabulary.entity";


@Entity("productBottoms")
class ProductBottom {
    @PrimaryGeneratedColumn()
    public id?: number;
    @OneToOne(()=>Vocabulary, {eager: true, cascade:true,  onUpdate:"CASCADE"})
    @JoinColumn()
    vocabulary: Vocabulary;
   /* @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.productBottom,{eager:true, cascade:true})
    //@JoinTable({name:"localizedN_productBottom_id_pairs"})
    localizedNames: LocalizedName [];*/

    @Column()
    code:string;
    @OneToMany(()=>Product,(productWithThisBottom:Product)=>productWithThisBottom.productBottom)
    products?:Product[];
    @ManyToMany(()=>ProductType,(productType:ProductType)=>productType.bottoms)
    productTypes?:ProductType[]
    @Column({nullable: true})
    softDeleteDate?:Date;



}

export default ProductBottom;
