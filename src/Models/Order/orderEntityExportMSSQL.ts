import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "../Users/user.entity";
import Product from "../Products/product.entity";
import Material from "../Materials/material.entity";
import OrderDetails from "../OrderDetail/orderDetails.entity";
import OrderVersionRegister from "../OrderVersionRegister/orderVersionRegister.entity";

@Entity("worki")
class OrderToExport {

    @PrimaryGeneratedColumn({})
    public id?: number;
    @Column({length:50, nullable:true})
    Indeks:string;
    @Column({ length:300, nullable:true})
    nazwa_CZ:string;
    @Column({length:50, nullable:true})
    rysunek:string;
    @Column({nullable:true})
    Status:number;
    @Column({nullable:true})
    dateAdd: Date;
    @Column({nullable:true})
    dateAddSAP: Date;

}

export default OrderToExport;
