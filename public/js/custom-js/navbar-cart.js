document.addEventListener("DOMContentLoaded", function () 
{
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    document.querySelector(".number").innerText = Object.keys(cart).length;
});