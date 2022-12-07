// Page Produit 

// Récupération de l'ID du produit pour changer l'URL
const getProductId = () => {
  return new URL(location.href).searchParams.get("id");
};
const productId = getProductId();

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => {
    return response.json();
  })

  .then((product) => {
    displayProduct(product);
    registredProduct(product);
  })
  .catch((error) => {
    alert(error);
  });

// Sélection de l'ID colors
const selectedColor = document.querySelector("#colors");

// Sélection de l'ID quantity
const selectedQuantity = document.querySelector("#quantity");

// Sélection du bouton Ajouter au panier
const button = document.querySelector("#addToCart");

// Fonction qui récupère les données de la promesse .then(product) pour injecter les valeurs dans le fichier HTML
let displayProduct = (product) => {
  // Intégration des données du produit sélectionné dans la page HTML
  document.querySelector("head > title").textContent = product.name;
  document.querySelector(".item__img")
  .innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  document.querySelector("#title").textContent += product.name;
  document.querySelector("#price").textContent += product.price;
  document.querySelector("#description").textContent += product.description;

  // Boucle intégrant les différentes couleurs du produit dans le HTML
  for (color of product.colors) {
    let option = document.createElement("option");
    option.innerHTML = `${color}`;
    option.value = `${color}`;
    selectedColor.appendChild(option);
  }
};

// Fonction qui enregistre dans un objet les options de l'utilisateur au click sur le bouton ajouter au panier
let registredProduct = (product) => {
  // Vérification du click sur le bouton ajouter
  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (selectedColor.value == false) {
      confirm("Veuillez sélectionner une couleur !");
    } else if (selectedQuantity.value == 0) {
      confirm("Veuillez sélectionner le nombre d'articles souhaités !");
    } else {
      alert("Votre article a bien été ajouté au panier !");

      // Récupération des informations du produit sélectionné
      let displayProduct = {
        id: product._id,
        color: selectedColor.value,
        quantity: parseInt(selectedQuantity.value, 10),
      };

      // Gestion du localStorage

      // Récupération des données du localStorage
      let existingCart = JSON.parse(localStorage.getItem("cart"));

      // Si le localStorage existe
      if (existingCart) {
        // On recherche avec la méthode find() si l'ID et la couleur d'un article sont déjà présents
        let item = existingCart.find(
          (item) =>
            item.id == displayProduct.id && item.color == displayProduct.color
        );
        // Si oui, on ajoute la nouvelle quantité et la mise à jour du prix total de l'article
        if (item) {
          item.quantity = item.quantity + displayProduct.quantity;
          item.totalPrice += item.price * displayProduct.quantity;
          localStorage.setItem("cart", JSON.stringify(existingCart));
          return;
        }
        // Si non, alors on push le nouvel article sélectionné
        existingCart.push(displayProduct);
        localStorage.setItem("cart", JSON.stringify(existingCart));

      } else {
        // Sinon création d'un tableau dans le lequel on push l'objet "displayProduct"
        let createLocalStorage = [];
        createLocalStorage.push(displayProduct);
        localStorage.setItem("cart", JSON.stringify(createLocalStorage));
      }
    }
  });
};