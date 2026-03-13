import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSTnP39YQzsi1OSOzGA4Q-2aBYdNoQwsk",
  authDomain: "gellery-4c603.firebaseapp.com",
  projectId: "gellery-4c603",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

const works = {};
let categories = [];

async function loadGallery(){

/* LOAD CATEGORIES */

const catSnapshot = await getDocs(collection(db,"categories"));

categories = [];

catSnapshot.forEach(doc=>{

const data = doc.data();

categories.push({
id: doc.id,
name: data.name,
displayname: data.displayname,
coverUrl: data.coverUrl,
order: data.order
});

});

/* SORT CATEGORIES */

categories.sort((a,b)=>a.order-b.order);

/* LOAD PHOTOS */

const snapshot = await getDocs(collection(db,"photos"));

snapshot.forEach(doc => {

const data = doc.data();

if(!data.category || !data.url) return;

if(!works[data.category]){
works[data.category] = [];
}

works[data.category].push({
src: data.url,
alt: "handmade робота",
optimized: data.optimized
});

});

renderGallery();

}

function renderGallery(){

const grid = document.getElementById("gallery-grid");

if(!grid) return;

grid.innerHTML = "";

categories.forEach(category => {

const images = works[category.name];

if(!images || images.length === 0) return;

const imageUrl = getOptimizedUrl(
category.coverUrl || images[0].src,
false
);

grid.innerHTML += `

<div class="gallery-card" data-category="${category.name}"> 

<div class="gallery-image">
<img src="${imageUrl}" loading="lazy">
</div>

<div class="gallery-info">
<h3>${category.displayname}</h3>
</div>

</div>

`;

});

}

document.addEventListener('click', (e) => {

const card = e.target.closest('[data-category]');
if(!card) return;

const categoryTitle = card.getAttribute('data-category');

const images = works[categoryTitle];

if(!images) return;

openGalleryModal(images);

});
function getOptimizedUrl(url, optimized){

if(optimized) return url;

return url.replace(
"/upload/",
"/upload/f_webp,q_auto:good,w_1600/"
);

}
function openGalleryModal(images){

const modal = document.createElement('div');
modal.className = "modal-gallery";

const wrapper = document.createElement('div');
wrapper.className = "modal-wrapper";

const content = document.createElement('div');
content.className = "modal-content";

images.forEach(img=>{

const image = document.createElement('img');

/* оптимізація */

const optimizedUrl = getOptimizedUrl(img.src, img.optimized);

image.src = optimizedUrl;
image.alt = img.alt;

image.addEventListener("click", () => {

openFullscreen(optimizedUrl, img.alt);

});

content.appendChild(image);
});

const footer = document.createElement('div');
footer.className = "modal-footer";

footer.innerHTML = `
<a href="contacts.html" class="order-btn">
Замовити
</a>
`;

const closeBtn = document.createElement('div');
closeBtn.className = 'modal-close';
closeBtn.innerHTML = "&times;";
closeBtn.onclick = () => modal.remove();

modal.addEventListener("click", (e) => {
if (e.target === modal) {
modal.remove();
}
});

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

/* більша якість для fullscreen */

img.src = src.replace(
"/upload/",
"/upload/f_webp,q_auto:good,w_1200/"
);

img.alt=alt;

viewer.appendChild(img);

viewer.addEventListener("click",()=>{
viewer.remove();
});

document.body.appendChild(viewer);

}

loadGallery();