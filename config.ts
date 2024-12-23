import path from "path";
import {mySQLPassword} from "./private";

const rootPath  = __dirname;

const config =  {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    dataBase: {
        host: 'localhost',
        user: 'root',
        password: mySQLPassword,
        database: 'shop_db',
    }
};


export default config;