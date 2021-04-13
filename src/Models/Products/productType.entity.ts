import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";


@Entity("productTypes")
class ProductType {
    @PrimaryGeneratedColumn()
    public id?: number;
    @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.productType,{eager:true, cascade:true})
    //@JoinTable({name:"localizedN_productType_id_pairs"})
    localizedNames: LocalizedName [];
    @Column()
    code:string;
    @OneToMany(()=>Product,(productsWithThisType:Product)=>productsWithThisType.productType)
    productsWithThisType?:Product[];
    @ManyToMany(()=>ProductTop, (topsForThisProductType: ProductTop)=> topsForThisProductType.productTypeswithThisTop, {cascade:true, onUpdate:"CASCADE"})
    @JoinTable({name:"productType_productTop_id_pairs"})
    topsForThisProductType?:ProductTop[];
    @ManyToMany(()=>ProductBottom, (bottomsForThisProductType:ProductBottom) => bottomsForThisProductType.productTypesWithThisBottom, {cascade:true, onUpdate:"CASCADE"})
    @JoinTable({name:"productType_productBottom_id_pairs"})
    bottomsForThisProductType?:ProductBottom[];
    @Column({nullable: true})
    softDeleteDate?:Date;


}
export default ProductType;


