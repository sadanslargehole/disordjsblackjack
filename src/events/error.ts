import { myClient } from 'src/main';

module.exports = (client: myClient , err: Error): void=>{
    console.table(err);
};