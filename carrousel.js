const carousel = document.getElementById('carousel');
let currentIndex = 0;

function nextSlide() {
  if (currentIndex < 6) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = 6;
  }
  updateCarousel();
}


function updateCarousel() {
    const itemWidth = carousel.querySelector('.carousel-item').offsetWidth;
    const newTransformValue = -currentIndex * itemWidth + 'px';
    carousel.style.transform = 'translateX(' + newTransformValue + ')';
  }