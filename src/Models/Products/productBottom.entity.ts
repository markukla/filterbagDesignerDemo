import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductType from "./productType.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";


@Entity("productBottoms")
class ProductBottom {
    @PrimaryGeneratedColumn()
    public id?: number;
    @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.productBottom,{eager:true, cascade:true})
    //@JoinTable({name:"localizedN_productBottom_id_pairs"})
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
