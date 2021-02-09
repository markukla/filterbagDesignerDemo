import RepositoryService from "../interfaces/service.interface";
import {DeleteResult, getManager, getRepository, Timestamp, UpdateResult} from "typeorm";
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


class OrderService implements RepositoryService {

    public repository = getRepository(Order);
    public manager=getManager();
    public productRepositoryService=new ProductService();
    public userRepositoryService=new UserService();
    public materialRepositoryService=new MaterialService();

    public async findOneOrderById(id: string): Promise<Order> {
        const foundOrder: Order = await this.repository.findOne(id);
        if (!foundOrder) {
            throw new OrderNotFoundException(id);
        }
        return foundOrder;


    }



    public async findAllOrders(): Promise<Order[]> {
        const foundOrders: Order[] = await this.repository.find();

        return foundOrders;

    }

    public async addNewOrder(createOrderDto: CreateOrderDto): Promise<Order> {
const orderVersionRegister = new OrderVersionRegister(createOrderDto.orderNumber);
        const orderToSave: Order = {
            // it would be good to add only id of related object, because actually they are save, in this version extra quring is required. I need to try to optimize this it time allows !!

            ...createOrderDto,
            orderVersionRegister:orderVersionRegister, // this entity is saved due to cascade enabled

        };
        const savedOrder:Order = await this.repository.save(orderToSave);
        return savedOrder;

    }
    public async findOrderVersionRegisterById(id:string):Promise<OrderVersionRegister>{
      const foundRegister=  await this.manager.findOne(OrderVersionRegister,id,{relations:["ordersInthisRegister"]});
      return foundRegister
    }
    public async findAllOrdersVersionsRegisters():Promise<OrderVersionRegister[]>{
        const ordersRegisters=await this.manager.find(OrderVersionRegister,{relations:["ordersInthisRegister"]});
        return ordersRegisters;
    }

    public async findAllCurentVerionsOfOrder():Promise<Order[]>{
        const ordersRegisters= await this.findAllOrdersVersionsRegisters();
        let currentOrders:Order[]=[];

            ordersRegisters.forEach(rg=>{
               currentOrders.push(rg.ordersInthisRegister[rg.ordersInthisRegister.length-1]);

        });
            return currentOrders;

    }
    public async findAllCurentVerionsOfOrderForGivenPartnerCode(partnerCode:string):Promise<Order[]>{
        let allCurentOrders:Order[]=await this.findAllCurentVerionsOfOrder();// it would be good to query only orders for this business partner instead

      let ordersForBusinessPartnerWithThisCode:Order[]=allCurentOrders.filter(o=>
          o.businessPartner.code===partnerCode);




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
       const orderRegisterToDeleteId=currentOrder.orderVersionRegister.id;
       // other query is required to obtain orders in this OrderRegister, it cannot be done by currentOrder.orderVersionRegister.orders due to eager limitations
       const orderRegisterToDeleteObtainedWithDiffrentQuery=await this.manager.findOne(OrderVersionRegister,orderRegisterToDeleteId,{relations:["ordersInthisRegister"]})
       const ordersOfOrderRegsterTODelete=orderRegisterToDeleteObtainedWithDiffrentQuery.ordersInthisRegister;

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

const registerToUpdate:OrderVersionRegister= currentOrder.orderVersionRegister;

        const newVersionOfOrderToSaveInRegister: Order = {
            ...createOrderDto,
            orderVersionRegister: registerToUpdate
        };


        const savedOrder:Order = await this.repository.save(newVersionOfOrderToSaveInRegister);
        return savedOrder;

    }

    public async obtainOrderNumberForNewOrder():Promise<NewestOrderNumber>{
        const orderRegisters=await this.findAllOrdersVersionsRegisters();
        let newestNumber:number;
        if(orderRegisters&&orderRegisters.length>0){
            let newestOrderNumberinDataBase:number=orderRegisters.length+1
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





}

export default OrderService;
