import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getConnection, getManager, getRepository, Timestamp, UpdateResult} from "typeorm";
import Material from "../Models/Materials/material.entity";
import MaterialNotFoundExceptionn from "../Exceptions/MaterialNotFoundException";
import CreateMaterialDto from "../Models/Materials/material.dto";
import MaterialAlreadyExistsException from "../Exceptions/MaterialAlreadyExistsException";
import Product from "../Models/Products/product.entity";
import ProductNotFoundExceptionn from "../Exceptions/ProductNotFoundException";
import CreateProductDto from "../Models/Products/product.dto";
import ProductAlreadyExistsException from "../Exceptions/ProductAlreadyExistsException";
import Order from "../Models/Order/order.entity";
import CreateOrderDto from "../Models/Order/order.dto";
import UserService from "./userRepositoryService";
import MaterialService from "./materialRepositoryService";
import ProductService from "./productRepositoryService";
import OrderVersionRegister from "../Models/OrderVersionRegister/orderVersionRegister.entity";
import OrderDetails from "../Models/OrderDetail/orderDetails.entity";
import OrderNotFoundException from "../Exceptions/OrderNotFoundException";
import User from "../Models/Users/user.entity";
import NewestOrderNumber from "../Models/Order/newestOrderNumber";
import {register} from "ts-node";
import {MaximumIndexLetterVersionReached} from "../Exceptions/maximumIndexLetterVersionReached";


class OrderService implements RepositoryService {

    public repository = getRepository(Order);
    public manager=getManager();
    public productRepositoryService=new ProductService();
    public userRepositoryService=new UserService();
    public materialRepositoryService=new MaterialService();
    private collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    });

    public async findOneOrderById(id: string): Promise<Order> {
        const foundOrder: Order = await this.repository.findOne(id, {relations:["product","productMaterial"]});
        if (!foundOrder) {
            throw new OrderNotFoundException(id);
        }
        return foundOrder;


    }



    public async findAllOrders(): Promise<Order[]> {
        const foundOrders: Order[] = await this.repository.find({relations:["product","productMaterial"]});

        return foundOrders;

    }

    public async addNewOrder(createOrderDto: CreateOrderDto): Promise<Order> {
const orderVersionRegister = new OrderVersionRegister(createOrderDto.orderNumber);
        const orderToSave: Order = {
            // it would be good to add only id of related object, because actually they are save, in this version extra quring is required. I need to try to optimize this it time allows !!

            ...createOrderDto,
            register:orderVersionRegister, // this entity is saved due to cascade enabled

        };
        const savedOrder:Order = await this.repository.save(orderToSave);
        return savedOrder;

    }
    public async findOrderVersionRegisterById(id:string):Promise<OrderVersionRegister>{
        /*const foundRegister=  await this.manager.findOne(OrderVersionRegister,id,{relations:["orders"]});*/
        const orderRegisterByQueryBuilder= await getConnection().createQueryBuilder(OrderVersionRegister,'register')
            .leftJoinAndSelect("register.orders","orders")
            .leftJoinAndSelect('orders.creator','creators')
            .leftJoinAndSelect('orders.businessPartner','partners')
            .leftJoinAndSelect("orders.product",'products')
            .leftJoinAndSelect("products.productType",'types')
            .leftJoinAndSelect('types.vocabulary','v')
            .leftJoinAndSelect('v.localizedNames','names')
            .leftJoinAndSelect('names.language','l')
            .where("register.id = :id", {id:Number(id)})
            .orderBy("orders.date","DESC")
            .getOne();

      return orderRegisterByQueryBuilder;
    }
    public async findAllOrdersVersionsRegisters():Promise<OrderVersionRegister[]>{
        /*
         standard way is not sufficient because it causes tabel name is specyfied more than once problem due to intesive nesting and long standard alias names
         const ordersRegisters=await this.manager.find(OrderVersionRegister,{relations:["orders"]});
        return ordersRegisters;*/


        /*good way to resolve tabel name is specyfied more than once problem is using query builder, and leftJojn with short alias*/
        const orderRegisterByQueryBuilder= await getConnection().createQueryBuilder(OrderVersionRegister,'register')
            .leftJoinAndSelect("register.orders","orders")
            .leftJoinAndSelect('orders.creator','creators')
            .leftJoinAndSelect('orders.businessPartner','partners')
            .leftJoinAndSelect("orders.product",'products')
            .leftJoinAndSelect("products.productType",'types')
            .leftJoinAndSelect('types.vocabulary','v')
            .leftJoinAndSelect('v.localizedNames','names')
            .leftJoinAndSelect('names.language','l')
            .orderBy("orders.date","DESC")
            .printSql()
            .getMany();
        console.log(orderRegisterByQueryBuilder);
        return orderRegisterByQueryBuilder;
    }

    public async findAllCurentVerionsOfOrder():Promise<Order[]>{
        const ordersRegisters= await this.findAllOrdersVersionsRegisters();
        let currentOrders:Order[]=[];
        const sordOrder=1;  //ascending
            ordersRegisters.forEach(rg=>{
                if(rg) {
                    rg.orders.sort((a, b): number=>{
                        return this.collator.compare(String(a.id),String(b.id))*sordOrder;
                    });
                    currentOrders.push(rg.orders[rg.orders.length-1]);
                }


        });
            return currentOrders;

    }
    public async findAllCurentVerionsOfOrderForGivenPartnerCode(partnerCode:string):Promise<Order[]>{
        let allCurentOrders:Order[]=await this.findAllCurentVerionsOfOrder();// it would be good to query only orders for this business partner instead

      let ordersForBusinessPartnerWithThisCode:Order[]= [];
        allCurentOrders.forEach((order)=>{
            if(order && order.businessPartner.code ===partnerCode) {
                ordersForBusinessPartnerWithThisCode.push(order);
            }
        });

        return ordersForBusinessPartnerWithThisCode;

    }
    public async findAllCurentVerionsOfOrderForGivenPartnerId(partnerId:string):Promise<Order[]>{
        let allCurentOrders:Order[]=await this.findAllCurentVerionsOfOrder();

        let ordersForBusinessPartnerWithThisId:Order[]=allCurentOrders.filter(o=>
            o.businessPartner.id===Number(partnerId));




        return ordersForBusinessPartnerWithThisId;

    }



    public async deleteOrderVersionRegisterById(currentOrderId:string){
       const currentOrder=await this.repository.findOne(currentOrderId);
       if(!currentOrder){
           throw new OrderNotFoundException(currentOrderId);
       }
       const orderRegisterToDeleteId=currentOrder.register.id;
       console.log(`currentOrder.register.id=${currentOrder.register.id}`);
       // other query is required to obtain orders in this OrderRegister, it cannot be done by currentOrder.orderVersionRegister.orders due to eager limitations
       const orderRegisterToDeleteObtainedWithDiffrentQuery=await this.manager.findOne(OrderVersionRegister,orderRegisterToDeleteId,{relations:["orders"]})
       const ordersOfOrderRegsterTODelete=orderRegisterToDeleteObtainedWithDiffrentQuery.orders;

/*
cascade removal of orderDetails does not work,
so i manually remove them in loop below. First i remove order, to avoid foreign key violation error.
On the end i remove version register object for given order, to remove all versions of this order

*/

        for(let i=0;i<ordersOfOrderRegsterTODelete.length;i++) {
            await this.manager.remove(Order, ordersOfOrderRegsterTODelete[i]);
            await this.manager.remove(OrderDetails, ordersOfOrderRegsterTODelete[i].orderDetails)
        }


            const deleteResult =await this.manager.remove(OrderVersionRegister,orderRegisterToDeleteObtainedWithDiffrentQuery);

        return deleteResult;

    }
    public async addNewVersionOfOrder(createOrderDto: CreateOrderDto,currentOrderId:string): Promise<Order> {
        const currentOrder:Order=await this.findOneOrderById(currentOrderId);

const registerToUpdate:OrderVersionRegister= currentOrder.register;

        const newVersionOfOrderToSaveInRegister: Order = {
            ...createOrderDto,
            register: registerToUpdate
        };


        const savedOrder:Order = await this.repository.save(newVersionOfOrderToSaveInRegister);
        return savedOrder;

    }

    public async obtainOrderNumberForNewOrder():Promise<NewestOrderNumber>{
        const orderRegisters=await this.findAllOrdersVersionsRegisters();
        let newestNumber:number;
        const sortOrderAscending= 1;
        const sortOrderDescending= -1;
        let sortOrder: number;
        sortOrder=sortOrderAscending;

        orderRegisters.sort((a, b): number=>{
            if(a.id<b.id){
                return -1* sortOrder;

            }
            else if(a.id>b.id) {
                return 1*sortOrder
            }
            else {
                return 0
            }

        });

        if(orderRegisters&&orderRegisters.length>0){
            let newestOrderNumberinDataBase:number=orderRegisters[orderRegisters.length-1].id+1;
       newestNumber=newestOrderNumberinDataBase;
        }
        else {  // no ordersREgistersFound(they are created with addingOrders) which means that it is first order in database

            newestNumber=1;
        }
        const newestOrderNumber: NewestOrderNumber = {newestNumber:newestNumber };
        return newestOrderNumber;

    }

    public getCurrentDateAndTime():string{
        let now = new Date();
        let date = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
        let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
        let dateAndTimeNow=date+' '+time;
        return dateAndTimeNow;

    }

    public async findOneOrderByIndex(index: string): Promise<Order> {
        const orderWithThisIndexInDatabase: Order=await getConnection()
            .createQueryBuilder(Order,'order')
            .where("order.index: index", {index: index})
            .getOne();
        return orderWithThisIndexInDatabase;
    }

    public async setNewIndexWithNewVersionLetterForDubledOrdersWithDiffrentOrderNumber(createOrderDto: CreateOrderDto): Promise<string> {

        const partOfIndexBeforeVersionLetter= createOrderDto.index.substring(0,10); //10 is not included
        const partOfIndexAfterVersionLetter= createOrderDto.index.substring(11);
        let updatedIndexToReturn: string;

        const allorders: Order[]= await getConnection().createQueryBuilder(Order,'order')


            .orderBy("order.index","ASC")
            .getMany();
        //.where("order.index like :partBefore and order.index like: partAfter", {partBefore:partOfIndexBeforeVersionLetter, partAfter:partOfIndexAfterVersionLetter})
        console.log(`allorders.length= ${allorders.length}`);

        const ordersWithTheSamePartialIndex = allorders.filter(x=> x.index.includes(partOfIndexBeforeVersionLetter) && x.index.includes(partOfIndexAfterVersionLetter));
        console.log(`ordersWithSameIndex.length= ${ordersWithTheSamePartialIndex.length}`);
        const ordersWithPartialIndexIncludesIndexFromDtoForDifferentOrderNumber=ordersWithTheSamePartialIndex.filter(i=>i.index===createOrderDto.index &&i.orderNumber!==createOrderDto.orderNumber).length>0; //index already included in database for different order number
       const ordersWithTheSameIndexAndDiffrentOrderNumber= ordersWithTheSamePartialIndex.filter(x=>String(x.orderNumber)!==(String(createOrderDto.orderNumber)));
       // const changeCondition= ordersWithTheSameIndexAndDiffrentOrderNumber.length>0;
        if(ordersWithTheSamePartialIndex.length>0&&ordersWithPartialIndexIncludesIndexFromDtoForDifferentOrderNumber===true){
            // more than one same index, so VersionLetterNeedToBeIncremented if differs by order Number

                let indexIsFree: boolean=false;
                let incrementedSpecialLetter='A';
                updatedIndexToReturn= partOfIndexBeforeVersionLetter+incrementedSpecialLetter+partOfIndexAfterVersionLetter
                while (indexIsFree===false) {
                    console.log(`updatedIndexToReturnBeforeFiltring=${updatedIndexToReturn}`);
                   let ordersWithSameIndexInDatabaseLikeUpdatedIndexToReturn= ordersWithTheSameIndexAndDiffrentOrderNumber.filter(o=>o.index===updatedIndexToReturn);
                   console.log(`ordersWithSameIndexAsInDto.length=${ordersWithSameIndexInDatabaseLikeUpdatedIndexToReturn.length}`);
                    if(ordersWithSameIndexInDatabaseLikeUpdatedIndexToReturn.length>0){
                        incrementedSpecialLetter=this.nextChar(incrementedSpecialLetter);
                        updatedIndexToReturn= partOfIndexBeforeVersionLetter+incrementedSpecialLetter+partOfIndexAfterVersionLetter;
                    }
                    else{
                        updatedIndexToReturn= partOfIndexBeforeVersionLetter+incrementedSpecialLetter+partOfIndexAfterVersionLetter;
                        indexIsFree= true;

                    }

                }

                console.log(`incrementedSpecialLetter=${incrementedSpecialLetter}`);

            }
            else {
                updatedIndexToReturn=null;
            }


        return updatedIndexToReturn;

    }


    public nextChar(c: string) {
        const charCodeForZ='Z'.charCodeAt(0);
        console.log(`charcodeForZ= ${charCodeForZ}`);
        const charcodeToObtain= c.charCodeAt(0) + 1;
        console.log(`charcodeToObtain= ${charcodeToObtain}`);
        if(charcodeToObtain>charCodeForZ){
            throw new MaximumIndexLetterVersionReached();
        }
        return String.fromCharCode(charcodeToObtain);

    }


}

export default OrderService;
