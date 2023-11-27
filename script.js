class Carousel {
    constructor(sectionId, initialUrl) {
        this.sectionId = sectionId;
        this.itemsPerPage = 1;
        this.currentImage = 0;
        this.nextUrl = initialUrl;
        this.start = 0;
        this.compteur = 0;
        this.init();
    }

    init() {
        this.displayMovieImages();

        const nextButton = document.getElementById(`nextButton${this.sectionId}`);
        const prevButton = document.getElementById(`prevButton${this.sectionId}`);

        nextButton.addEventListener('click', () => this.nextSlide());
        prevButton.addEventListener('click', () => this.prevSlide());
    }

    displayMovieImages() {
        const fetchAndDisplay = async (url) => {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Status: ${response.status}`);
                }

                const data = await response.json();

                if (!data.results) {
                    throw new Error('Réponse de l\'API incorrecte. Aucun résultat trouvé.');
                }

                this.nextUrl = data.next;

                const movies = data.results;
                const carouselContainer = document.getElementById(`carousel-container${this.sectionId}`);
                const carousel = carouselContainer.querySelector('.carousel');

                movies.forEach(movie => {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = 'carousel-item';
                    const img = document.createElement('img');
                    img.src = movie.image_url;
                    img.alt = movie.title;
                    img.onclick = (event) => this.openModal(movie.url, event);
                    carouselItem.appendChild(img);
                    carousel.appendChild(carouselItem);
                });

                this.updateCarousel();
            } catch (error) {
                console.error('Erreur lors de la requête Fetch', error);
            }
        };

        // Utilisation de await pour attendre la fin de chaque fetch
        (async () => {
            await fetchAndDisplay(this.nextUrl); // Fetch de la première page
            await fetchAndDisplay(this.nextUrl + "&page=2"); // Fetch de la deuxième page
        })();
    }

    fetchMovies() {
        fetch(this.nextUrl)
            .then(response => response.json())
            .then(data => {
                this.nextUrl = data.next;

                const movies = data.results;
                const carouselContainer = document.getElementById(`carousel-container${this.sectionId}`);
                const carousel = carouselContainer.querySelector('.carousel');

                movies.forEach(movie => {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = 'carousel-item';
                    const img = document.createElement('img');
                    img.src = movie.image_url;
                    img.alt = movie.title;
                    img.onclick = (event) => this.openModal(movie.url, event);
                    carouselItem.appendChild(img);
                    carousel.appendChild(carouselItem);
                });

            })
            .catch(error => console.error('Erreur lors de la requête Fetch', error));
    }

    nextSlide() {
        this.compteur++;
        this.currentImage++;
        if (this.compteur >= 4) {
            this.fetchMovies();
            this.compteur = 0;
        }

        const carouselItems = document.querySelectorAll(`#carousel-container${this.sectionId} .carousel-item`);
        const pageCount = Math.ceil(carouselItems.length / this.itemsPerPage);

        if (this.currentImage >= pageCount) {
            this.currentImage = 0;
        }

        this.updateCarousel();
    }

    prevSlide() {
        this.currentImage--;
        const pageCount = Math.ceil(document.querySelectorAll(`#carousel-container${this.sectionId} .carousel-item`).length / this.itemsPerPage);

        if (this.currentImage < 0) {
            this.currentImage = pageCount - 1;
        }

        this.updateCarousel();
    }

    updateCarousel() {
        const itemWidth = document.querySelector(`#carousel-container${this.sectionId} .carousel-item`).offsetWidth;
        const newTransformValue = -this.currentImage * this.itemsPerPage * itemWidth + 'px';
        const carouselContainer = document.getElementById(`carousel-container${this.sectionId}`);
        const prevButton = document.getElementById(`prevButton${this.sectionId}`);

        if (carouselContainer) {
            carouselContainer.querySelector('.carousel').style.transform = 'translateX(' + newTransformValue + ')';

            // Toggle visibility of prevButton based on currentImage value
            if (this.currentImage == 0) {
                prevButton.style.visibility = 'hidden';
            } else {
                prevButton.style.visibility = 'visible';
            }
        } else {
            console.error(`Carousel container with ID 'carousel-container${this.sectionId}' not found.`);
        }
    }

    openModal(urlfilm, event) {
        if (document.querySelector('.modal') == null) {
            fetch(urlfilm)
                .then(response => response.json())
                .then(data => {
                    if (event) {
                        var mouseX = event.clientX;
                        var mouseY = event.clientY;

                        const modal = document.createElement('div');
                        modal.className = 'modal';
                        document.body.appendChild(modal);

                        const modalContent = document.createElement('div');
                        modalContent.className = 'modal-content';
                        modal.appendChild(modalContent);

                        modalContent.innerHTML = `
                        <button onclick="closeModal()">X</button>
                        <h2>${data.title}</h2>
                        <img src=${data.image_url} alt=${data.title}></img>
                        <p>Genres: ${data.genres}</p>
                        <p>Année de sortie: ${data.year}</p>
                        <p>Rated:${data.rated}</p>
                        <p>Score Imdb:${data.imdb_score}</p>
                        <p>Réalisateur:${data.directors}</p>
                        <p>Acteurs:${data.actors}</p>
                        <p>Durée:${data.duration} min</p>
                        <p>Origine:${data.countries}</p>
                        <p>Box Office:${data.worldwide_gross_income}</p>
                        <p>Résumé:${data.description}</p>
                    `;

                        modal.style.left = mouseX + 'px';
                        modal.style.top = mouseY + 'px';
                        modal.style.visibility = 'visible';
                    } else {
                        console.error('Event object is undefined or null.');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la requête Fetch', error);
                });
        }
    }
}

class BestApi {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.bestMovie = null;
        this.afficheSection = document.getElementById('afficheSection');
        this.afficheSection.addEventListener('click', (event) => this.openModalInBackground(event));
        this.init();
    }

    init() {
        this.fetchBestMovie();
    }

    async fetchBestMovie() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Status: ${response.status}`);
            }

            const data = await response.json();
            if (!data.results) {
                throw new Error('Réponse de l\'API incorrecte. Aucun résultat trouvé.');
            }

            this.bestMovie = data.results[0];
            this.updateAffiche();
        } catch (error) {
            console.error('Erreur lors de la requête Fetch pour le meilleur film', error);
        }
    }

    updateAffiche() {
        const contentTitle = this.afficheSection.querySelector('.content h2');
        contentTitle.textContent = this.bestMovie.title;
        this.afficheSection.style.backgroundImage = `url(${this.bestMovie.image_url})`;
    }

    openModalInBackground(event) {
        if (document.querySelector('.modal') == null) {
            if (event) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                const modal = document.createElement('div');
                modal.className = 'modal';
                document.body.appendChild(modal);

                const modalContentAffiche = document.createElement('div');
                modalContentAffiche.className = 'modal-content';
                modal.appendChild(modalContentAffiche);

                modalContentAffiche.innerHTML = `
                    <button onclick="closeModal()">X</button>
                    <h2>${this.bestMovie.title}</h2>
                    <img src=${this.bestMovie.image_url} alt=${this.bestMovie.title}></img>
                    <p>Genres: ${this.bestMovie.genres}</p>
                    <p>Année de sortie: ${this.bestMovie.year}</p>
                    <p>Rated:${this.bestMovie.rated}</p>
                    <p>Score Imdb:${this.bestMovie.imdb_score}</p>
                    <p>Réalisateur:${this.bestMovie.directors}</p>
                    <p>Acteurs:${this.bestMovie.actors}</p>
                    <p>Durée:${this.bestMovie.duration} min</p>
                    <p>Origine:${this.bestMovie.countries}</p>
                    <p>Box Office:${this.bestMovie.worldwide_gross_income}</p>
                    <p>Résumé:${this.bestMovie.description}</p>
                `;
                modal.style.left = mouseX + 'px';
                modal.style.top = mouseY + 'px';
                modal.style.visibility = 'visible';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // Initialisation de la classe BestApi
    const bestApi = new BestApi('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score');

    // Initialisation de la classe Carousel pour chaque carrousel
    const carousel1 = new Carousel('1', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score');
    const carousel2 = new Carousel('2', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Drama');
    const carousel3 = new Carousel('3', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy');
    const carousel4 = new Carousel('4', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Horror');
});

function closeModal() {
    const modal = document.querySelector('.modal');
    document.body.removeChild(modal);
}
