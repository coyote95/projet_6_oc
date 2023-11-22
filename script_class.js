class Carousel {
    constructor(sectionId, initialUrl) {
      this.sectionId = sectionId;
      this.itemsPerPage = 1;
      this.currentImage = 0;
      this.nextUrl = initialUrl;
      this.start = 0;
      this.compteur=0;
      
  
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
        console.log(this.start);
        this.start = 1;
      
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
              img.onclick = () => this.openModal(movie.url);
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
              img.onclick = () => this.openModal(movie.url);
              carouselItem.appendChild(img);
              carousel.appendChild(carouselItem);
            });
      
           
          })
          .catch(error => console.error('Erreur lors de la requête Fetch', error));
      }
      
  
      nextSlide() {
        this.compteur++;
        console.log('0k');
        this.currentImage++;
        if (this.compteur>=4){
            this.fetchMovies(); 
            this.compteur=0;
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
  
      if (carouselContainer) {
        carouselContainer.querySelector('.carousel').style.transform = 'translateX(' + newTransformValue + ')';
      } else {
        console.error(`Carousel container with ID 'carousel-container${this.sectionId}' not found.`);
      }
    }
  
    openModal(urlfilm) {
        fetch(urlfilm)
        .then(response => response.json())
        .then(data => {
           
    
            const modal = document.getElementById(`myModal${this.sectionId}`);
            const modalContent = document.getElementById(`modalContent${this.sectionId}`);
    
            modal.style.visibility = 'visible';
            modalContent.innerHTML = `
                <button onclick="closeModal('${this.sectionId}')">X</button>
                <h2>${data.title}</h2>
                <p>Genres ${data.genres}</p>
                <p>Année de sortie: ${data.year}</p>
                <p>Rated:${data.rated}</p>
                <p>Score Imdb:${data.imdb_score}</p>
                <p>Réalisateur:${data.directors}</p>
                <p>Acteurs:${data.actors}</p>
                <p>Durée:${data.duration}</p>
                <p>Origine:${data.countries}</p>
                <p>Box Office:${data.worldwide_gross_income}</p>
                <p>Résumé:${data.description}</p>
            `;
        })
        .catch(error => {
            console.error('Erreur lors de la requête Fetch', error);
        });
    }
    
  }


  function closeModal(sectionId) {
    const modal = document.getElementById(`myModal${sectionId}`);
    modal.style.visibility = 'hidden';
}

  
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize carousels
    
    const carousel1 = new Carousel('1', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score');
    const carousel2 = new Carousel('2', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Drama');
    const carousel3 = new Carousel('3', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy');
    const carousel4 = new Carousel('4', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Horror');
  });
  


