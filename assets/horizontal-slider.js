class SliderDots extends HTMLElement {
    constructor() {
      super();
      this.slider = this.closest('slider-component').querySelector('.slider');
      this.dots = this.querySelectorAll('.slider-dot');
      this.slides = this.slider.querySelectorAll('.slider__slide');
      
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
            const slideIndex = Array.from(this.slides).indexOf(entry.target);
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
          const slideToFocus = this.slides[index];
          
          // Precise scroll calculation
          const sliderRect = this.slider.getBoundingClientRect();
          const slideRect = slideToFocus.getBoundingClientRect();
          const scrollAmount = slideRect.left - sliderRect.left + this.slider.scrollLeft;
  
          this.slider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
  
          // Update active dot
          this.updateActiveDot(index);
        });
      });
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