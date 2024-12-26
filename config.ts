import path from "path";


const rootPath  = __dirname;

const config =  {
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    dataBase: {
        host: 'localhost',
        user: 'root',
        password: '324234',
        database: 'shop_db',
    }
};


export default config;