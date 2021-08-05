import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getConnection, getManager, getRepository, Repository, UpdateResult} from "typeorm";

import CreateProductTopDto from "../Models/Products/createProductTop.dto";

import OrderToExport from "../Models/Order/orderEntityExportMSSQL";
import OrderExportDto from "../Models/Order/orderExport.dto";
import BusinessPartnerFromSap from "../Models/Users/BusinessPartner/businessPartnerFromSap";
import Order from "../Models/Order/order.entity";


class BusinessPartnerFromSapRepositoryService implements RepositoryService {

    public manager = getManager('default'); // need to be changed in configuratio for server
    repository: Repository<any>;

    public async findOneBusinessPartnerBYCode(code: string): Promise<BusinessPartnerFromSap> {
        const foundRecord: BusinessPartnerFromSap =  await getConnection("default").createQueryBuilder(BusinessPartnerFromSap,'partner')
            .where("partner.cardcode = :pcode", {pcode: code })
            .getOne()

        return foundRecord;
    }
}

export default BusinessPartnerFromSapRepositoryService;
