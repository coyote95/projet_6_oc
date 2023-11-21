const itemsPerPage = 1; // Défiler une image à la fois
let currentImage = 0; // Page actuelle
const maxPages = 10; // Nombre maximum de pages à charger
let nexturl='http://localhost:8000/api/v1/titles/'
let conteur_next=0;

function displayMovieImages(url) {
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;

        // Sélectionner l'élément conteneur pour le carrousel
        const carouselContainer = document.getElementById('carousel');

        // Ajouter les images au carrousel
        movies.forEach(function (movie) {
          const carouselItem = document.createElement('div');
          carouselItem.className = 'carousel-item';
          const img = document.createElement('img');
          img.src = movie.image_url;
          img.alt = movie.title;
          img.onclick = function () {
            openModal(movie.title, movie.director, movie.year);
        };
          carouselItem.appendChild(img);
          carouselContainer.appendChild(carouselItem);
        });
        nexturl=data.next
        // // Vérifier s'il y a une page suivante
        // if (data.next !== null) {
        //   // Appel récursif pour la page suivante seulement si la limite n'est pas atteinte
        //   currentImage++;
        //   console.log(currentImage);
        //   console.log(data.next);
        //   displayMovieImages(data.next);
        // } else {
        //   // Mettre à jour le carrousel une fois toutes les images chargées
        //   updateCarousel();
        // }
      })
      .catch(error => {
        console.error('Erreur lors de la requête Fetch', error);
      });
  
}

// Appel initial avec l'URL de la première page

displayMovieImages('http://localhost:8000/api/v1/titles/');
displayMovieImages("http://localhost:8000/api/v1/titles/?page=2");

function nextSlide() {
  conteur_next++;
  if (conteur_next>=5)
 
   {displayMovieImages(nexturl);
    conteur_next=0;
  }
  const carouselItems = document.querySelectorAll('.carousel-item');
  const pageCount = Math.ceil(carouselItems.length / itemsPerPage);
 
  if (currentImage < pageCount - 1) {
    currentImage++;
    
    console.log("currente image:"+currentImage)
    console.log("totale image:"+pageCount)
  } else {
    currentImage = 0;
  }
  updateCarousel();
}

function prevSlide() {
  if (currentImage > 0) {
    currentImage--;
  } else {
    currentImage = Math.ceil(document.querySelectorAll('.carousel-item').length / itemsPerPage) - 1;
  }
  updateCarousel();
}

function updateCarousel() {
  const itemWidth = document.querySelector('.carousel-item').offsetWidth;
  const newTransformValue = -currentImage * itemsPerPage * itemWidth + 'px';
  document.getElementById('carousel').style.transform = 'translateX(' + newTransformValue + ')';
}

function openModal(title, director, year) {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');

    modal.style.display = 'block';
    modalContent.innerHTML = `
        <h2>${title}</h2>
        <p>Réalisateur: ${director}</p>
        <p>Année de sortie: ${year}</p>
        <button onclick="closeModal()">Fermer</button>
    `;
}

// Fonction pour fermer la fenêtre modale
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}