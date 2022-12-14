//** Page Acceuil **/
 
/**
 Récupérer tous les articles du site pour pouvoir les afficher 
 @param { String } url
 @return { Promise }
 **/

 // Récupérer le localhost pour pouvoir modifier l'URL par la suite 
 const url = "http://localhost:3000/api/products";


// Fonction pour afficher tout les produits dans la page d'acceuil
 function displayProduct(url) {
   fetch(url)
     .then(function (res) {
       if (res.ok) {
         return res.json();
       }
     })
     .then(function (articles) {
       for (let article of articles) {
         addItemAtHome(
           article._id,
           article.imageUrl,
           article.altTxt,
           article.name,
           article.description
         );
       }
     })
     .catch(function (err) {
     });
 }
 displayProduct(url);
 
 /** Création d'un item/article pour chaque résultat de la requête ajax sur la page d'accueil 
   @param { String } idItem
   @param { String } imageUrl
   @param { String } imageAlt
   @param { String } name
   @param { String } description
  **/

   // Fonction pour créer les éléments HTML du produit 
 function addItemAtHome(idItem, imageUrl, imageAlt, name, description) {
   var items = document.getElementById("items");
 
   // Création du lien de l'article
   let linkItem = document.createElement("a");
   linkItem.href = "./product.html?id=" + idItem;
   items.append(linkItem);
 
   // Création de l'article
   let articleItem = document.createElement("article");
   linkItem.append(articleItem);
 
   // Création de l'image de l'article
   let pictureItem = document.createElement("img");
   pictureItem.src = imageUrl;
   pictureItem.alt = imageAlt;
   articleItem.append(pictureItem);
 
   // Création du titre de l'article
   let titleItem = document.createElement("h3");
   titleItem.textContent = name;
   titleItem.classList.add("productName");
   articleItem.append(titleItem);
 
   // Création de la description de l'article
   let descriptionItem = document.createElement("p");
   descriptionItem.textContent = description;
   descriptionItem.classList.add("productDescription");
   articleItem.append(descriptionItem);
 }