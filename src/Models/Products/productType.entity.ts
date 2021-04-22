import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";
import Vocabulary from "../Vocabulary/vocabulary.entity";


@Entity("productTypes")
class ProductType {
    @PrimaryGeneratedColumn()
    public id?: number;
    @OneToOne(()=>Vocabulary, {eager: true, cascade:true,  onUpdate:"CASCADE"})
    @JoinColumn()
    vocabulary: Vocabulary;

    /*@OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.productType,{eager:true, cascade:true})*/
    //@JoinTable({name:"localizedN_productType_id_pairs"})
    localizedNames: LocalizedName [];
    @Column()
    code:string;
    @OneToMany(()=>Product,(productsWithThisType:Product)=>productsWithThisType.productType)
    products?:Product[];
    @ManyToMany(()=>ProductTop, (topsForThisProductType: ProductTop)=> topsForThisProductType.productTypes, {cascade:true, onUpdate:"CASCADE", eager:true})
    @JoinTable({name:"productType_productTop_id_pairs"})
    tops?:ProductTop[];
    @ManyToMany(()=>ProductBottom, (bottomsForThisProductType:ProductBottom) => bottomsForThisProductType.productTypes, {cascade:true, onUpdate:"CASCADE", eager:true})
    @JoinTable({name:"productType_productBottom_id_pairs"})
    bottoms?:ProductBottom[];
    @Column({nullable: true})
    softDeleteDate?:Date;


}
export default ProductType;


