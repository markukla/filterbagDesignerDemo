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
        const foundProductTops: ProductTop[] = await this.repository.find();

        return foundProductTops;

    }

    public async addOneProductTope(createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        // do not allow to add the same product twice
        const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);
        let productTopAlreadyExistInDatabase:boolean=productTopWithThisCodeInDatabase!==undefined;

        if (productTopAlreadyExistInDatabase) {
            throw new ProductTopAlreadyExistsException();
        }
        const productTopToSave={
            ...createProductTopDto
        };


        const savedProductTop:ProductTop = await this.repository.save(productTopToSave);
        return savedProductTop;

    }

    public async updateProductTopById(id: string, createProductTopDto: CreateProductTopDto): Promise<ProductTop> {
        const idOfExistingProductTOp: boolean = await this.findOneProductTopById(id) !== null;
        if (idOfExistingProductTOp) {

            // do not allow to update if other ProductType with the same filds already exists
            const productTopWithThisCodeInDatabase: ProductTop = await this.findOneProductTopByTopCode(createProductTopDto);
            if (productTopWithThisCodeInDatabase) {
                if (productTopWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductTopAlreadyExistsException();

                }
            }

            const productTopeToUpdate: ProductTop = {
                ...createProductTopDto

            }
            const updateResult: UpdateResult = await this.repository.update(id, productTopeToUpdate);
            if (updateResult.affected === 1) {
                const updatedProductTop: ProductTop = await this.findOneProductTopById(id);
                return updatedProductTop;
            }


        }
    }

    public async deleteProductTopById(id: string): Promise<DeleteResult> {
        const idOfExistingProductTop: boolean = await this.findOneProductTopById(id) !==undefined;
        if (idOfExistingProductTop) {
            const deleteResult: DeleteResult = await this.repository.delete(id);
            return deleteResult;
        }
        else {
            throw new ProductTopNotFoundException(id);
        }


    }


}

export default ProductTopService;
