import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getManager, getRepository, Repository, UpdateResult} from "typeorm";

import CreateProductTopDto from "../Models/Products/createProductTop.dto";

import OrderToExport from "../Models/Order/orderEntityExportMSSQL";
import OrderExportDto from "../Models/Order/orderExport.dto";


class OrderForSapRepository implements RepositoryService {

    public manager = getManager('default'); // need to be changed in configuratio for server
    repository: Repository<any>;

    public async findOneOrder(id: string): Promise<OrderToExport> {
        const foundRecord: OrderToExport = await this.manager.findOne(OrderToExport,id);

        return foundRecord;


    }






    public async findAllRecords(): Promise<OrderToExport[]> {
        const foundRecords: OrderToExport[] = await this.manager.find(OrderToExport);

        return foundRecords;

    }

    public async addOneRecord(orderForSapDto: OrderExportDto): Promise<OrderToExport> {
        // do not allow to add the same product twice





        const recordToSave: OrderToExport = {
            ...orderForSapDto,


        };

        const savedRecord:OrderToExport = await this.manager.save(OrderToExport,recordToSave);
        const recordToReturn = await this.manager.findOne(OrderToExport,savedRecord.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;

    }

    public async updatedRecordById(id: string, createProductTopDto: CreateProductTopDto) {


    }

    public async deleteSelectedRecorf(id:string){

    }







}

export default OrderForSapRepository;
