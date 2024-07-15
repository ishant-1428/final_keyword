const { final } = require('./index');

// Testing whether newObj is immutable
        const obj = {1:2,2:{2:2}};

        const newObj = final(obj);
        // const newObj = {1:2,2:3};
        // const newObj = final(JSON.parse(JSON.stringify(obj)));

        console.log("Object 1::",obj);
        console.log("Object 2::", newObj);

        console.log("------------AFTER CHANGING VALUES----------");

        try {
            obj[2][2] = "d";
            newObj[2][2] = "ds";
        console.log(obj);   
        console.log(newObj);
        } catch (error) {
            console.log("Error :::",error);
        }

// Test 2: testing for all variable types

let val = 20;
// console.log("Direct Console",final(val));
// let newVal = final(val);

// console.log(val,newVal);

// val = 30;
// newVal = 40;
// console.log(val,newVal);

// const a = {1:{2:3}};
// Object.freeze(a);
// let b = final()
// console.log(a);
// a[1][2] = 20;
// console.log(a);