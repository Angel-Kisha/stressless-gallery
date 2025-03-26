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
          this.centerSlide(index);
        });
      });
    }
  
    centerSlide(targetIndex) {
      // Handle looping for first and last slides
      let prevIndex, nextIndex;
      
      if (targetIndex === 0) {
        // When first slide is clicked, show last slides before it
        prevIndex = this.totalSlides - 1;
        nextIndex = 1;
      } else if (targetIndex === this.totalSlides - 1) {
        // When last slide is clicked, show first slides after it
        prevIndex = this.totalSlides - 2;
        nextIndex = 0;
      } else {
        // Normal case
        prevIndex = targetIndex - 1;
        nextIndex = targetIndex + 1;
      }
  
      // Calculate center position
      const sliderRect = this.slider.getBoundingClientRect();
      const targetSlide = this.slides[targetIndex];
      const targetSlideRect = targetSlide.getBoundingClientRect();
      
      // Calculate scroll to center the target slide
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