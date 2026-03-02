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
    images:[ { src: "assets/images/gallery/food/1.webp", alt: "Їстівний подарунковий букет ручної роботи" },
      { src: "assets/images/gallery/food/2.webp", alt:"Їстівний подарунковий букет ручної роботи" },
     { src: "assets/images/gallery/food/3.webp", alt: "Їстівний подарунковий букет ручної роботи" },
      { src: "assets/images/gallery/food/4.webp", alt:"Їстівний подарунковий букет ручної роботи" },
     { src: "assets/images/gallery/food/5.webp", alt:"Їстівний подарунковий букет ручної роботи" },
     { src: "assets/images/gallery/food/6.webp", alt: "Їстівний подарунковий букет ручної роботи" },
    { src: "assets/images/gallery/food/7.webp", alt:"Їстівний подарунковий букет ручної роботи" },
    { src: "assets/images/gallery/food/8.webp", alt:"Їстівний подарунковий букет ручної роботи" },]
    
},
{
    title:"Букет з атласної стрічки",
    images:[{src:"assets/images/gallery/ribbon/1.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/2.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/3.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/4.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/5.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/6.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/7.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/8.webp", alt:"Букет із атласних стрічок handmade"},
        {src:"assets/images/gallery/ribbon/9.webp", alt:"Букет із атласних стрічок handmade"},
   ]
},
{
    title:"Декор речей",
    images:[{src:"assets/images/gallery/decor/1.webp",alt:"Декорування предметів ручної роботи"},
    {src:"assets/images/gallery/decor/2.webp",alt:"Декорування предметів ручної роботи"},
{src:"assets/images/gallery/decor/3.webp",alt:"Декорування предметів ручної роботи"},
{src:"assets/images/gallery/decor/4.webp",alt:"Декорування предметів ручної роботи"},]
},
{
    title:"В'язання",
    images:[{src:"assets/images/gallery/knitting/1.webp",alt:"В'язані вироби ручної роботи"},
        {src:"assets/images/gallery/knitting/1.webp",alt:"В'язані вироби ручної роботи"},
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

});
grid.addEventListener('click', (e) => {
  const card = e.target.closest('.gallery-card');
  if (!card) return;

  const categoryTitle = card.getAttribute('data-category');
  const category = works.find(w => w.title === categoryTitle);
  if (!category) return;

  openGalleryModal(category.images);
});

function openGalleryModal(images) {
  // Створюємо контейнер модального вікна
  const modal = document.createElement('div');
  modal.classList.add('modal-gallery');
  modal.style.position = 'fixed';
  modal.style.top = 0;
  modal.style.left = 0;
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.8)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.overflow = 'auto';
  modal.style.zIndex = 1000;

  // Контент галереї
  const galleryContent = document.createElement('div');
  galleryContent.style.background = '#fff';
  galleryContent.style.padding = '20px';
  galleryContent.style.borderRadius = '8px';
  galleryContent.style.maxWidth = '90vw';
  galleryContent.style.maxHeight = '90vh';
  galleryContent.style.overflowY = 'auto';
  galleryContent.style.display = 'flex';
  galleryContent.style.flexWrap = 'wrap';
  galleryContent.style.gap = '10px';

  images.forEach(img => {
    const imageElem = document.createElement('img');
    imageElem.src = img.src;
    imageElem.alt = img.alt;
    imageElem.style.maxWidth = '200px';
    imageElem.style.borderRadius = '4px';
    galleryContent.appendChild(imageElem);
  });

  // Додаємо кнопку закриття
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Закрити';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '20px';
  closeBtn.style.right = '20px';
  closeBtn.style.padding = '10px 15px';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.cursor = 'pointer';

  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  modal.appendChild(closeBtn);
  modal.appendChild(galleryContent);
  document.body.appendChild(modal);
}

}
