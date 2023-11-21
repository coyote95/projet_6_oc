document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("imageCarousel");
    let currentIndex = 0;
  
    function showImage(index) {
      const translateValue = -index * (100 / carousel.childElementCount) + "%";
      carousel.style.transform = "translateX(" + translateValue + ")";
    }
  
    function updateImageIds() {
      // Mise à jour des IDs des images (sauf la première)
      for (let i = 2; i <= carousel.childElementCount; i++) {
        const imageElement = document.getElementById("image" + i);
        const newImageIndex = (currentIndex + i - 2) % (carousel.childElementCount - 1) + 2;
        imageElement.id = "image" + newImageIndex;
      }
    }
  
    function nextImage() {
      if (currentIndex < carousel.childElementCount - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // Revenir à la première image si on est à la dernière
      }
  
      updateImageIds();
      showImage(currentIndex);
    }
  
    function prevImage() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = carousel.childElementCount - 1; // Aller à la dernière image si on est à la première
      }
  
      updateImageIds();
      showImage(currentIndex);
    }
  
    // Event listeners for next/previous buttons
    document.getElementById("nextButton").addEventListener("click", nextImage);
    document.getElementById("prevButton").addEventListener("click", prevImage);
  
    // Event listener for the "Next" key
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        nextImage();
      } else if (event.key === "ArrowLeft") {
        prevImage();
      }
    });
  
    // Event listener for each image
    for (let i = 1; i <= carousel.childElementCount; i++) {
      const imageElement = document.getElementById("image" + i);
      imageElement.addEventListener("click", function () {
        console.log("Clicked on image with ID:", imageElement.id);
      });
    }
  });
  