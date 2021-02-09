// @ts-ignore
import { ConnectionOptions } from 'typeorm';
// @ts-ignore
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import User from "./src/Models/Users/user.entity";
import Role from "./src/Models/Role/role.entity";
import BlackListedToken from "./src/Models/BlackListedTokenEntity/blackListedToken.entity";
import DimensionCode from "./src/Models/DimesnionCodes/diemensionCode.entity";
import Language from "./src/Models/Languages/language.entity";
import Material from "./src/Models/Materials/material.entity";
import Order from "./src/Models/Order/order.entity";
import OrderDetails from "./src/Models/OrderDetail/orderDetails.entity";
import OrderVersionRegister from "./src/Models/OrderVersionRegister/orderVersionRegister.entity";
import Product from "./src/Models/Products/product.entity";
import ProductBottom from "./src/Models/Products/productBottom.entity";
import ProductTop from "./src/Models/Products/productTop.entity";
import ProductType from "./src/Models/Products/productType.entity";
import Vocabulary from "./src/Models/Vocabulary/vocabulary.entity";

const config = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [Role, User, BlackListedToken, DimensionCode, Language, Material, Order, OrderDetails, OrderVersionRegister, Product, ProductBottom, ProductTop, ProductType, Vocabulary],
    synchronize: true,
};
const config_test = {

    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_TEST_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_TEST_DB,
    entities: [
        __dirname + '/../**/*.entity.{js,ts}'
    ],
    synchronize: true,
    dropSchema: true,
    logging: false
};

export {config,config_test}
