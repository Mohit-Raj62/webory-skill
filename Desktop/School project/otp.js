function OTP(){
    return Math.floor(Math.random() * 9000009) + 10000;
}
console.log("your OTP is : ", OTP());