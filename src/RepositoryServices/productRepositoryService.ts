import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getConnection, getRepository, UpdateResult} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import Product from "../Models/Products/product.entity";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import CreateProductDto from "../Models/Products/product.dto";
import ProductAlreadyExistsException from "../Exceptions/ProductAlreadyExistsException";
import Order from "../Models/Order/order.entity";
import DimensionCodeNotFoundException from "../Exceptions/DimensionCodeNotFoundException";


class ProductService implements RepositoryService {

    public repository = getRepository(Product);

    public async findOneProductById(id: string): Promise<Product> {
      //  const foundProduct: Product = await this.repository.findOne(id, ) // /*{relations: ["productType"]})*/ table name not entity name
        const foundProduct= await getConnection().createQueryBuilder(Product,'product')

            .leftJoinAndSelect('product.productType', 'productType')
            .leftJoinAndSelect('productType.vocabulary','vType')
            .leftJoinAndSelect('vType.localizedNames','vTypenames')
            .leftJoinAndSelect('vTypenames.language','vTypelanguage')
            .leftJoinAndSelect('product.productBottom', 'productBottom')
            .leftJoinAndSelect('productBottom.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .leftJoinAndSelect('product.productTop', 'productTop')
            .leftJoinAndSelect('productTop.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
            .where("product.id = :id", {id:id})
            .getOne();


        if (!foundProduct) {
            throw new ProductNotFoundExceptionn(id);
        }
        return foundProduct;


    }

    public async findOneProductByProductTypeProductTopTypeProductBottomTypeAndAppropriateCodes(createProductDto: CreateProductDto): Promise<Product> {
        const foundProduct: Product = await this.repository.findOne({

            productTop: createProductDto.productTop,
            productBottom: createProductDto.productBottom,
            productType: createProductDto.productType,
            softDeleteDate: null


        });

        return foundProduct;


    }


    public async findAllProducts(): Promise<Product[]> {
       /*  const foundProducts: Product[] = await this.repository.find(
            {softDeleteDate: null}
        );*/


        const foundProducts= await getConnection().createQueryBuilder(Product,'product')

            .leftJoinAndSelect('product.productType', 'productType')
            .leftJoinAndSelect('productType.vocabulary','vType')
            .leftJoinAndSelect('vType.localizedNames','vTypenames')
            .leftJoinAndSelect('vTypenames.language','vTypelanguage')
            .leftJoinAndSelect('product.productBottom', 'productBottom')
            .leftJoinAndSelect('productBottom.vocabulary','vBottom')
            .leftJoinAndSelect('vBottom.localizedNames','vBottomnames')
            .leftJoinAndSelect('vBottomnames.language','vBottomlanguage')
            .leftJoinAndSelect('product.productTop', 'productTop')
            .leftJoinAndSelect('productTop.vocabulary','vTop')
            .leftJoinAndSelect('vTop.localizedNames','vTopnames')
            .leftJoinAndSelect('vTopnames.language','vToplanguage')
           .where('product.softDeleteDate is null')
            .getMany();


        return foundProducts;

    }

    public async addOneProduct(createProductDto: CreateProductDto): Promise<Product> {
        // do not allow to add the same product twice
        const productInDaTabase: Product = await this.findOneProductByProductTypeProductTopTypeProductBottomTypeAndAppropriateCodes(createProductDto);
        if (productInDaTabase && productInDaTabase.softDeleteDate === null) {
            throw new ProductAlreadyExistsException();
        }
        // i nedd to find the way to obtain urls, for now they are empty string

        const minimalizeDrawingUrl: string = '';
        const htmlViewFormUrl: string = '';

        const productTosave: Product = {
            ...createProductDto,
        };
        const savedProduct: Product = await this.repository.save(productTosave);
        const recordToReturn = await this.repository.findOne(savedProduct.id); // dont use just the value of save functions cause it does not see eager relations, always use getByIdAfterSave

        return recordToReturn;


    }

    public async updateProductById(id: string, createProductDto: CreateProductDto): Promise<Product> {
        const idOfExistingProduct: boolean = await this.findOneProductById(id) !== null;
        if (idOfExistingProduct) {

            // do not allow to update if other Product with the same filds already exists
            const productInDatabase: Product = await this.findOneProductByProductTypeProductTopTypeProductBottomTypeAndAppropriateCodes(createProductDto)
            if (productInDatabase && productInDatabase.softDeleteDate === null) {
                if (productInDatabase.id !== Number(id)) {
                    throw new ProductAlreadyExistsException();
                }
            }
            const productDataToUpdate: Product = {
                ...createProductDto,
            }
            const updateResult: UpdateResult = await this.repository.update(id, productDataToUpdate);
            if (updateResult.affected === 1) {
                const updatedProduct: Product = await this.findOneProductById(id);
                return updatedProduct;
            }

        } else {
            throw new ProductNotFoundExceptionn(id);
        }


    }

    public async deleteProductById(id: string): Promise<boolean> {
        let softDeletedRecord: Product;
        const recordToDelte = await this.findOneProductById(id);
        const idOfExistingRecord: boolean = recordToDelte !== null;
        if (idOfExistingRecord) {
            const recordTosoftDelete: Product = {
                ...recordToDelte,
                softDeleteDate: new Date()
            };
            softDeletedRecord = await this.repository.save(recordTosoftDelete);
        } else {
            throw new ProductNotFoundExceptionn(id);
        }
        if (softDeletedRecord && softDeletedRecord.softDeleteDate) {
            return true;
        } else {
            return false;
        }
    }


}

export default ProductService;
