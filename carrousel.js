const itemsPerPage = 1; // Nombre d'éléments à afficher par page
let currentPage = 0; // Page actuelle
const maxPages = 10; // Nombre maximum de pages à charger

function displayMovieImages(url) {
  if (currentPage < maxPages) {
    $.ajax({
      url: url,
      method: 'GET',
      success: function (data) {
        const movies = data.results;

        // Sélectionner l'élément conteneur pour le carrousel
        const carouselContainer = $('#carousel');

        // Ajouter les images au carrousel
        movies.forEach(function (movie) {
          const carouselItem = `<div class="carousel-item"><img src="${movie.image_url}" alt="${movie.title}"></div>`;
          carouselContainer.append(carouselItem);
        });

        // Vérifier s'il y a une page suivante
        if (data.next !== null) {
          // Appel récursif pour la page suivante seulement si la limite n'est pas atteinte
          currentPage++;
          displayMovieImages(data.next);
        } else {
          // Mettre à jour le carrousel une fois toutes les images chargées
          updateCarousel();
        }
      },
      error: function () {
        console.error('Erreur lors de la requête Ajax');
      }
    });
  }
}

// Appel initial avec l'URL de la première page
displayMovieImages('http://localhost:8000/api/v1/titles/');

function nextSlide() {
  const carouselItems = $('.carousel-item');
  const pageCount = Math.ceil(carouselItems.length / itemsPerPage);

  if (currentPage < pageCount - 1) {
    currentPage++;
  } else {
    currentPage = 0;
  }
  updateCarousel();
}

function prevSlide() {
  if (currentPage > 0) {
    currentPage--;
  } else {
    currentPage = Math.ceil($('.carousel-item').length / itemsPerPage) - 1;
  }
  updateCarousel();
}

function updateCarousel() {
  const itemWidth = $('.carousel-item').outerWidth();
  const newTransformValue = -currentPage * itemsPerPage * itemWidth + 'px';
  $('#carousel').css('transform', 'translateX(' + newTransformValue + ')');
}
