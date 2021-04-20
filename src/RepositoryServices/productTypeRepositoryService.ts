import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getRepository, UpdateResult} from "typeorm";


import ProductType from "../Models/Products/productType.entity";
import ProductTypeNotFoundException from "../Exceptions/ProductTypeNotFoundException";
import CreateProductTypeDto from "../Models/Products/createProductType.dto";
import ProductTypeAlreadyExistsException from "../Exceptions/ProductTypeAlreadyExistException";
import ProductTop from "../Models/Products/productTop.entity";
import Material from "../Models/Materials/material.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";


class ProductTypeService implements RepositoryService {

    public repository = getRepository(ProductType);

    public async findOneProductTypeById(id: string): Promise<ProductType> {
        const foundProductType: ProductType = await this.repository.findOne(id,{relations:["tops","bottoms"]}); // table name not entity name
        if (!foundProductType) {
            throw new ProductTypeNotFoundException(id);
        }
        return foundProductType;


    }

    public async findOneProductTypeByProductTypeCode(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const foundProduct: ProductType = await this.repository.findOne({
            code: createProductTypeDto.code,
            softDeleteDate: null
        },{relations:["tops","bottoms"]});

        return foundProduct;


    }

    public async findOneProductTypeByCode(code: string): Promise<ProductTop> {
        const productType: ProductType = await this.repository.findOne({
            code:code
        });

        return productType;
    }


    public async findAllProductsTypes(): Promise<ProductType[]> {
        const foundProductTypes: ProductType[] = await this.repository.find({relations:["tops","bottoms"]});
        const foundNotDeletedProductTypes: ProductType[] = foundProductTypes.filter(productType => productType.softDeleteDate === null);
        return foundNotDeletedProductTypes;

    }

    public async addOneProductType(createProductTypeDto: CreateProductTypeDto|ProductType): Promise<ProductType> {
        // do not allow to add the same product twice
        const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);

        if (productTypeWithThisCodeInDatabase && productTypeWithThisCodeInDatabase.softDeleteDate === null) {
            throw new ProductTypeAlreadyExistsException();
        }
        const vocabularyVariableName= `type_${createProductTypeDto.code}`
        const vocabularyInNewRecord= new Vocabulary(vocabularyVariableName, createProductTypeDto.localizedNames);

        const recordToSave: ProductType = {
            ...createProductTypeDto,
            vocabulary: vocabularyInNewRecord

        };


        const savedProductType: ProductType = await this.repository.save(recordToSave);
        const recordToReturn = await this.repository.findOne(savedProductType.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;

    }

    public async updateProductTypeById(id: string, createProductTypeDto: CreateProductTypeDto|ProductType): Promise<ProductType> {
       const recordInDatabase=await this.findOneProductTypeById(id);
        const idOfExistingProductType: boolean = recordInDatabase !== null;
        if (idOfExistingProductType) {

            // do not allow to update if other ProductType with the same filds already exists
            const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);


            if (productTypeWithThisCodeInDatabase && productTypeWithThisCodeInDatabase.softDeleteDate === null) {
                if (productTypeWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductTypeAlreadyExistsException();

                }
            }

            const localizedNamesWithIds= recordInDatabase.localizedNames;
            const vocabulary: Vocabulary= recordInDatabase.vocabulary;
            vocabulary.localizedNames=addIdsForCascadeUpdateLocalizedNames(createProductTypeDto.localizedNames, localizedNamesWithIds);

            const recordToUpdate = {
                ...createProductTypeDto,
                vocabulary: vocabulary,
                id:Number(id)
            }


            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.repository.findOne(updatedRecord.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;


        }
    }


    public async deleteProductTypeById(id:string):Promise<boolean>{
        let softDeletedRecord:ProductType;
        const recordToDelte = await this.findOneProductTypeById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: ProductType = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
        }
        else {
            throw new ProductTypeNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate) {
            return true;
        }
        else {
            return false;
        }
    }


}

export default ProductTypeService;
