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
const works = [
{
    title:"Їстівний букет",
    images:[ { src: "assets/images/gallery/food/1_result.webp", alt: "Їстівний подарунковий букет ручної роботи" },
      { src: "assets/images/gallery/food/2_result.webp", alt:"Їстівний подарунковий букет ручної роботи" },
     { src: "assets/images/gallery/food/3_result.webp", alt: "Їстівний подарунковий букет ручної роботи" },
      { src: "assets/images/gallery/food/4_result.webp", alt:"Їстівний подарунковий букет ручної роботи" },
     { src: "assets/images/gallery/food/5_result.webp", alt:"Їстівний подарунковий букет ручної роботи" },
     { src: "assets/images/gallery/food/6_result.webp", alt: "Їстівний подарунковий букет ручної роботи" },
    { src: "assets/images/gallery/food/7_result.webp", alt:"Їстівний подарунковий букет ручної роботи" },
    
{ src: "assets/images/gallery/food/9_result.webp", alt:"Їстівний подарунковий букет ручної роботи" },]
    
},
{
    title:"Букет з атласної стрічки",
    images:[{src:"assets/images/gallery/ribbon/1_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/2_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/3_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/4_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/5_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/6_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/7_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/8_result.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/9_result.webp", alt:"Букет із атласних стрічок handmade"},
         {src:"assets/images/gallery/ribbon/10_result.webp", alt:"Букет із атласних стрічок handmade"},
   ]
},
{
    title:"Декор речей",
    images:[{src:"assets/images/gallery/decor/1_result.webp",alt:"Декорування предметів ручної роботи"},
    {src:"assets/images/gallery/decor/2_result.webp",alt:"Декорування предметів ручної роботи"},
{src:"assets/images/gallery/decor/3_result.webp",alt:"Декорування предметів ручної роботи"},
{src:"assets/images/gallery/decor/4_result.webp",alt:"Декорування предметів ручної роботи"},
{src:"assets/images/gallery/decor/5_result.webp",alt:"Декорування предметів ручної роботи"},]
},
{
    title:"В'язання",
    images:[{src:"assets/images/cards/handmade_result.webp",alt:"В'язані вироби ручної роботи"},
        
    ]
}
];

const grid = document.getElementById("gallery-grid");

if(grid){

works.forEach(work=>{

grid.innerHTML += `
<div class="gallery-card" data-category="${work.title}"> 

<div class="gallery-image">
<img src="${work.images[0].src}" alt="${work.images[0].alt}" loading="lazy">
</div>

<div class="gallery-info">
<h3>${work.title}</h3>
</div>

</div>
`;

});}
document.addEventListener('click', (e) => {

const card = e.target.closest('[data-category]');
if(!card) return;

const categoryTitle = card.getAttribute('data-category');

const category = works.find(
w => w.title === categoryTitle
);

if(!category) return;

openGalleryModal(category.images);

});
function openGalleryModal(images){

const modal = document.createElement('div');
modal.className = "modal-gallery";

// 👉 wrapper
const wrapper = document.createElement('div');
wrapper.className = "modal-wrapper";

// 👉 scroll зона
const content = document.createElement('div');
content.className = "modal-content";

images.forEach(img=>{
    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;

    image.addEventListener("click", () => {
        openFullscreen(img.src, img.alt);
    });

    content.appendChild(image);
});

// 👉 footer
const footer = document.createElement('div');
footer.className = "modal-footer";

footer.innerHTML = `
<a href="contacts.html" class="order-btn">
    Замовити
</a>
`;

// 👉 close
const closeBtn = document.createElement('div');
closeBtn.className = 'modal-close';
closeBtn.innerHTML = "&times;";
closeBtn.onclick = () => modal.remove();
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.remove();
    }
});
// збірка
wrapper.appendChild(closeBtn);
wrapper.appendChild(content);
wrapper.appendChild(footer);

modal.appendChild(wrapper);
document.body.appendChild(modal);
}
function openFullscreen(src,alt){

const viewer = document.createElement("div");
viewer.className="fullscreen-img";

const img=document.createElement("img");
img.src=src;
img.alt=alt;

viewer.appendChild(img);

viewer.addEventListener("click",()=>{
viewer.remove();
});

document.body.appendChild(viewer);

}

