import {IsBoolean, IsDate, IsNumber, IsObject, IsString, Length} from "class-validator";
import {Column} from "typeorm";


class OrderExportDto {


    Indeks:string;

    nazwa_CZ:string;

    rysunek:string;

    Status:number;

    dateAdd: Date;

    dateAddSAP: Date;
    languageCodeForPdf: string;
    orderIdForPdf: string;




}
export default OrderExportDto;
