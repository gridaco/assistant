import * as fs from "fs"


export function createFile() {
    var writeStream = fs.createWriteStream("./data/dynamic_file.txt");
    writeStream.write("Hi,  Users. I am generated after the /createFile get request. ");
    writeStream.write("Thank You.");
    writeStream.end();
}
