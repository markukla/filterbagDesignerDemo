import Language from "../Languages/language.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import Vocabulary from "../Vocabulary/vocabulary.entity";

@Entity("localizedNames")
class LocalizedName{
    @PrimaryGeneratedColumn()
    public id?: number;
    @ManyToOne(()=>Language, {eager: true})
    language: Language;
    @Column()
    nameInThisLanguage:string;
    @ManyToOne(()=>Vocabulary, (vocabulary: Vocabulary)=>vocabulary.localizedNames)
    vocabulary: Vocabulary;



    constructor(language: Language|any, nameInThisLanguage: string) {
        this.language = language;
        this.nameInThisLanguage = nameInThisLanguage;
    }
}
export default LocalizedName;

