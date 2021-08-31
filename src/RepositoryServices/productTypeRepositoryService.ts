import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getConnection, getRepository, UpdateResult} from "typeorm";


import ProductType from "../Models/Products/productType.entity";
import ProductTypeNotFoundException from "../Exceptions/ProductTypeNotFoundException";
import CreateProductTypeDto from "../Models/Products/createProductType.dto";
import ProductTypeAlreadyExistsException from "../Exceptions/ProductTypeAlreadyExistException";
import ProductTop from "../Models/Products/productTop.entity";
import Material from "../Models/Materials/material.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import {createAndReturnVocabularyWithSetVariabelName} from "../Models/Vocabulary/vocabulatyHelper";
import VocabularyService from "./vocabularyRepositoryService";
import Product from "../Models/Products/product.entity";


class ProductTypeService implements RepositoryService {

    public repository = getRepository(ProductType);
    private vocabularyRepositoryService= new VocabularyService();

    public async findOneProductTypeById(id: string): Promise<ProductType> {
        const foundProductType: ProductType = await getConnection().createQueryBuilder(ProductType,'productType')


            .leftJoinAndSelect('productType.vocabulary','vType')
            .leftJoinAndSelect('vType.localizedNames','vTypenames')
            .leftJoinAndSelect('vTypenames.language','vTypelanguage')
            .leftJoinAndSelect('productType.bottoms', 'bottoms')
            .leftJoinAndSelect('bottoms.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .leftJoinAndSelect('productType.tops', 'tops')
            .leftJoinAndSelect('tops.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("productType.id = :id", {id:Number(id)})
            .getOne();  // table name not entity name
        if (!foundProductType) {
            throw new ProductTypeNotFoundException(id);
        }
        return foundProductType;


    }

    public async findOneProductTypeByProductTypeCode(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const foundProduct: ProductType = await getConnection().createQueryBuilder(ProductType,'productType')


            .leftJoinAndSelect('productType.vocabulary','vType')
            .leftJoinAndSelect('vType.localizedNames','vTypenames')
            .leftJoinAndSelect('vTypenames.language','vTypelanguage')
            .leftJoinAndSelect('productType.bottoms', 'bottoms')
            .leftJoinAndSelect('bottoms.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .leftJoinAndSelect('productType.tops', 'tops')
            .leftJoinAndSelect('tops.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("productType.code = :code", {code:createProductTypeDto.code})
            .getOne();  // table name not entity name

        return foundProduct;


    }

    public async findOneProductTypeByCode(code: string): Promise<ProductTop> {
        const productType: ProductType = await getConnection().createQueryBuilder(ProductType,'productType')


            .leftJoinAndSelect('productType.vocabulary','vType')
            .leftJoinAndSelect('vType.localizedNames','vTypenames')
            .leftJoinAndSelect('vTypenames.language','vTypelanguage')
            .leftJoinAndSelect('productType.bottoms', 'bottoms')
            .leftJoinAndSelect('bottoms.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .leftJoinAndSelect('productType.tops', 'tops')
            .leftJoinAndSelect('tops.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("productType.code = :code", {code:code})
            .getOne();  // table name not entity name

        return productType;
    }


    public async findAllProductsTypes(): Promise<ProductType[]> {
       // const foundProductTypes: ProductType[] = await this.repository.find(/*{relations:["tops","bottoms"]} */);
      //  const foundNotDeletedProductTypes: ProductType[] = foundProductTypes.filter(productType => productType.softDeleteDate === null);

        const foundNotDeletedProductTypes: ProductType[] = await getConnection().createQueryBuilder(ProductType,'productType')


            .leftJoinAndSelect('productType.vocabulary','vType')
            .leftJoinAndSelect('vType.localizedNames','vTypenames')
            .leftJoinAndSelect('vTypenames.language','vTypelanguage')
            .leftJoinAndSelect('productType.bottoms', 'bottoms')
            .leftJoinAndSelect('bottoms.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .leftJoinAndSelect('productType.tops', 'tops')
            .leftJoinAndSelect('tops.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where('productType.softDeleteDate is null')
            .getMany();

        return foundNotDeletedProductTypes;


    }

    public async addOneProductType(createProductTypeDto: CreateProductTypeDto|ProductType): Promise<ProductType> {
        // do not allow to add the same product twice
        const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);

        if (productTypeWithThisCodeInDatabase && productTypeWithThisCodeInDatabase.softDeleteDate === null) {
            throw new ProductTypeAlreadyExistsException();
        }

        const vocabularyInNewRecord= await createAndReturnVocabularyWithSetVariabelName("type",createProductTypeDto);

        const recordToSave: ProductType = {
            ...createProductTypeDto,
            vocabulary: vocabularyInNewRecord

        };


        const savedProductType: ProductType = await this.repository.save(recordToSave);
        const recordToReturn = await this.findOneProductTypeById(String(savedProductType.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

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

            const localizedNamesWithIds= recordInDatabase.vocabulary.localizedNames;
            const vocabulary: Vocabulary= recordInDatabase.vocabulary;
            vocabulary.localizedNames=addIdsForCascadeUpdateLocalizedNames(createProductTypeDto.localizedNames, localizedNamesWithIds);

            const recordToUpdate = {
                ...createProductTypeDto,
                vocabulary: vocabulary,
                id:Number(id)
            }


            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.findOneProductTypeById(String(updatedRecord.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;


        }
    }


    public async deleteProductTypeById(id:string):Promise<boolean>{
        let softDeletedRecord:ProductType;
        let vocabularySuccesFullySoftDeleted: boolean;
        const recordToDelte = await this.findOneProductTypeById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: ProductType = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
            vocabularySuccesFullySoftDeleted= await this.vocabularyRepositoryService.deleteOneRecordById(String(recordTosoftDelete.vocabulary.id));
        }
        else {
            throw new ProductTypeNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate &&vocabularySuccesFullySoftDeleted) {
            return true;
        }
        else {
            return false;
        }
    }


}

export default ProductTypeService;
