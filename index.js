/**
 * A utility function to determine if a function is a class.
 * @param {Function} func - The function to check
 * @returns {boolean} - True if the function is a class, false otherwise
 */
function isClass(func){
    const isClassBool = (typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func)));
    console.log("is it a class::::", isClassBool);
    return typeof func === 'function' && /^class\s/.test(Function.prototype.toString.call(func));
}

/**
 * A utility function to deep freeze an object
 * @param {object} - The user given object
 */

function deepFreeze(object){
    console.log("deep freeze");
        // Retrieve the property names defined on object
        const propNames = Object.getOwnPropertyNames(object);

        // Freeze properties before freezing self
        propNames.forEach(function(name) {
            const prop = object[name];
    
            // Freeze prop if it is an object and not null
            if (typeof prop === 'object' && prop !== null && !Object.isFrozen(prop)) {
                deepFreeze(prop); // Recursively freeze nested objects
            }
        });
    
        // Freeze self (no-op if already frozen)
        return Object.freeze(object);
}

/**
 * A decorator or function to make classes, properties, methods, and variables final.
 * @param {Object|Function} target - The target object, function, or a class.
 * @param {string} [key] - The property or method name.
 * @param {Object} [descriptor] - The property desciptor
 * @returns {Function|Object} - The final version of the input
 */
function final(target, key, descriptor){
    console.log("final function");
    if(isClass(target)){
        console.log("inside isClass");
        return finalClass(target);
    }
    else if(typeof target === 'object' && key === undefined && descriptor === undefined){
        // Final variable or object property
        console.log("before finalVariable function call");
        return finalVariable(target);
    }
    else if(typeof target === 'object' && typeof key === 'string'){
        console.log("weird else if call");
        // Final method or property
        if(typeof descriptor.value === 'function'){
            console.log("before finalMethod function call");
            return finalMethod(target, key, descriptor);
        } else {
            console.log("before finalProperty function call");
            return finalProperty(target,key,descriptor);
        }
    }
    else if(typeof target !== 'object'){
        console.log("Variables are here!!!!", typeof target);
        return finalPrimitive(target);
        // const obj = {
        //     get value() {
        //         return value;
        //     }
        // };
    
        return new Proxy(obj, {
            get(target, prop) {
                if (prop === Symbol.toPrimitive || prop === 'valueOf') {
                    return () => value;
                }
                return target[prop];
            },
            // Override toString() method to return the encapsulated value
            toString() {
                return value.toString();
            }
        });
    }
    else {
        throw new Error('Unsupported finalization');
    }
}

/**
 * Makes a class final by preventing inheritance and modification
 * @param {Function} Class - The class to make final
 * @returns {Function} - The final class.
 */

function finalClass(Class){
    console.log("Inside finalClass function:::");
    try {
        return new Proxy(Class, {
            construct(target, args) {
                const instance = new target(...args);
                Object.freeze(instance);
                return instance;
            },
            set(){
                throw new Error("Cannot modify a final class");
            },
            defineProperty() {
                throw new Error("Cannot modify a final class");
            },
            getPrototypeOf(){
                return null; // Prevents Inheritance
            }
        })     
    } catch (error) {
        console.log("Error ::",error);   
    }
}

/**
 * Makes a property final by preventing modification.
 * @param {Object} obj - The object containing the property.
 * @param {string} propertyName - The property name.
 * @param {Object} descriptor - The property descriptor.
 * @returns {Object} - The final property descriptor.
 */

function finalProperty(obj, propertyName, descriptor){
    console.log("Inside final Property:::");
    descriptor.writable = false;
    descriptor.configurable = false;
    Object.defineProperty(obj,methodName,descriptor);
    return descriptor;
}

/**
 * Makes a method final by preventing modification.
 * @param {Object} obj - The object containing the method.
 * @param {string} methodName - The method name.
 * @param {Object} desciptor - The method descriptor
 * @returns {Object} - The final method descriptor.
 */

function finalMethod(obj, methodName, descriptor){
    console.log("Inside final Method:::");
    descriptor.writable = false;
    descriptor.configurable = false;
    Object.defineProperty(obj,methodName,descriptor);
    return descriptor;
}

/**
 * Makes a variable final by preventing modification
 * @param {any} value - The variable value.
 * @returns {any} - The final variable value.
 */

function finalVariable(value){
    console.log("Inside final Variable:::");

    if(typeof value === 'object'){
        console.log("Inside OBJ type");
         // Deep freeze the object
        const deepFrozenObj = deepFreeze(JSON.parse(JSON.stringify(value)));

        // Return a new object that is also deep frozen
        return deepFrozenObj;

    }
    else {
        let obj = {};
        Object.defineProperty(obj, 'value', {
            value:value,
            writable:false,
            configurable:false
        });
        console.log(obj.value, "Cal");
        return obj.value;
    }
    return Object.freeze({value}).value;
}

/**
 * 
 */

function finalPrimitive(value){
    return new Proxy({value}, {
        set() {
            console.log("DO we call this as well?")
            throw new Error("Cannot modify a final variable");
        },
        get(target,prop) {
            console.log(target,prop);
            if(prop === 'value'){
                console.log("here", target[prop]);
                return target[prop];
            }
            console.log("Not here")
            return undefined;
        },
        ownKeys(target){
            console.log("Inside ownKeys")
            return ['value'];
        },
        getOwnPropertyDescriptor(target,prop) {
            console.log("Inside getOwnPropertyDescriptor")
            if(prop === 'value') {
                return {
                    value: target[prop],
                    writable: false,
                    configurable: false,
                    enumerable:true
                }
            }
        }
    }).value;
}

// function finalPrimitive(value) {
//     return new Proxy({},{
//         get(){
//             return value;
//         },
//         set(){
//             throw new Error("Cannot modify a final variable");
//         },
//         defineProperty(){
//             throw new Error("Cannot modify a final variable");
//         },
//         deleteProperty(){
//             throw new Error("Cannot modify a final variable");
//         }
//     });
// }

module.exports = {
    final
}