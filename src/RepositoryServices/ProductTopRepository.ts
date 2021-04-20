import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getRepository, UpdateResult} from "typeorm";




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


class ProductTopService implements RepositoryService {

    public repository = getRepository(ProductTop);

    public async findOneProductTopById(id: string): Promise<ProductTop> {
        const foundProductTop: ProductTop = await this.repository.findOne(id);
        if (!foundProductTop) {
            throw new ProductTopNotFoundException(id);
        }
        return foundProductTop;


    }

    public async findOneProductTopByTopCode(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const productTop: ProductTop = await this.repository.findOne({
    code:createProductTopDto.code
        });

        return productTop;


    }
    public async findOneProductTopByCode(code: string): Promise<ProductTop> {
        const productTop: ProductTop = await this.repository.findOne({
            code:code
        });

        return productTop;
    }



    public async findAllProductsTops(): Promise<ProductTop[]> {
        const foundProductTops: ProductTop[] = await this.repository.find({softDeleteDate: null});

        return foundProductTops;

    }

    public async addOneProductTope(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        // do not allow to add the same product twice
        const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);

        if (productTopWithThisCodeInDatabase && productTopWithThisCodeInDatabase.softDeleteDate === null) {
            throw new ProductTopAlreadyExistsException();
        }

        const vocabularyVariableName= `top_${createProductTopDto.code}`
        const vocabularyInNewRecord= new Vocabulary(vocabularyVariableName, createProductTopDto.localizedNames);

        const recordToSave: ProductTop = {
            ...createProductTopDto,
            vocabulary: vocabularyInNewRecord

        };

        const savedProductTop:ProductTop = await this.repository.save(recordToSave);
        const recordToReturn = await this.repository.findOne(savedProductTop.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

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

            const recordToReturn = await this.repository.findOne(updatedRecord.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

            return recordToReturn;



        }
    }

    public async deleteProductTopById(id:string):Promise<boolean>{
        let softDeletedRecord:ProductTop;
        const recordToDelte = await this.findOneProductTopById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: ProductTop = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
        }
        else {
            throw new ProductTopNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate) {
            return true;
        }
        else {
            return false;
        }
    }



}

export default ProductTopService;
