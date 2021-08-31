import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getConnection, getRepository, UpdateResult} from "typeorm";




import ProductBottom from "../Models/Products/productBottom.entity";
import ProductBottomNotFoundException from "../Exceptions/ProductBottomNotFoundException";
import CreateProductBottomDto from "../Models/Products/createProductBottom.dto";
import ProductBottomAlreadyExistsException from "../Exceptions/ProductBottomAlreadyExistsException";
import ProductTop from "../Models/Products/productTop.entity";
import ProductTopNotFoundException from "../Exceptions/ProductTopNotFoundException";
import CreateProductTopDto from "../Models/Products/createProductTop.dto";
import ProductTopAlreadyExistsException from "../Exceptions/ProductTopAlreadyExistsException";
import Material from "../Models/Materials/material.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import ProductType from "../Models/Products/productType.entity";
import vocabularyRepositoryService from "./vocabularyRepositoryService";
import {createAndReturnVocabularyWithSetVariabelName} from "../Models/Vocabulary/vocabulatyHelper";
import VocabularyService from "./vocabularyRepositoryService";
import Product from "../Models/Products/product.entity";


class ProductTopService implements RepositoryService {

    public repository = getRepository(ProductTop);
    private vocabularyRepositoryService= new VocabularyService();

    public async findOneProductTopById(id: string): Promise<ProductTop> {

        /* const foundProductTop: ProductTop = await this.repository.findOne(id);*/
        const foundProductTop: ProductTop =  await getConnection().createQueryBuilder(ProductTop,'productTop')
            .leftJoinAndSelect('productTop.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("productTop.id = :id", {id:Number(id)})
            .getOne();

        if (!foundProductTop) {
            throw new ProductTopNotFoundException(id);
        }
        return foundProductTop;


    }

    public async findOneProductTopByTopCode(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const productTop: ProductTop =  await getConnection().createQueryBuilder(ProductTop,'productTop')
            .leftJoinAndSelect('productTop.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("productTop.code = :code", {code:createProductTopDto.code})
            .getOne();

        return productTop;


    }
    public async findOneProductTopByCode(code: string): Promise<ProductTop> {
        const productTop: ProductTop = await getConnection().createQueryBuilder(ProductTop,'productTop')
            .leftJoinAndSelect('productTop.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("productTop.code = :code", {code:code})
            .getOne();

        return productTop;
    }



    public async findAllProductsTops(): Promise<ProductTop[]> {

        /*
        * const foundProductTops: ProductTop[] = await this.repository.find({softDeleteDate: null});

        return foundProductTops;*/
        const foundProductTops= await getConnection().createQueryBuilder(ProductTop,'productTop')



            .leftJoinAndSelect('productTop.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where('productTop.softDeleteDate is null')
            .getMany();

        return foundProductTops;

    }

    public async addOneProductTope(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        // do not allow to add the same product twice
        const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);

        if (productTopWithThisCodeInDatabase && productTopWithThisCodeInDatabase.softDeleteDate === null) {
            throw new ProductTopAlreadyExistsException();
        }
        /* const newestId= await this.vocabularyRepository.getNumberEqualIdPlus1();

        const vocabularyVariableName= `top_${createProductTopDto.code}_id:${newestId}`*/

        const vocabularyInNewRecord= await createAndReturnVocabularyWithSetVariabelName("top",createProductTopDto);

        const recordToSave: ProductTop = {
            ...createProductTopDto,
            vocabulary: vocabularyInNewRecord

        };

        const savedProductTop:ProductTop = await this.repository.save(recordToSave);
        const recordToReturn = await this.findOneProductTopById(String(savedProductTop.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;

    }

    public async updateProductTopById(id: string, createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const recordInDatabase= await this.findOneProductTopById(id);
        const idOfExistingProductTOp: boolean = recordInDatabase !== null;
        if (idOfExistingProductTOp) {

            // do not allow to update if other ProductType with the same filds already exists
            const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);
            if (productTopWithThisCodeInDatabase && productTopWithThisCodeInDatabase.softDeleteDate === null) {
                if (productTopWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductTopAlreadyExistsException();

                }
            }

            const localizedNamesWithIds= recordInDatabase.vocabulary.localizedNames;
            const vocabulary: Vocabulary= recordInDatabase.vocabulary;
            vocabulary.localizedNames=addIdsForCascadeUpdateLocalizedNames(createProductTopDto.localizedNames, localizedNamesWithIds);

            const recordToUpdate = {
                ...createProductTopDto,
                vocabulary: vocabulary,
                id:Number(id)
            }


            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.findOneProductTopById(String(updatedRecord.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;



        }
    }

    public async deleteProductTopById(id:string):Promise<boolean>{
        let softDeletedRecord:ProductTop;
        let vocabularySuccesFullySoftDeleted: boolean;
        const recordToDelte = await this.findOneProductTopById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: ProductTop = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
            vocabularySuccesFullySoftDeleted= await this.vocabularyRepositoryService.deleteOneRecordById(String(recordTosoftDelete.vocabulary.id))
        }
        else {
            throw new ProductTopNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate&& vocabularySuccesFullySoftDeleted) {
            return true;
        }
        else {
            return false;
        }
    }



}

export default ProductTopService;
