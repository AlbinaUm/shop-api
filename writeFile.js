"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fileName = './test.txt';
fs_1.default.writeFile(fileName, 'Hello world!', function (err) {
    if (err) {
        console.error(err);
    }
    console.log('File was saved!');
});
