class SliderDots extends HTMLElement {
    constructor() {
      super();
      this.slider = this.closest('slider-component').querySelector('.slider');
      this.dots = this.querySelectorAll('.slider-dot');
      this.slides = Array.from(this.slider.querySelectorAll('.slider__slide'));
      this.totalSlides = this.slides.length;
      
      this.initializeSliderObserver();
      this.addDotClickListeners();
    }
  
    initializeSliderObserver() {
      const observerOptions = {
        root: this.slider,
        threshold: 0.5
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const slideIndex = this.slides.indexOf(entry.target);
            this.updateActiveDot(slideIndex);
          }
        });
      }, observerOptions);
  
      this.slides.forEach(slide => {
        observer.observe(slide);
      });
    }
  
    addDotClickListeners() {
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.centerSlideWithCircularLayout(index);
        });
      });
    }
  
    centerSlideWithCircularLayout(targetIndex) {
      // Rearrange slides to create a circular layout
      const arrangedSlides = this.getCircularArrangement(targetIndex);
  
      // Remove existing slides
      while (this.slider.firstChild) {
        this.slider.removeChild(this.slider.firstChild);
      }
  
      // Append rearranged slides
      arrangedSlides.forEach(slide => {
        this.slider.appendChild(slide);
      });
  
      // Center the target slide
      const targetSlide = arrangedSlides[1]; // Middle slide is always the target
      const sliderRect = this.slider.getBoundingClientRect();
      const targetSlideRect = targetSlide.getBoundingClientRect();
      
      const scrollAmount = 
        targetSlideRect.left - 
        sliderRect.left + 
        this.slider.scrollLeft - 
        (sliderRect.width / 2) + 
        (targetSlideRect.width / 2);
  
      this.slider.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
  
      // Update active dot
      this.updateActiveDot(targetIndex);
    }
  
    getCircularArrangement(targetIndex) {
      // Create a circular arrangement of slides
      const lastIndex = this.totalSlides - 1;
      
      // Calculate indices for left, center, and right slides
      let leftIndex, centerIndex, rightIndex;
  
      if (targetIndex === 0) {
        // When first slide is clicked
        leftIndex = lastIndex;
        centerIndex = 0;
        rightIndex = 1;
      } else if (targetIndex === lastIndex) {
        // When last slide is clicked
        leftIndex = lastIndex - 1;
        centerIndex = lastIndex;
        rightIndex = 0;
      } else {
        // Normal case
        leftIndex = targetIndex - 1;
        centerIndex = targetIndex;
        rightIndex = targetIndex + 1;
      }
  
      // Return slides in the order: left, center, right
      return [
        this.slides[leftIndex],
        this.slides[centerIndex],
        this.slides[rightIndex]
      ];
    }
  
    updateActiveDot(activeIndex) {
      this.dots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }
  
  customElements.define('slider-dots', SliderDots);