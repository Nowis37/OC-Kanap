// *************** PRODUIT PAR PAGE *************** //


let param = new URL(document.location).searchParams;
let id = param.get("id");

const urlProduct = `http://localhost:3000/api/products/${id}`;

fetch(urlProduct)
  .then((response) =>
    response.json()
      .then((data) => {
        // console.log(data)
        let imgShow = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
        let titleShow = `${data.name}`;
        let priceShow = `${data.price}`;
        let descriptionShow = `${data.description}`;
        let colorsProduct;

        document.querySelector('title').innerText = titleShow;
        document.querySelector('.item__img').innerHTML = imgShow;
        document.querySelector('#title').innerText = titleShow;
        document.querySelector('p #price').innerText = priceShow;
        document.querySelector('#description').innerText = descriptionShow;

        for(let n = 0; n < data.colors.length; n+=1){
          colorsProduct += `<option value="${data.colors[n]}">${data.colors[n]}</option>`;
        }
      document.querySelector('#colors').innerHTML = colorsProduct;
      })
  )
  .catch(err => console.log('Erreur : ' + err));


/**
 *
 * Contenu du product:
 * newProduct ou product: {
 *   idProduct: string,
 *   nameProduct: string,
 *   urlImageProduct: string,
 *   colorProduct: string,
 *   quantityProduct: string
 * }
 *
 */

// -> Clic "Ajouter au panier"
document.querySelector('#addToCart').addEventListener('click', function(){

    let product;
    let saveName = document.getElementById('title').innerText;
    let saveUrlImage = document.querySelector('.item__img').innerHTML;
    let saveColor = document.getElementById('colors').value;
    let saveQuantity = document.getElementById("quantity").value;
    
    if(saveQuantity <= 0 || saveQuantity > 100){
      alert(`La quantité d'article doit aller de 1 à 100 par produit !`);
    }else{
        let product = {
            idProduct: id,
            nameProduct: saveName,
            urlImageProduct: saveUrlImage,
            colorProduct: saveColor,
            quantityProduct: saveQuantity, 
        };

        // ***************   LOCAL STORAGE   *************** //

        // JSON.parse = convertir les données au format JSON qui sont ds le localstorage en objet JS
        let basket = JSON.parse(localStorage.getItem('produit'));
        // Fonction fenetre pop up

        const popupConfirmation = () =>{
            if(window.confirm(`${saveName} x${saveQuantity} (couleur: ${saveColor}) a bien été ajouté au panier Consultez le panier "OK" ou rester sur la page "ANNULER"`)){
                window.location.href = "cart.html";
            }
        }
        // Fonction Ajout dans le panier 
        const addProduct = () =>{
            basket.push(product); // Ajout dans le tableau de l'objet avec les values choisi
            localStorage.setItem('produit', JSON.stringify(basket)); // Le transforme en format JSON et l'envoyer dans la key 'produit'
        }
        // S'il y a déjà des produits dans le localStorage
        if(basket){ // Si il y a un item dans le lS
            let otherItem = false;
            for(v = 0; v < basket.length; v++){
              console.log(v)
              if(basket[v].idProduct == product.idProduct){
                console.log(v);
                console.log('same id !');
                if(basket[v].colorProduct == product.colorProduct){
                  console.log('same color !');
                  console.log(v);

                  let newQuantityProduct = parseInt(basket[v].quantityProduct) + parseInt(saveQuantity);
                  if(newQuantityProduct > 100){
                    newQuantityProduct = 100;
                  }
                  let newProduct = {
                    idProduct: id,
                    nameProduct: saveName,
                    urlImageProduct: saveUrlImage,
                    colorProduct: saveColor,
                    quantityProduct: newQuantityProduct, 
                  };
                  basket.splice([v], 1, newProduct);
                  console.log(v);
                  console.log(basket);

                  otherItem = true;
                  localStorage.setItem('produit', JSON.stringify(basket)); // Le transforme en format JSON et l'envoyer dans la key 'produit'
                }
              }
            } 
            if(otherItem == false){ // Item différent
              console.log(v);
              addProduct();
            }
              
            popupConfirmation();

        }else{ // S'il y a pas de produit dans le localStorage
            basket = [];
            addProduct();
            popupConfirmation();
        }
    }
});