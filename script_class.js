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
        if (this.start === 0) {
          console.log(this.start);
          this.start = 1;
      
          const fetchAndDisplay = (url) => {
            fetch(url)
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
                  img.onclick = () => this.openModal(movie.title, movie.director, movie.year);
                  carouselItem.appendChild(img);
                  carousel.appendChild(carouselItem);
                });
      
                this.updateCarousel();
              })
              .catch(error => console.error('Erreur lors de la requête Fetch', error));
          };
      
          fetchAndDisplay(this.nextUrl); // Fetch de la première page
          fetchAndDisplay(this.nextUrl + "&page=2"); // Fetch de la deuxième page
        } else {
          this.updateCarousel();
        }
      }
      
      
  
    fetchMovies() {
        console.log(this.nextUrl)
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
              img.onclick = () => this.openModal(movie.title, movie.director, movie.year);
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
  
    openModal(title, director, year) {
      const modal = document.getElementById('myModal');
      const modalContent = document.getElementById(`modalContent${this.sectionId}`);
  
      modal.style.display = 'block';
      modalContent.innerHTML = `
          <h2>${title}</h2>
          <p>Réalisateur: ${director}</p>
          <p>Année de sortie: ${year}</p>
          <button onclick="closeModal()">Fermer</button>
      `;
    }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize carousels
    const carousel1 = new Carousel('1', 'http://localhost:8000/api/v1/titles/?');
    const carousel2 = new Carousel('2', 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score');
  });
  

