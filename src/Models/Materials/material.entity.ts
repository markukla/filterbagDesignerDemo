import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {IsString} from "class-validator";
import Order from "../Order/order.entity";
import LocalizedName from "../LocalizedName/localizedName.entity";
import Vocabulary from "../Vocabulary/vocabulary.entity";

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
    @OneToOne(()=>Vocabulary, {eager: true, cascade:true,  onUpdate:"CASCADE"})
    @JoinColumn()
    vocabulary: Vocabulary;
    /*
    @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.material,{eager:true, cascade:true})
        // @JoinTable({name:"localizedN_productTop_id_pairs"})
    localizedNames: LocalizedName [];

*/
    constructor(materialCode: string, materialName: string) {
        this.materialCode = materialCode;
        this.materialName = materialName;
    }
}
export default Material;
