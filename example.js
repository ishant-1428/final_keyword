// example.js

// const Final = require('./index');
const { final } = require('./index');

// @final
// class MyClass {
//     constructor(name){
//         this._name = name;
//         final(this,'_name', {value : name});
//     }
// }

// class ExtendedClass extends MyClass{
    
//     constructor(logValue){
//         this.logValue = logValue;
//     }

//     logValueMethod(){
//         console.log(this.logValue);
//     }
// }

// const shouldThrowErrorClass = new ExtendedClass('Val');
// shouldThrowErrorClass.logValueMethod();

class FinalClass {
    constructor(name){
        this._name = name;
        // final(this, '_name', {value:name});
    }

    get name() {
        return this._name;
    }
}

console.log("Testing final class.....");
try {
    // @final
    

    const FinalsClass = final(FinalClass);
    const instance = new FinalsClass('Test');
    const instance2 = new FinalClass("Test B");
    console.log(instance._name);
    // console.log(instance2.name);

    instance._name = 'New Name'
    console.log(instance._name);
    // 2nd case
    // instance2._name = 'dasdsa';
    // console.log(instance2._name);

} catch (error) {
    console.log("Error::::",error);
}

// Testing for inheritance inside Classes:

try {
    const FinalsClass = final(FinalClass);
    class SubClass extends FinalsClass {
        constructor() {
            super();
            this.additionalMessage = 'Hello from SubClass';
        }
    }
    // const instance = new SubClass();
    // console.log(instance.additionalMessage);
} catch (error) {
    console.log("Error inside inheritance class:",error);
}


//defining a final variable
// const finalVar = new Final('a','string');
// console.log(finalVar.a);

// Attempt to reassign the variable (should throw an error)
// try {
//     finalVar.a = 'z';
// } catch (error) {
//     console.log("Error :::",error);
// }

// Attempt to modify the value (should throw an error)
// try {
//     finalVar.a.push(10);
// } catch (error) {
//     console.log("Error :::",error);
// }
