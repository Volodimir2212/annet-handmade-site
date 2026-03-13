import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {

apiKey: "AIzaSyBSTnP39YQzsi1OSOzGA4Q-2aBYdNoQwsk",
authDomain: "gellery-4c603.firebaseapp.com",
projectId: "gellery-4c603"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBox = document.getElementById("login-box");
const adminPanel = document.getElementById("admin-panel");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

loginBtn.addEventListener("click", async () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

}catch(e){

alert("Помилка входу");

}

});

logoutBtn.addEventListener("click", () => {

signOut(auth);

});

onAuthStateChanged(auth,user=>{

if(user){

loginBox.style.display="none";
adminPanel.style.display="block";

loadCategories();


}else{

loginBox.style.display="block";
adminPanel.style.display="none";

}

});
document.getElementById("add-category").addEventListener("click", async ()=>{

const name = prompt("Назва категорії (англійською)");

if(!name) return;

const displayName = prompt("Назва для відображення");

if(!displayName) return;

await addDoc(collection(db,"categories"),{

name: name,
displayName: displayName,
order: Date.now(),
coverUrl: ""

});

loadCategories();

});
async function loadCategories(){

const list = document.getElementById("categories-list");

if(!list) return;

list.innerHTML = "";

const snapshot = await getDocs(collection(db,"categories"));

snapshot.forEach(docItem => {

const data = docItem.data();

const div = document.createElement("div");

div.style.marginBottom = "10px";

div.innerHTML = `
<b>${data.displayName}</b> (${data.name})
<button data-id="${docItem.id}">Видалити</button>
`;

const btn = div.querySelector("button");

btn.addEventListener("click", async ()=>{

await deleteDoc(doc(db,"categories",docItem.id));

loadCategories();

});

list.appendChild(div);

});

}