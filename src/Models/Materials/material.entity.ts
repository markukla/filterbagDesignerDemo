import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {IsString} from "class-validator";
import Order from "../Order/order.entity";

@Entity("materials")
class Material{

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({length:6})

    materialCode:string;

    @Column()
    materialName:string;

    @OneToMany(()=>Order,(order:Order)=>order.productMaterial)
    orders?:Order[];
    @Column({nullable: true})
    softDeleteDate?:Date;


    constructor(materialCode: string, materialName: string) {
        this.materialCode = materialCode;
        this.materialName = materialName;
    }
}
export default Material;
