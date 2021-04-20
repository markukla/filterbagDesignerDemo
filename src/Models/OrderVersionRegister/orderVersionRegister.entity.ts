import {Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";


@Entity("orderVersionRegisters")
class OrderVersionRegister{
    @PrimaryColumn()
    id:number
    @OneToMany(()=>Order,(order:Order)=>order.register, {eager: true})
    orders: Order [];


    constructor(id: number) {
        this.id = id;
    }
}
export default OrderVersionRegister;
