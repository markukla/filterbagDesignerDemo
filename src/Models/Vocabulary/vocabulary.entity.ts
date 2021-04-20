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
    @OneToMany(()=>LocalizedName,(lozalizedName: LocalizedName)=>lozalizedName.vocabulary,{eager:true, cascade:true, onUpdate:"CASCADE"})
    //@JoinTable({name:"vocabulary_localizedName_id_pairs"})
    localizedNames: LocalizedName[];
    @Column({nullable: true})
    softDeleteDate?:Date;


    constructor(variableName: string, localizedNames: LocalizedName[]) {
        this.variableName = variableName;
        this.localizedNames = localizedNames;
    }
}
export default Vocabulary;
