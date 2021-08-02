import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";



class OrderToExport {


  public id?: number;

  Indeks:string;

  nazwa_CZ:string;

  rysunek:string;

  Status:number;

  dateAdd: Date;

  dateAddSAP: Date;

}

export default OrderToExport;
