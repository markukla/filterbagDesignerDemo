import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "../Users/user.entity";
import Product from "../Products/product.entity";
import Material from "../Materials/material.entity";
import OrderDetails from "../OrderDetail/orderDetails.entity";
import OrderVersionRegister from "../OrderVersionRegister/orderVersionRegister.entity";

@Entity("worki")
class OrderToExport {

    @PrimaryGeneratedColumn({type:"int"})
    public id?: number;
    @Column({type: "nvarchar",length:50, nullable:true})
    Indeks:string;
    @Column({type: "nvarchar", length:300, nullable:true})
    nazwa_CZ:string;
    @Column({type: "nvarchar",length:50, nullable:true})
    rysunek:string;
    @Column({type:"int",nullable:true})
    Status:number;
    @Column({type:"datetime",nullable:true})
    dateAdd: Date;
    @Column({type:"datetime",nullable:true})
    dateAddSAP: Date;

}

export default OrderToExport;
