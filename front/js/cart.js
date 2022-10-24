let basket = JSON.parse(localStorage.getItem('produit'));

// *************** Affichage des produits du panier *************** //

function basketUpdate(){
    let basketShow = [];
    for(n = 0; n < basket.length; n++){
        basketShow = basketShow + `
        <article class="cart__item" data-id="${basket[n].idProduct}" data-color="${basket[n].colorProduct}">
        <div class="cart__item__img">
        ${basket[n].urlImageProduct}
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${basket[n].nameProduct}</h2>
            <p>${basket[n].colorProduct}</p>
            <p>NOP €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté :</p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[n].quantityProduct}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
        </article>
        `
    }
    document.querySelector('#cart__items').innerHTML = basketShow; 
    basketTotal();
}

if(basket === null || basket == 0){ // Panier vide
    const basketEmpty = `<h2>Le panier est vide</h2>`;
    document.querySelector('#cart__items').innerHTML = basketEmpty; 
}else{
    basketUpdate();

    
}


// ********** Fin de l'affichage des produits du panier ********** //

// **********  Gestion du nombre et prix total des articles ********** //

function basketTotal(){

  let totalPrice = 0;
  let totalItem = 0;
  let updatePrice;
  let y = 1;

  for(t = 0; t < basket.length; t++){
    let quantity = basket[t].quantityProduct;
    let urlProduct = `http://localhost:3000/api/products/${basket[t].idProduct}`;

    fetch(urlProduct)
        .then((response) =>
            response.json()
                .then((data) => {
                    var priceCalc = data.price * quantity;
                      
                    updatePrice = document.querySelectorAll('.cart__item__content__description p');
                    updatePrice[y].innerHTML = `<p>${data.price} €</p>`;
                    totalPrice += priceCalc;
                    totalItem += parseInt(quantity);
                    document.getElementById('totalQuantity').innerText = totalItem;
                    document.getElementById('totalPrice').innerText = totalPrice;
                    y =+ y + 3;
                })
        )
          .catch(err => console.log('Erreur : ' + err));
  }
}

// **********  Gestion du boutton supprimer l'article ********** //

let btnDelete = document.querySelectorAll('.deleteItem');
console.log(btnDelete);

for (let k = 0; k < btnDelete.length; k++){
    btnDelete[k].addEventListener('click', (e) =>{

        // Séléction de l'id du produit 
        let id_SelectDelete = basket[k].idProduct;
        let color_SelectDelete = basket[k].colorProduct;

        // Méthode filter : séléct  ion élément à garder, supprime l'élément btn ou suppr a été cliquer
        basket = basket.filter( el => el.idProduct !== id_SelectDelete || el.colorProduct !== color_SelectDelete);
        console.log(basket);

        // On envoie la var dans le localStorage
        localStorage.setItem('produit', JSON.stringify(basket));

        // Alert pour avertir que le produit a été supp
        window.location.href = "cart.html";

    })
}


// **********  Gestion de la modification du nombre d'article ********** //

/**
 *
 * Contenu du product:
 * product: {
 *   idProduct: string,
 *   nameProduct: string,
 *   urlImageProduct: string,
 *   colorProduct: string,
 *   quantityProduct: string
 * }
 *
 */

let inputQuantity = document.querySelectorAll('input.itemQuantity');
console.log(inputQuantity);

for (let z = 0; z < inputQuantity.length; z++){
  inputQuantity[z].addEventListener('change', (e) =>{

    console.log("Numéro de l'item :");
    console.log([z]);
    console.log('ficher du produit');
    console.log(basket[z]);
    
    let changeQuantity = document.querySelectorAll('input')[z].value;
    if(changeQuantity <= 0 || changeQuantity >= 100){
      alert(`La quantité d'article doit aller de 1 à 100 par produit !`);
    }else{
      console.log('Nouvelle quantité ' + changeQuantity);
      let product = {
        idProduct: basket[z].idProduct,
        nameProduct: basket[z].nameProduct,
        urlImageProduct: basket[z].urlImageProduct,
        colorProduct: basket[z].colorProduct,
        quantityProduct: changeQuantity, 
      };
  
      basket.splice([z], 1, product);
      console.log(basket);
  
      localStorage.setItem('produit', JSON.stringify(basket)); // Le transforme en format JSON et l'envoyer dans la key 'produit'
      basketTotal();
    }
  })
}



// **********  Gestion du FORMULAIRE ********** //

let form = document.querySelector('.cart__order__form');

form.firstName.addEventListener('change', function(){
  validFirstName(this);
});
form.lastName.addEventListener('change', function(){
  validLastName(this);
});
form.address.addEventListener('change', function(){
  validAddress(this);
});
form.city.addEventListener('change', function(){
  validNameCity(this);
});
form.email.addEventListener('change', function(){
  validEmail(this);
});

let regExp = "^([A-Z].\s)?([a-zA-ZÀ-ÖØ-öø-ÿ][a-zÀ-ÖØ-öø-ÿ-]+)\s?)+([A-Z]'([A-Z][a-z])$";

const validFirstName = function(inputFirstName){
  let p = inputFirstName.nextElementSibling // Récupération de la balise p (après le input)
  if(inputFirstName.value.length == 0){
    p.innerHTML = "Veuillez renseigner le champ de saisie";
    return false;
  }
  else if(inputFirstName.value.length < 3 || inputFirstName.value.length > 25){
    console.log("trop court ou trop long");
    p.innerHTML = "Prénom doit contenir entre 3 et 25 caractères";
    return false;
  }
  if(inputFirstName.value.match(/^[a-z A-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]{3,25}$/)){
    return true;
  }else{
    p.innerHTML = "Veuillez ne pas mettre de caractère spécial, ni de chiffre";
    return false;
  }
};

const validLastName = function(inputLastName){
  let p = inputLastName.nextElementSibling // Récupération de la balise p (après le input)
  if(inputLastName.value.length == 0){
    p.innerHTML = "Veuillez renseigner le champ de saisie";
    return false;
  }
  else if(inputLastName.value.length < 3 || inputLastName.value.length > 25){
    console.log("trop court ou trop long");
    p.innerHTML = "Prénom doit contenir entre 3 et 25 caractères";
    return false;
  }
  if(inputLastName.value.match(/^[a-z A-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-]{3,25}$/)){
    p.innerHTML = "";
    return true;
  }else{
    p.innerHTML = "Veuillez ne pas mettre de caractère spécial, ni de chiffre";
    return false;
  }
};

const validAddress = function(inputAddress){
  let p = inputAddress.nextElementSibling // Récupération de la balise p (après le input)
  if(inputAddress.value.match(/^[a-z A-Z 0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{3,50}$/)){
    p.innerHTML = "";
    return true;
  }else{
    p.innerHTML = "Adresse invalide";
    return false;
  }
};
const validCity = function(inputCity){
  let p = inputCity.nextElementSibling // Récupération de la balise p (après le input)
  if(inputCity.value.match(/^[a-z A-Z 0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{3,50}$/)){
    p.innerHTML = "";
    return true;
  }else{
    p.innerHTML = "Adresse invalide";
    return false;
  }
};

const validEmail = function(inputEmail){
  let emailRegExp = new RegExp('[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'); // [@]{1} = signifie qu'on peut utiliser @ que 1 seule fois (pareil pour [.])

  let testEmail = emailRegExp.test(inputEmail.value); // renvoie vrai ou faux
  let p = inputEmail.nextElementSibling 

  if(testEmail == true){
      p.innerHTML = "";
      return true;
  } else{
      p.innerHTML = "Adresse email invalide";
      return false;
  }
};



// **********  Envoie des données vers l'API lors de la validation ********** //



const postUrl = "http://localhost:3000/api/products/order/";
const orderButton = document.getElementById("order");
orderButton.addEventListener("click", (e) => {
  e.preventDefault(); //prevent default form button action

  let validityFirstName = validFirstName(form.firstName);
  let validityLastName = validLastName(form.lastName);
  let validityAddress = validAddress(form.address);
  let validityCity = validAddress(form.city);
  let validityEmail = validEmail(form.email);
  if(validityFirstName && validityLastName && validityAddress && validityCity && validityEmail == true){
    let jsonData = makeJsonData();
    console.log(jsonData);
    fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    })
      .then((res) => res.json())
      .then((data) => {
        if(basket === null || basket == 0){
          alert('Votre panier est vide.');
        }else{
          localStorage.clear();
          console.log(data.orderId);
          let confirmationUrl = "./confirmation.html?id=" + data.orderId;
          window.location.href = confirmationUrl;
        }
        
      })
      .catch(() => {
        alert("Une erreur est survenue, merci de revenir plus tard.");
      }); // catching errors
    }else{
      alert("Une erreur s'est produite");
  }

  
});

// **********  Création du jsonData a envoyer à l'API  ********** //

/**
 *
 * Contenu du jsonData:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- indiquer l'id du produit
 *
 */

function makeJsonData() {
  let contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value,
  };
  let products = [];

  if(basket === null || basket == 0){
    alert('Votre panier est vide.');
  }
  for (i = 0; i < basket.length; i++) {
    if (products.find((e) => e == basket[i].idProduct)) {
    } else {
      products.push(basket[i].idProduct);
      console.log(basket[i])
    }
  }
  let jsonData = JSON.stringify({ contact, products });
  return jsonData;
}
 