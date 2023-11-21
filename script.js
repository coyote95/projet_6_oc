const itemsPerPage = 1;
let currentImage = 0;
const maxPages = 2; // Chargez seulement deux pages au démarrage
let nexturl = 'http://localhost:8000/api/v1/titles/';
let conteur_next = 0;
let start = 0;
let loadedPages = 1; // Nouvelle variable pour suivre le nombre de pages chargées

function displayMovieImages(url, sectionId) {
  console.log(url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      const carouselContainer = document.getElementById(`carousel-container${sectionId}`);
      const carousel = carouselContainer.querySelector('.carousel');

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
        carousel.appendChild(carouselItem);
      });

      const nexturl = data.next;

    //   if ((nexturl !== null) && (start !== 0) && (loadedPages < maxPages)) {
    //  displayMovieImages(nexturl, sectionId);
    //     updateCarousel(sectionId);
    //      loadedPages++;
    //   } else {
    //      updateCarousel(sectionId);
    //    }
    })
    .catch(error => {
      console.error('Erreur lors de la requête Fetch', error);
    });
}


// Appel initial avec l'URL de la première page
displayMovieImages('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score','2');
displayMovieImages('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score','2');
displayMovieImages('http://localhost:8000/api/v1/titles/','1');
displayMovieImages('http://localhost:8000/api/v1/titles/','1');
start = 1;

function nextSlide(id) {
  conteur_next++;

  if (conteur_next >= 5) {
    displayMovieImages(nexturl,id);
    conteur_next = 0;
  }

  const carouselItems = document.querySelectorAll('.carousel-item');
  const pageCount = Math.ceil(carouselItems.length / itemsPerPage);

  if (currentImage < pageCount - 1) {
    currentImage++;
  } else {
    currentImage = 0;
  }
  updateCarousel(id);
}

function prevSlide() {
  if (currentImage > 0) {
    currentImage--;
  } else {
    currentImage = Math.ceil(document.querySelectorAll('.carousel-item').length / itemsPerPage) - 1;
  }
  updateCarousel();
}

function updateCarousel(sectionId) {
  const itemWidth = document.querySelector(`#carousel-container${sectionId} .carousel-item`).offsetWidth;
  const newTransformValue = -currentImage * itemsPerPage * itemWidth + 'px';
  const carouselContainer = document.getElementById(`carousel-container${sectionId}`);
  
  if (carouselContainer) {
    carouselContainer.querySelector('.carousel').style.transform = 'translateX(' + newTransformValue + ')';
  } else {
    console.error(`Carousel container with ID 'carousel-container${sectionId}' not found.`);
  }
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

function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}
