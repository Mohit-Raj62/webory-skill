const express = require('express');
const app = express();

app.get('/random-number', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100); // generate a random number between 0 and 99
  res.json({ randomNumber: randomNumber });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


// const powerTwo = (n) => {


//   return n ** 2;
// };
// function powerCube(powerTwo, n) {
//   return powerTwo(n) * n;
// }
// console.log(powerCube(powerTwo,3));
// function sayHello() {
//   return () => {
//     console.log("Hello Mohit");
//   };
// }
// let guessvalue = sayHello();
// console.log(guessvalue)

// guessvalue();

// const higherOrder = (n) => {
//   const oneFun = (m) => {
//     const twoFun = (p) => {
//       return m + n + p;
//     };
//     return twoFun;
//   };
//   return oneFun;
// };
// console.log(higherOrder(2)(3)(4));

// const myNums = [3, 4 , 5, 6, 7, 8]

// const sumArray = arr =>{
//     let total = 0;
//     arr.forEach(function(element){
//         total += element

//     });
//     return total;
// }
// console.log(sumArray(myNums));
// function oneMoreHello(){
//     console.log("Hello Mohit!", Math.random());
// }

//  setInterval(oneMoreHello, 2000);
//  setTimeout(oneMoreHello,2000)
// let arr = [2, 3, 4, 5];

// arr.forEach(function (element, index, arr) {
//   console.log(index, element, arr);
// });
// arr.forEach((element, index, arr) => {
//   console.log("arrow:", index, element, arr);
// });
// const heros = ["naagraja", "doga", "pet", "kumaeraja", "hariraja"];

// heros.forEach((el) => {
//   console.log(el.toUpperCase());
// });
// arr.map(function (element, index, arr) {
//   console.log(element, index, arr);
// });
// heros.map((h) => console.log(h.toUpperCase()));
// // filters for
// console.log(heros);
// const heroWithRaja = heros.filter((h)=>{
//   return h.endsWith('raja');
// });
// console.log(heroWithRaja);