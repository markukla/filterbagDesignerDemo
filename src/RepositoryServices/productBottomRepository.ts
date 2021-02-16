import RepositoryService from "../interfaces/service.interface";




import ProductBottom from "../Models/Products/productBottom.entity";
import ProductBottomNotFoundException from "../Exceptions/ProductBottomNotFoundException";
import CreateProductBottomDto from "../Models/Products/createProductBottom.dto";
import ProductBottomAlreadyExistsException from "../Exceptions/ProductBottomAlreadyExistsException";
import {DeleteResult, getRepository, UpdateResult} from "typeorm";
import ProductTop from "../Models/Products/productTop.entity";
import Material from "../Models/Materials/material.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";


class ProductBottomService implements RepositoryService {

    public repository = getRepository(ProductBottom);

    public async findOneProductBottomById(id: string): Promise<ProductBottom> {
        const foundProductBottom: ProductBottom = await this.repository.findOne(id);
        if (!foundProductBottom) {
            throw new ProductBottomNotFoundException(id);
        }
        return foundProductBottom;


    }

    public async findOneProductBottomByBottomCode(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        const productBottom: ProductBottom = await this.repository.findOne({
            code:createProductBottomDto.code
        });

        return productBottom;


    }

    public async findOneProductBottomByCode(code: string): Promise<ProductTop> {
        const productBottom: ProductBottom = await this.repository.findOne({
            code:code
        });

        return productBottom;
    }



    public async findAllProductsBottoms(): Promise<ProductBottom[]> {
        const foundProductBottoms: ProductBottom[] = await this.repository.find({softDeleteDate: null});

        return foundProductBottoms;

    }

    public async addOneProductBottom(createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        // do not allow to add the same product twice
        const productBottomWithThisCodeInDatabase: ProductBottom = await this.findOneProductBottomByBottomCode(createProductBottomDto);


        if (productBottomWithThisCodeInDatabase && productBottomWithThisCodeInDatabase.softDeleteDate === null) {
            throw new ProductBottomAlreadyExistsException();
        }
        const productBottomToSave={
            ...createProductBottomDto
        };


        const savedProductBottom:ProductBottom = await this.repository.save(productBottomToSave);
        return savedProductBottom;

    }

    public async updateProductBottomById(id: string, createProductBottomDto: CreateProductBottomDto): Promise<ProductBottom> {
        const idOfExistingProductBottom: boolean = await this.findOneProductBottomById(id) !== null;
        if (idOfExistingProductBottom) {

            // do not allow to update if other ProductType with the same filds already exists
            const productBottomWithThisCodeInDatabase: ProductBottom = await this.findOneProductBottomByBottomCode(createProductBottomDto);
            if (productBottomWithThisCodeInDatabase && productBottomWithThisCodeInDatabase.softDeleteDate === null) {
                if (productBottomWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductBottomAlreadyExistsException();

                }
            }

            const productBottomToUpdate: ProductBottom = {
                ...createProductBottomDto

            }
            const updateResult: UpdateResult = await this.repository.update(id, productBottomToUpdate);
            if (updateResult.affected === 1) {
                const updatedProductBottom: ProductBottom = await this.findOneProductBottomById(id);
                return updatedProductBottom;
            }


        }
    }

    public async deleteProductBottomById(id:string):Promise<boolean>{
        let softDeletedRecord:ProductBottom;
        const recordToDelte = await this.findOneProductBottomById(id);
        const idOfExistingRecord:boolean=recordToDelte!==null;
        if(idOfExistingRecord){
            const recordTosoftDelete: ProductBottom = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord= await this.repository.save(recordTosoftDelete);
        }
        else {
            throw new ProductBottomNotFoundException(id);
        }
        if(softDeletedRecord&&softDeletedRecord.softDeleteDate) {
            return true;
        }
        else {
            return false;
        }
    }



}

export default ProductBottomService;
