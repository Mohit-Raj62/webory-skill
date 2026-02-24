// Get the password and confirm password elements
var password = document.getElementById("password");
var confirm = document.getElementById("confirm");

// Define a function to check if the passwords match
function validatePassword() {
  // If the passwords match, log a success message
  if (password.value == confirm.value) {
    console.log("Password matched. Password validation successful.");
  }
  // Otherwise, log an error message
  else {
    console.log("Password didn't match. Password validation unsuccessful.");
  }
}

// Add an event listener to the confirm password element
// to trigger the validation function on input
confirm.addEventListener("input", validatePassword);