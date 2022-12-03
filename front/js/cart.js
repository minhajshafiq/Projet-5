// Récupération du localStorage
let cart = JSON.parse(localStorage.getItem("cart"));

// Variable pour stocker les ID de chaque articles présent dans le panier
let products = [];

// Variable qui récupère l'orderID envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

// Affichage du contenu du panier
async function displayCart() {
  const parser = new DOMParser();
  const positionEmptyCart = document.getElementById("cart__items");
  let cartArray = [];

  // Si le localstorage est vide
  if (cart === null || cart === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
  } else {
    console.log("Des produits sont présents dans le panier");
  }
  
  // Si le localstorage contient des produits afficher le panier avec le produit
  for (i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i].id);
    const totalPriceItem = (product.price *= cart[i].quantity);
    cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                  <div class="cart__item__img">
                      <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                      <div class="cart__item__content__description">
                          <h2>${product.name}</h2>
                          <p>${cart[i].color}</p>
                          <p>Prix unitaire: ${product.price}€</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p id="quantité">
                              Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                            </p>
                            <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </article>`;
  }
  // Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale
  let totalQuantity = 0;
  let totalPrice = 0;

  for (i = 0; i < cart.length; i++) {
    const article = await getProductById(cart[i].id);
    totalQuantity += parseInt(cart[i].quantity);
    totalPrice += parseInt(article.price * cart[i].quantity);
  }

  document.getElementById("totalQuantity").innerHTML = totalQuantity;
  document.getElementById("totalPrice").innerHTML = totalPrice;

  if (i == cart.length) {
    const displayBasket = parser.parseFromString(cartArray, "text/html");
    positionEmptyCart.appendChild(displayBasket.body);
    changeQuantity();
    deleteItem();
  }
}

// Récupération des produits de l'API
async function getProductById(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)
    .then(function (res) {
      return res.json();
    })
    .catch((err) => {
      console.log("erreur");
    })
    .then(function (response) {
      return response;
    });
}
displayCart();

// Modification de la quantité de produit dans le panier
function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((quantityInput) => {
    quantityInput.addEventListener("change", (event) => {
      event.preventDefault();
      const inputValue = event.target.value;
      const dataId = event.target.getAttribute("data-id");
      const dataColor = event.target.getAttribute("data-color");
      let cart = localStorage.getItem("cart");
      let items = JSON.parse(cart);

      items = items.map((item, index) => {
        if (item.id === dataId && item.color === dataColor) {
          item.quantity = inputValue;
        }
        return item;
      });
      // Mise à jour du localStorage
      let itemsStr = JSON.stringify(items);
      localStorage.setItem("cart", itemsStr);
      // Rechargement de la page Panier
      location.reload();
    });
  });
}

// Suppression d'un article
function deleteItem() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      const deleteId = event.target.getAttribute("data-id");
      const deleteColor = event.target.getAttribute("data-color");
      cart = cart.filter(
        (element) => !(element.id == deleteId && element.color == deleteColor)
      );
      console.log(cart);
      // Mise à jour du localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      // Rechargement de la page Panier
      location.reload();
      alert("Article supprimé du panier.");
    });
  });
}

// Le formulaire de coordonnées

// Sélection du bouton Valider
const btnValidate = document.querySelector("#order");

// Vérification du bouton Valider sur le click pour pouvoir valider le formulaire
btnValidate.addEventListener("click", (event) => {
  event.preventDefault();

  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  console.log(contact);

  // Gestionnaire du formulaire 

  // Contrôle des champs "Nom", "Prénom" et "Ville"
  const regExPrenomNomVille = (value) => {
    return /^[A-Z][A-Za-z\é\è\ê\-]+$/.test(value);
  };

  // Contrôle du champ "Adresse"
  const regExAdresse = (value) => {
    return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
  };

  // Contrôle du champ "Email"
  const regExEmail = (value) => {
    return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
      value
    );
  };

  // Vérification du champ "Prénom" :
  function firstNameControl() {
    const prenom = contact.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (regExPrenomNomVille(prenom)) {
      inputFirstName.style.backgroundColor = "green";

      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
    } else {
      inputFirstName.style.backgroundColor = "#FF6F61";

      document.querySelector("#firstNameErrorMsg").textContent =
        "Veuillez saisir un prénom valide avec une majuscule, ex: Vincent";
      return false;
    }
  }

  // Vérification du champ "Nom" :
  function lastNameControl() {
    const nom = contact.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (regExPrenomNomVille(nom)) {
      inputLastName.style.backgroundColor = "green";

      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = "#FF6F61";

      document.querySelector("#lastNameErrorMsg").textContent =
        "Veuille saisir un nom valide avec une majuscule, ex: Fontaine";
      return false;
    }
  }

  // Vérification du champ "Adresse" :
  function addressControl() {
    const adresse = contact.address;
    let inputAddress = document.querySelector("#address");
    if (regExAdresse(adresse)) {
      inputAddress.style.backgroundColor = "green";

      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = "#FF6F61";

      document.querySelector("#addressErrorMsg").textContent =
        "Veuillez saisir une adresse valide , ex: 4 Avenue Anatole France";
      return false;
    }
  }

  // Vérification du champ "Ville" :
  function cityControl() {
    const ville = contact.city;
    let inputCity = document.querySelector("#city");
    if (regExPrenomNomVille(ville)) {
      inputCity.style.backgroundColor = "green";

      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = "#FF6F61";

      document.querySelector("#cityErrorMsg").textContent =
        "Veuillez saisir un nom de ville valide avec une majuscule, ex: Paris";
      return false;
    }
  }

  // Vérification du champ "Email" :
  function mailControl() {
    const courriel = contact.email;
    let inputMail = document.querySelector("#email");
    if (regExEmail(courriel)) {
      inputMail.style.backgroundColor = "green";

      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.backgroundColor = "#FF6F61";

      document.querySelector("#emailErrorMsg").textContent =
        "Veuillez saisir un email valide, ex: example@contact.fr";
      return false;
    }
  }

  // Vérification de la validité du formulaire avant de l'envoyer dans le local storage
  if (
    firstNameControl() &&
    lastNameControl() &&
    addressControl() &&
    cityControl() &&
    mailControl()
  ) {
    // Enregistrement du formulaire dans le local storage
    localStorage.setItem("contact", JSON.stringify(contact));

    document.querySelector("#order").value =
      "Passer commande !";
    sendToServer();
  } else {
    error("Veuillez bien remplir le formulaire");
  }

  // Requête du server et POST des donnés
  function sendToServer() {
    const sendToServer = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      // Récupération et stockage de la réponse de l'API pour l'orderID
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);
      });

    // Si l'orderID a bien été récupéré, on redirige l'utilisateur vers la page de Confirmation
    if (orderId != "") {
      location.href = "confirmation.html?id=" + orderId;
    }
  }
});

// Maintenir le contenu du localStorage dans le champs du formulaire

let dataFormulaire = JSON.parse(localStorage.getItem("contact"));

console.log(dataFormulaire);
if (dataFormulaire) {
  document.querySelector("#firstName").value = dataFormulaire.firstName;
  document.querySelector("#lastName").value = dataFormulaire.lastName;
  document.querySelector("#address").value = dataFormulaire.address;
  document.querySelector("#city").value = dataFormulaire.city;
  document.querySelector("#email").value = dataFormulaire.email;
} else {
  console.log("Le formulaire est vide");
}