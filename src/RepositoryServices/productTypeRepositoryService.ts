import RepositoryService from "../interfaces/service.interface";


import {DeleteResult, getRepository, UpdateResult} from "typeorm";


import ProductType from "../Models/Products/productType.entity";
import ProductTypeNotFoundException from "../Exceptions/ProductTypeNotFoundException";
import CreateProductTypeDto from "../Models/Products/createProductType.dto";
import ProductTypeAlreadyExistsException from "../Exceptions/ProductTypeAlreadyExistException";
import ProductTop from "../Models/Products/productTop.entity";


class ProductTypeService implements RepositoryService {

    public repository = getRepository(ProductType);

    public async findOneProductTypeById(id: string): Promise<ProductType> {
        const foundProductType: ProductType = await this.repository.findOne(id,{relations:["topsForThisProductType","bottomsForThisProductType"]}); // table name not entity name
        if (!foundProductType) {
            throw new ProductTypeNotFoundException(id);
        }
        return foundProductType;


    }

    public async findOneProductTypeByProductTypeCode(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const foundProduct: ProductType = await this.repository.findOne({
            code: createProductTypeDto.code
        },{relations:["topsForThisProductType","bottomsForThisProductType"]});

        return foundProduct;


    }

    public async findOneProductTypeByCode(code: string): Promise<ProductTop> {
        const productType: ProductType = await this.repository.findOne({
            code:code
        });

        return productType;
    }


    public async findAllProductsTypes(): Promise<ProductType[]> {
        const foundProductTypes: ProductType[] = await this.repository.find({relations:["topsForThisProductType","bottomsForThisProductType"]});

        return foundProductTypes;

    }

    public async addOneProductType(createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        // do not allow to add the same product twice
        const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);
        let productTypeAlreadyExistInDatabase: boolean = productTypeWithThisCodeInDatabase !== undefined;

        if (productTypeAlreadyExistInDatabase) {
            throw new ProductTypeAlreadyExistsException();
        }
        const productTypeToSave = {
            ...createProductTypeDto
        };


        const savedProductType: ProductType = await this.repository.save(productTypeToSave);
        return savedProductType;

    }

    public async updateProductTypeById(id: string, createProductTypeDto: CreateProductTypeDto): Promise<ProductType> {
        const idOfExistingProductType: boolean = await this.findOneProductTypeById(id) !== null;
        if (idOfExistingProductType) {

            // do not allow to update if other ProductType with the same filds already exists
            const productTypeWithThisCodeInDatabase: ProductType = await this.findOneProductTypeByProductTypeCode(createProductTypeDto);


            if (productTypeWithThisCodeInDatabase) {
                if (productTypeWithThisCodeInDatabase.id !== Number(id)) {
                    throw new ProductTypeAlreadyExistsException();

                }
            }

            const productTypeToUpdate: ProductType = {
                ...createProductTypeDto,
                id: Number(id)

            };
            const ProductToUpdate: ProductType = await this.repository.save(productTypeToUpdate);

            const updatedProductType: ProductType = await this.findOneProductTypeById(id);
            return updatedProductType;
        }
    }


    public async deleteProductTypeById(id: string): Promise<DeleteResult> {
        const idOfExistingProductType: boolean = await this.findOneProductTypeById(id) !== null;
        if (idOfExistingProductType) {
            const deleteResult: DeleteResult = await this.repository.delete(id);
            return deleteResult;
        } else {
            throw new ProductTypeNotFoundException(id);
        }


    }


}

export default ProductTypeService;
