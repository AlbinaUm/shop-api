import {promises as fs} from 'fs';

const fileName = './test.json';

interface FileContext {
    message: string;
}

const run = async () => {
    try {
        const fileContents = await fs.readFile(fileName);
        const result = await JSON.parse(fileContents.toString()) as FileContext;
        console.log('Message is', result.message);
    } catch (e) {
        console.error(e);
    }
};

run().catch((err) => console.error(err));