import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
getFirestore,
collection,
getDocs,
addDoc,
deleteDoc,
doc,
query,
where
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
cloudName:"dnaqxbnan",
uploadPreset:"gallery-upload"
};

const grid = document.getElementById("photos-grid");
const filter = document.getElementById("category-filter");
const fileInput = document.getElementById("photo-file");
const empty = document.getElementById("empty-state");

/* OPTIMIZE URL */

function getOptimizedUrl(url,optimized){

if(optimized) return url;

return url.replace(
"/upload/",
"/upload/f_auto,q_auto,w_600/"
);

}

/* LOAD CATEGORIES */

async function loadCategories(){

const snapshot = await getDocs(collection(db,"categories"));

snapshot.forEach(d=>{

const data = d.data();

const option = document.createElement("option");

option.value = data.name;
option.textContent = data.displayname;

filter.appendChild(option);

});

}

loadCategories();

/* LOAD PHOTOS */

async function loadPhotos(){

grid.innerHTML="";

const category = filter.value;

if(!category){

empty.style.display="block";
empty.innerText="Оберіть категорію";

return;

}

empty.style.display="none";

const q = query(
collection(db,"photos"),
where("category","==",category)
);

const snapshot = await getDocs(q);

if(snapshot.empty){

empty.style.display="block";
empty.innerText="Немає фото";

return;

}

snapshot.forEach(docSnap=>{
createPhotoCard(docSnap.id,docSnap.data());
});

}

filter.onchange = loadPhotos;

/* CARD */

function createPhotoCard(id,data){

const div = document.createElement("div");

div.className="photo-card";

const imgUrl = getOptimizedUrl(data.url,data.optimized);

div.innerHTML=`

<img src="${imgUrl}" loading="lazy">
<button>Видалити</button>

`;

div.querySelector("button").onclick=async ()=>{

if(!confirm("Видалити фото?")) return;

await deleteDoc(doc(db,"photos",id));

loadPhotos();

};

grid.appendChild(div);

}

/* UPLOAD */

document.getElementById("upload-photo").onclick=()=>{

if(!filter.value){
alert("Оберіть категорію");
return;
}

fileInput.click();

};

fileInput.onchange = async ()=>{

const file = fileInput.files[0];

if(!file) return;

const category = filter.value;

const url = await uploadToCloudinary(file,category);

await addDoc(collection(db,"photos"),{

category:category,
url:url,
optimized:false,
createAt:new Date()

});

fileInput.value="";

loadPhotos();

};

/* CLOUDINARY UPLOAD */

async function uploadToCloudinary(file,category){

const safeCategory = category
.toLowerCase()
.replace(/\s+/g,"-");

const timestamp = Date.now();

const publicId = `gallery/${safeCategory}/${timestamp}`;

const form = new FormData();

form.append("file",file);
form.append("upload_preset",CLOUDINARY.uploadPreset);

form.append("folder", `gallery/${safeCategory}`);
form.append("public_id", timestamp);

const res = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,
{
method:"POST",
body:form
});

const data = await res.json();

return data.secure_url;

}