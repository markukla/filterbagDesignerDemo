import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";
import Language from "../Languages/language.entity";
import languageRepositoryService from "../../RepositoryServices/languageRepositoryService";
import LocalizedName from "../LocalizedName/localizedName.entity";

@Entity("vocabularies")
class Vocabulary {

    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({unique:true})
    variableName:string;
    @ManyToMany(()=>LocalizedName,{eager:true, cascade:true})
    @JoinTable({name:"vocabulary_localizedName_id_pairs"})
    localizedNames: LocalizedName [];
    @Column({nullable: true})
    softDeleteDate?:Date;



}
export default Vocabulary;
