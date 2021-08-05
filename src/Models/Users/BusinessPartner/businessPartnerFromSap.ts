import {
    BaseEntity,
    Column,
    Entity, PrimaryColumn,


} from "typeorm";



@Entity("PH")
class BusinessPartnerFromSap {

    @PrimaryColumn({nullable:false})
    cardcode:string //code?: string;
    @Column({nullable: true})
    CntcPerson: string; //fulName: string;
    @Column({nullable: true})
    e_mail_CntcPerson: string// email: string;
    @Column({nullable:true})
    Cardname: string //businesPartnerCompanyName?: string;
    @Column({nullable: true})
    Addate:Date;






}

export default BusinessPartnerFromSap;
