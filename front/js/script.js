// *************** Affichage des produits sur la page d'accueil *************** //

let url = `http://localhost:3000/api/products`;
let affichage = '';

fetch(url)
  .then((response) =>
    response.json()
      .then((data) => {
        for (let canape of data) {
          affichage += `<a href="./product.html?id=${canape._id}">`;
          affichage += `<article>`;
          affichage += `<img src="${canape.imageUrl}" alt="${canape.altTxt}"></img>`;
          affichage += `<h3 class="productName">${canape.name}</h3>`;
          affichage += `<p class="productDescription">${canape.description}</p>`;
          affichage += '</article></a>';
        }
        document.querySelector('#items').innerHTML = affichage;
      })
  )
  .catch(err => console.log('Erreur : ' + err));

