// let counter = 0;
// const counterValue = document.getElementById("counter-value");
// const incrementBtn = document.getElementById("increment-btn");
// const decrementBtn = document.getElementById("decrement-btn");
// const resetBtn = document.getElementById("reset");

// incrementBtn.addEventListener("click", () => {
//   counter++;
//   counterValue.innerText = counter;
// });

// decrementBtn.addEventListener("click", () => {
//   counter--;
//   counterValue.innerText = counter;
// });

// resetBtn.addEventListener("click", () => {
//   counter = 0;
//   counterValue.innerText = counter;
// });

// new Alert
// click event

// An element receives a click event when a pointing device button (such as a mouse's primary mouse button)
//  is both pressed and released while the pointer is located inside the element.

// If the button is pressed on one element and the pointer is moved outside the element before the button is released,
//  the event is fired on the most specific ancestor element that contained both elements.

const boxElement = document.getElementById("box");

// add a click event listener to the element.

boxElement.addEventListener("click", function () {
  alert("You Just Clicked Me 👍");
});