export class database{
    initValue: number;
    db: Map<string, number>;
    constructor(initValue: number){
        this.initValue = initValue;
        this.db = new Map<string, number>;
    }
    get(userID: string){
        if (!this.db.has(userID)) this.db.set(userID, this.initValue);
        return this.db.get(userID) as number;
    }
    add(userID: string, ammount: number){
        this.db.set(userID, this.get(userID) !+ ammount);
    }
    take(userID: string, ammount: number){
        if (this.has(userID, ammount)){
            this.db.set(userID, this.get(userID)-ammount);
        }
    }
    has(userID: string, ammount: number){
        return this.get(userID)>=ammount;
    }
    set(userID: string, ammount: number){
        this.db.set(userID, ammount);
    }
}
