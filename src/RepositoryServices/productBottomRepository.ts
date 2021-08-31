import RepositoryService from "../interfaces/service.interface";




import ProductBottom from "../Models/Products/productBottom.entity";
import ProductBottomNotFoundException from "../Exceptions/ProductBottomNotFoundException";
import CreateProductBottomDto from "../Models/Products/createProductBottom.dto";
import ProductBottomAlreadyExistsException from "../Exceptions/ProductBottomAlreadyExistsException";
import {DeleteResult, getConnection, getRepository, UpdateResult} from "typeorm";
import ProductTop from "../Models/Products/productTop.entity";
import Material from "../Models/Materials/material.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";
import {addIdsForCascadeUpdateLocalizedNames} from "../Models/LocalizedName/localizedNamesHelperFunction";
import Vocabulary from "../Models/Vocabulary/vocabulary.entity";
import {createAndReturnVocabularyWithSetVariabelName} from "../Models/Vocabulary/vocabulatyHelper";
import VocabularyService from "./vocabularyRepositoryService";


class ProductBottomService implements RepositoryService {

    public repository = getRepository(ProductBottom);
    private vocabularyRepositoryService= new VocabularyService();
    public async findOneProductBottomById(id: string): Promise<ProductBottom> {


        /*
        *  const foundProductBottom: ProductBottom = await this.repository.findOne(id);*/
        const foundProductBottom= await getConnection().createQueryBuilder(ProductBottom,'productBottom')
            .leftJoinAndSelect('productBottom.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .where("productBottom.id = :id", {id:Number(id)})
            .getOne();

        if (!foundProductBottom) {
            throw new ProductBottomNotFoundException(id);
        }
        return foundProductBottom;


    }

    public async findOneProductBottomByBottomCode(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        const productBottom: ProductBottom = await getConnection().createQueryBuilder(ProductBottom,'productBottom')
            .leftJoinAndSelect('productBottom.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .where("productBottom.code = :code", {code:createProductBottomDto.code})
            .getOne();

        return productBottom;


    }

    public async findOneProductBottomByCode(code: string): Promise<ProductTop> {

        /*
        * const productBottom: ProductBottom = await this.repository.findOne({
            code:code
        });*/

        const productBottom: ProductBottom = await getConnection().createQueryBuilder(ProductBottom,'productBottom')
            .leftJoinAndSelect('productBottom.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .where("productBottom.code = :code", {code:code})
            .getOne();
        return productBottom;
    }



    public async findAllProductsBottoms(): Promise<ProductBottom[]> {

/*
const foundProductBottoms: ProductBottom[] = await this.repository.find({softDeleteDate: null});
* */
        const foundProductBottoms= await getConnection().createQueryBuilder(ProductBottom,'productBottom')
            .leftJoinAndSelect('productBottom.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .where("productBottom.softDeleteDate is null")
            .getMany();
        return foundProductBottoms;

    }

    public async addOneProductBottom(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        // do not allow to add the same product twice
        const productBottomWithThisCodeInDatabase: ProductBottom = await this.findOneProductBottomByBottomCode(createProductBottomDto);


        if (productBottomWithThisCodeInDatabase && productBottomWithThisCodeInDatabase.softDeleteDate === null) {
            throw new ProductBottomAlreadyExistsException();
        }

        const vocabularyInNewRecord= await createAndReturnVocabularyWithSetVariabelName("bottom",createProductBottomDto);

        const recordToSave: ProductBottom = {
            ...createProductBottomDto,
            vocabulary: vocabularyInNewRecord

        };


        const savedProductBottom:ProductBottom = await this.repository.save(recordToSave);
        const recordToReturn = await this.findOneProductBottomById(String(savedProductBottom.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;

    }

    public async updateProductBottomById(id: string, createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
       const recordInDatabase=await this.findOneProductBottomById(id);
        const idOfExistingProductBottom: boolean = recordInDatabase !== null;
        if (idOfExistingProductBottom) {

            // do not allow to update if other ProductType with the same filds already exists
            const productBottomWithThisCodeInDatabase: ProductBottom = await this.findOneProductBottomByBottomCode(createProductBottomDto);
            if (productBottomWithThisCodeInDatabase && productBottomWithThisCodeInDatabase.softDeleteDate === null) {
                if (productBottomWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductBottomAlreadyExistsException();

                }
            }

            const localizedNamesWithIds= recordInDatabase.vocabulary.localizedNames;
            const vocabulary: Vocabulary= recordInDatabase.vocabulary;
            vocabulary.localizedNames=addIdsForCascadeUpdateLocalizedNames(createProductBottomDto.localizedNames, localizedNamesWithIds);

            const recordToUpdate = {
                ...createProductBottomDto,
                vocabulary: vocabulary,
                id:Number(id)
            }


            const updatedRecord=await this.repository.save(recordToUpdate);

            const recordToReturn = await this.findOneProductBottomById(String(updatedRecord.id)); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;

        }
    }

    public async deleteProductBottomById(id:string):Promise<boolean>{
        let softDeletedRecord:ProductBottom;
        let vocabularySuccesFullySoftDeleted: boolean;
        const recordToDelte = await this.findOneProductBottomById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: ProductBottom = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
            vocabularySuccesFullySoftDeleted= await this.vocabularyRepositoryService.deleteOneRecordById(String(recordTosoftDelete.vocabulary.id));
        }
        else {
            throw new ProductBottomNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate && vocabularySuccesFullySoftDeleted) {
            return true;
        }
        else {
            return false;
        }
    }



}

export default ProductBottomService;
