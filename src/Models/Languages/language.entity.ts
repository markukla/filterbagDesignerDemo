import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Vocabulary from "../Vocabulary/vocabulary.entity";

@Entity("aplicationLanguages")
class Language {
    @PrimaryGeneratedColumn()
    public id?: number;
    @Column()
    languageCode: string;
    @Column()
    languageName: string;
    @Column()
    active: boolean;
    @Column({nullable: true})
    flagUrl: string;
    @Column({nullable: true})
    softDeleteDate?:Date;
}

export default Language;
