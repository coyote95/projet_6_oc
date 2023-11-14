function displayMovieImages(url) {
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            const movies = data.results;

            // Sélectionner l'élément conteneur
            const movieList = $('#movie-list');

            // Afficher les images des films
            movies.forEach(function (movie) {
                const movieImage = `<img src="${movie.image_url}" alt="${movie.title}">`;
                movieList.append(movieImage);
            });

            // Vérifier s'il y a une page suivante
            if (data.next !== null) {
                // Appel récursif pour la page suivante
                displayMovieImages(data.next);
            }
        },
        error: function () {
            console.error('Erreur lors de la requête Ajax');
        }
    });
}

// Appel initial avec l'URL de la première page
displayMovieImages('http://localhost:8000/api/v1/titles/');
