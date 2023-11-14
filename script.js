function getAllMovies(url) {
    $.ajax({
        url: url,
        method: 'GET',
        success: function (data) {
            const movies = data.results;

            // Effacer le contenu précédent
            // $('#movie-years').empty();

            // Afficher les années des films filtrés par année
            movies.forEach(function (movie) {
                const movieYear = `
                  
                        Année de "${movie.title}": ${movie.year}
                    `;
                $('#movie-years').append(movieYear);
            });

            // Vérifier s'il y a une page suivante
            if (data.next !== null) {
                // Appel récursif pour la page suivante
                getAllMovies(data.next);
            }
        },
        error: function () {
            console.error('Erreur lors de la requête Ajax');
        }
    });
}

// Appel initial avec l'URL de la première page
getAllMovies('http://localhost:8000/api/v1/titles/');
