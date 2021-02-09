import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Product from "./product.entity";
import ProductTop from "./productTop.entity";
import ProductBottom from "./productBottom.entity";
import LocalizedName from "../DimesnionCodes/localizedName";


@Entity("productTypes")
class ProductType {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({ type:"jsonb"})
    localizedNames: LocalizedName [];
    @Column()
    code:string;
    @OneToMany(()=>Product,(productsWithThisType:Product)=>productsWithThisType.productType)
    productsWithThisType?:Product[];
    @ManyToMany(()=>ProductTop, (topsForThisProductType: ProductTop)=> topsForThisProductType.productTypeswithThisTop)
    @JoinTable({name:"productType_productTop_id_pairs"})
    topsForThisProductType:ProductTop[];
    @ManyToMany(()=>ProductBottom, (bottomsForThisProductType:ProductBottom) => bottomsForThisProductType.productTypesWithThisBottom)
    @JoinTable({name:"productType_productBottom_id_pairs"})
    bottomsForThisProductType:ProductBottom[];



}
export default ProductType;


