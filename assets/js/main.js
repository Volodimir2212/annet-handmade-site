const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

burger.addEventListener("click", () => {
    menu.classList.toggle("active");
});
document.querySelectorAll(".menu a")
.forEach(link=>{
    link.addEventListener("click",()=>{
        menu.classList.remove("active");
    });
});