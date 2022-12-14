//** Page Confirmation **/

// Récuperation de l'ID du produit
const getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const orderId = getProductId();

// Récupération des données du localStorage
const cart = JSON.parse(localStorage.getItem("cart"));

// Confirmation de l'ID de la commande 
const idConfirmation = document.querySelector("#orderId");

// Bouton pour retourner à l'acceuil
const btnRetourHtml = `<a href="./index.html"> <p>Retour à l'accueil</p> </a>`;

//Affichage de l'orderID dans le DOM
(function () {
  idConfirmation.innerHTML = `
  <br>
  <strong>${orderId}</strong>. <br>
  <br>
  `;

  idConfirmation.insertAdjacentHTML("beforeend", btnRetourHtml);

  localStorage.clear();
})();