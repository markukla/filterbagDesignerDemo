import 'reflect-metadata';
import 'es6-shim';
import  'dotenv/config';
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import * as typeorm from "typeorm";

import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {config_test} from "../../../ormconfig";
import {
    insertInitVocabulariesToDatabase,
    insertRolesToDatabase, insertTestLanguagesToDatabase,
    insertTestMaterialsToDatabase,
    insertTestUsersToDatabase
} from "./insertTestDataToDatabase";


async function connectToDatabase(config:any){
    try {
      await createConnection(config);
        console.log(`connected to database=${config.database} on port ${config.port} `);
        await insertRolesToDatabase();
        await insertTestUsersToDatabase();
        await insertTestMaterialsToDatabase();
        await insertTestLanguagesToDatabase();
        //await insertTestDimensionCodesToDatabase();
        await insertInitVocabulariesToDatabase();

      } catch (error) {
        console.log('Error while connecting to the database', error);

    }


}
 async function closeConnectionToDatabase(config:any) {
   await typeorm.getConnection().close();
    console.log(`connection to database= ${config.database} has been closed`);
}

async function clearDatabase(config:any) {
    await typeorm.getConnection().dropDatabase();
    console.log(` database= ${config.database} has been droped`);

}
export {connectToDatabase,closeConnectionToDatabase,clearDatabase};
