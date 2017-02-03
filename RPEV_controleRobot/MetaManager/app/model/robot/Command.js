"use strict";

var CommandType = require('../Utility').CommandTypes;

class Command{
    constructor(commandType, args){
        if(commandType && typeof commandType === "string"){
            this._command = CommandType.get(commandType);
        }else {
            this._command = commandType;
        }

        this._args = args;

        try{
            this.verifyCommand();
        }catch (error) {
            console.log(error);
            return Object.create(null);
        }
    }

    execute(){
        return this._command.cmd + ((this._args !== undefined) && (this._command.args === 1) ? " " + this._args : "");
    }

    verifyCommand(){
        if(this._args && this._command.args > 0){
            if(this._command.type === "number" && typeof this._args !== "number")
                throw "Error, invalid argument";
            if(this._command.type === "boolean" && typeof this._args !== "boolean")
                throw "Error, invalid argument";
        }
    }

    getCommandType(){
        return this._command;
    }
    
    equals(command){
        return this._command == command._command && this._args == command._args;
    }
}
module.exports = Command;