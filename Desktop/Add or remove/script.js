var istatus = document.querySelector("h5");

var btn = document.querySelector("#add");
var check = 0;

btn.addEventListener("click", function () {
  if (check == 0) {
    istatus.innerHTML = "Friend";
    istatus.style.color = "green";
    btn.innerHTML = "Remove Friend";
    check = 1;
  } else {
    istatus.innerHTML = "Strange";
    istatus.style.color = "red";
    btn.innerHTML = "Add Friend";
    check = 0;
  }
});
