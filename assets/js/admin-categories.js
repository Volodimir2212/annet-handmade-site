import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
getFirestore,
collection,
getDocs,
setDoc,
doc,
deleteDoc,
updateDoc,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE */

const firebaseConfig = {
apiKey: "AIzaSyBSTnP39YQzsi1OSOzGA4Q-2aBYdNoQwsk",
authDomain: "gellery-4c603.firebaseapp.com",
projectId: "gellery-4c603"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

onAuthStateChanged(auth,(user)=>{

if(!user){
window.location.href="admin.html";
}

});
/* CLOUDINARY */

const CLOUDINARY = {
cloudName: "dnaqxbnan",
uploadPreset: "gallery-upload"
};

const list = document.getElementById("categories-list");

/* LOAD CATEGORIES */

async function loadCategories(){

list.innerHTML="";

const snapshot = await getDocs(collection(db,"categories"));

const categories = [];

snapshot.forEach(d=>{
categories.push({id:d.id,...d.data()});
});

categories.sort((a,b)=>a.order-b.order);

categories.forEach(cat=>{

const div = document.createElement("div");

div.className="category-item";

div.dataset.id = cat.id;

div.innerHTML = `
<div class="drag-handle">☰</div>
<img class="category-cover"
src="${cat.coverUrl || 'assets/images/logo/logo.png'}">

<div class="category-info">

<b>${cat.displayname}</b><br>
${cat.name}

</div>

<div class="category-actions">

<button data-gallery="${cat.id}">
Обрати фото
</button>

<button data-upload="${cat.id}">
Завантажити фото
</button>

<input type="file" data-file="${cat.id}" hidden>

<button data-delete="${cat.id}">
Видалити
</button>

</div>

`;

list.appendChild(div);

});

initSortable();

}

loadCategories();

/* EVENTS */

list.addEventListener("click", async (e)=>{

/* DELETE CATEGORY */

if(e.target.dataset.delete){

const id = e.target.dataset.delete;

deleteCategory(id);

}

/* UPLOAD BUTTON */

if(e.target.dataset.upload){

const id = e.target.dataset.upload;

document.querySelector(`[data-file="${id}"]`).click();

}

/* SELECT FROM GALLERY */

if(e.target.dataset.gallery){

const category = e.target.dataset.gallery;

openGallerySelector(category);

}

});

/* FILE CHANGE */

list.addEventListener("change", async (e)=>{

if(!e.target.dataset.file) return;

const category = e.target.dataset.file;

const file = e.target.files[0];

if(!file) return;

/* upload to cloudinary */

const url = await uploadToCloudinary(file,category);

/* add photo to firestore */

await addDoc(collection(db,"photos"),{

category:category,
url:url,
optimized:false,   // нові фото оптимізуємо
createAt:new Date()

});

/* set cover */

await updateDoc(doc(db,"categories",category),{

coverUrl:url

});

/* reset input */

e.target.value="";

loadCategories();

});

/* ADD CATEGORY */

document.getElementById("add-category").onclick = async ()=>{

const name = document.getElementById("name").value.trim();
const displayname = document.getElementById("displayname").value.trim();

if(!name || !displayname){
alert("Заповніть поля");
return;
}

await setDoc(doc(db,"categories",name),{

name:name,
displayname:displayname,
order:Date.now(),
coverUrl:""

});

loadCategories();

};

/* DELETE CATEGORY FUNCTION */

async function deleteCategory(category){

const confirmDelete = confirm(
"Видалити категорію та всі фото?"
);

if(!confirmDelete) return;

/* знайти всі фото */

const snapshot = await getDocs(collection(db,"photos"));

const deletes=[];

snapshot.forEach(d=>{

const data=d.data();

if(data.category===category){

deletes.push(deleteDoc(doc(db,"photos",d.id)));

}

});

/* видалити фото */

await Promise.all(deletes);

/* видалити категорію */

await deleteDoc(doc(db,"categories",category));

/* лог видалення */

await addDoc(collection(db,"deletedCategories"),{

category:category,
deletedAt:new Date()

});

loadCategories();

}

/* SORT */

function initSortable(){

new Sortable(list,{

animation:150,
handle: ".drag-handle",
onEnd: async ()=>{

const items = [...list.children];

const updates = [];

items.forEach((item,index)=>{

const id = item.dataset.id;

updates.push(
updateDoc(doc(db,"categories",id),{order:index})
);

});

await Promise.all(updates);

}

});

}

/* CLOUDINARY UPLOAD */

async function uploadToCloudinary(file,category){

const form = new FormData();

form.append("file",file);
form.append("upload_preset",CLOUDINARY.uploadPreset);

/* створює папку gallery/category */

form.append("folder",`gallery/${category}`);


const res = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,
{
method:"POST",
body:form
});

const data = await res.json();

return data.secure_url;

}

/* SELECT PHOTO FROM GALLERY */

async function openGallerySelector(category){

const snapshot = await getDocs(collection(db,"photos"));

const overlay = document.createElement("div");
overlay.className="gallery-modal";

const modal = document.createElement("div");
modal.className="gallery-modal-window";

const header = document.createElement("div");
header.className="gallery-modal-header";

header.innerHTML = `
<h3>Обрати фото</h3>
<button class="gallery-close">✕</button>
`;

const content = document.createElement("div");
content.className="gallery-modal-content";

snapshot.forEach(docSnap=>{

const data = docSnap.data();

if(data.category !== category) return;

const img = document.createElement("img");

img.src=data.url;

img.loading="lazy";

img.onclick = async ()=>{

await updateDoc(doc(db,"categories",category),{
coverUrl:data.url
});

overlay.remove();

loadCategories();

};

content.appendChild(img);

});

/* close */

overlay.onclick=(e)=>{
if(e.target===overlay){
overlay.remove();
}
};

header.querySelector(".gallery-close").onclick=()=>{
overlay.remove();
};

modal.appendChild(header);
modal.appendChild(content);
overlay.appendChild(modal);

document.body.appendChild(overlay);

}