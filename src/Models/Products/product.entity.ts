import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";
import ProductType from "./productType.entity";
import ProductBottom from "./productBottom.entity";
import ProductTop from "./productTop.entity";
import Dimension from "../OrderDetail/dimension";
import DimensionTextFIeldInfo from "./dimensionTextFIeldInfo";
import {TabelAndDrawinglnformation} from "./tabeAndDrawinglnformation";

@Entity("products")
class Product{  // this class represents type of product and technical drawing of product

    @PrimaryGeneratedColumn()
    public id?: number;

   @ManyToOne(()=>ProductType,(productType:ProductType)=>productType.products, {eager:true,cascade:true, onUpdate:"CASCADE"} ) //eager cause strange error table name (long alias name) is spacyfied more than once
   productType:ProductType;

    @ManyToOne(()=>ProductBottom,(productBottom:ProductBottom)=>productBottom.products,{eager:true})
    productBottom:ProductBottom;

    @ManyToOne(()=>ProductTop,(productTop:ProductTop)=>productTop.products,{eager:true})
    productTop:ProductTop;

    @Column()
    urlOfOrginalDrawing:string;

    @Column()
    urlOfThumbnailDrawing:string; // smaller drawing obtained by library

    @Column({type:"jsonb"})
    dimensionsTextFieldInfo:DimensionTextFIeldInfo[];
    @Column({type:"jsonb", nullable: true})
    drawinAndTableInfo: TabelAndDrawinglnformation;

    @Column({nullable: true})
    softDeleteDate?:Date;


}

export default Product;
