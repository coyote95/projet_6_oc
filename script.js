class Carousel {
    constructor(sectionId, initialUrl) {
        this.sectionId = sectionId;
        this.currentImage = 0;
        this.nextUrl = initialUrl;
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

        // Using async and await to wait for the completion of each fetch.
        (async () => {
            await fetchAndDisplay(this.nextUrl); // Fetch page 1
            await fetchAndDisplay(this.nextUrl + "&page=2"); // Fetch page 2
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
        if (this.compteur >= 4) { // wait 4 clicks before loading new page
            this.fetchMovies();
            this.compteur = 0;
        }

        const carouselItems = document.querySelectorAll(`#carousel-container${this.sectionId} .carousel-item`);

        if (this.currentImage >= carouselItems) {
            this.currentImage = 0;
        }

        this.updateCarousel();
    }

    prevSlide() {
        this.currentImage--;
        this.updateCarousel();
    }

    updateCarousel() {
        const itemWidth = document.querySelector(`#carousel-container${this.sectionId} .carousel-item`).offsetWidth;
        const newTransformValue = -this.currentImage * itemWidth + 'px'; // position in the carousel chain

        const carouselContainer = document.getElementById(`carousel-container${this.sectionId}`);
        const prevButton = document.getElementById(`prevButton${this.sectionId}`);

        if (carouselContainer) {
            carouselContainer.querySelector('.carousel').style.transform = 'translateX(' + newTransformValue + ')';

            // hidden  prevButton if currentImage begin
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
                        // display modal at mouse position
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
        this.dataMovie = null;
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

            this.dataMovie = data.results[0];
            this.updateAffiche();
        } catch (error) {
            console.error('Erreur lors de la requête Fetch pour le meilleur film', error);
        }
    }

    updateAffiche() {
        const contentTitle = this.afficheSection.querySelector('.content h2');
        contentTitle.textContent = this.dataMovie.title;
        this.afficheSection.style.backgroundImage = `url(${this.dataMovie.image_url})`;
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
                    <h2>${this.dataMovie.title}</h2>
                    <img src=${this.dataMovie.image_url} alt=${this.dataMovie.title}></img>
                    <p>Genres: ${this.dataMovie.genres}</p>
                    <p>Année de sortie: ${this.dataMovie.year}</p>
                    <p>Rated:${this.dataMovie.rated}</p>
                    <p>Score Imdb:${this.dataMovie.imdb_score}</p>
                    <p>Réalisateur:${this.dataMovie.directors}</p>
                    <p>Acteurs:${this.dataMovie.actors}</p>
                    <p>Durée:${this.dataMovie.duration} min</p>
                    <p>Origine:${this.dataMovie.countries}</p>
                    <p>Box Office:${this.dataMovie.worldwide_gross_income}</p>
                    <p>Résumé:${this.dataMovie.description}</p>
                `;
                modal.style.left = mouseX + 'px';
                modal.style.top = mouseY + 'px';
                modal.style.visibility = 'visible';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const bestApi = new BestApi('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score');

    const carousel1 = new Carousel('1', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score');
    const carousel2 = new Carousel('2', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Drama');
    const carousel3 = new Carousel('3', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy');
    const carousel4 = new Carousel('4', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Horror');
});

function closeModal() {
    const modal = document.querySelector('.modal');
    document.body.removeChild(modal);
}
