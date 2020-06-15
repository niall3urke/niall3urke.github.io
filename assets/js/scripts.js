document.addEventListener("DOMContentLoaded", function () {

    // ==============================================================
    // ===== Lazy loading intersection observer and fallback methods
    // ==============================================================

    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    let active = false;
    
    function initLazyLoading() {
      
      // Is the intersection observer available?
      if ("IntersectionObserver" in window) {
        
        // Use the simpler, newer method
        useObserver();
        
      } else {
        
        // Tap into the scroll event and use the fallback
        document.addEventListener("scroll", useFallback);
      }
    }
  
    function useObserver() {
      
      // Initialize the observer
      let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
        
        // Loop the images
        entries.forEach(function (entry) {
          
          // Is the current image in the view?
          if (entry.isIntersecting) {
            
            // It is, get the image
            let lazyImage = entry.target;
            
            // Update the src, and srcset 
            loadImage(lazyImage);
            
            // Image is loaded, stop observing
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });
  
      // Observe all images with the 'lazy' class
      lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    }
  
    function useFallback() {
      
      // Avoid hitting this method continuously on scroll
      if (active === false) {
        
        // Set the flag to prevent entry
        active = true;
  
        // Entering the method is limited to every 200ms
        setTimeout(function () {
          
          // Loop our lazy images
          for (let i = 0; i < lazyImages.length; i++) {
            
            // Get a reference to the current image
            let lazyImage = lazyImages[i];
  
            // Is the image in the viewport?
            if (isInView(lazyImage)) {
              
              // Update the src, and srcset 
              loadImage(lazyImage);
  
              // Unsubscribe from the event if all images loaded
              if (lazyImages.length === 0) {
                document.removeEventListener("scroll", lazyLoad);
              }
            }
          }
          
          // Image loaded, reset flag for next item
          active = false;
        }, 200);
      }
    }
    
    function isInView(element) {
      var rec = element.getBoundingClientRect();
      
      return (
        rec.bottom >= 0 &&
        rec.right >= 0 &&
        rec.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rec.left <= (window.innerWidth || document.documentElement.clientWidth) && 
        getComputedStyle(element).display != 'none'
      );
    }
    
    // Lazy load any images with the 'lazy' class
    initLazyLoading();

    // =================================================
    // ===== Lazy loading of images with blur technique
    // =================================================

    function loadImage(image) {
      // The parent could be a figure, or an a element
      var parent = image.parentNode;
  
      // Create an image object
      var imageLarge = new Image();
  
      // Get the src for the large image
      imageLarge.src = image.dataset.src;
      
      // Get the srcset for the large image
      imageLarge.srcset = image.dataset.srcset;
      
      // Add class to make it's default opacity 0
      imageLarge.classList.add("lazy");
  
      // When loaded, make it visible
      imageLarge.onload = function () {
        
        // Add the loaded class to transition to an opacity of 1
        imageLarge.classList.add("lazy--loaded");
        
        // Get rid of the placeholder
        parent.removeChild(image);
      };
  
      // Add it to the document
      parent.append(imageLarge);
    }



  });
  