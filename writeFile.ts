import {promises as fs} from "fs";

const fileName = './test.txt';

const run = async () => {
    try {
        await fs.writeFile(fileName, JSON.stringify('Hello world'));
        console.log('File was saved!');
    } catch (e) {
        console.error(e);
    }
};

run().catch(e => console.error(e));