import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Order from "../Order/order.entity";
import Language from "../Languages/language.entity";
import languageRepositoryService from "../../RepositoryServices/languageRepositoryService";
import LocalizedName from "../DimesnionCodes/localizedName";

@Entity("vocabularies")
class Vocabulary {

    @PrimaryGeneratedColumn()
    public id?: number;
    @Column({unique:true})
    variableName:string;
    @Column({ type:"jsonb"})
    localizedNames: LocalizedName [];

}
export default Vocabulary;
