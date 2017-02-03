var assert = require('assert');

class MetaTests{
    constructor(name){
        this.name = name;
        this.tests = [];
        this.tests_index = 0;
    }

    addTest(value, expected, message){
        this.tests.push(() => assert.equal(value, expected, message));
    }

    doTests(){
        console.log("------Starting test suite "+this.name+"------");
        for(let test of this.tests){
            try {
                test();
                console.log("Test "+this.tests_index+" done");
            }catch(error){
                console.log("Test "+this.tests_index+" failed : " + error);
            }
            this.tests_index += 1;
        }
        console.log("-----END-----");
    }
}
module.exports = MetaTests;