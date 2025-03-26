class SliderDots extends HTMLElement {
    constructor() {
      super();
      this.slider = this.closest('slider-component').querySelector('.slider');
      this.dots = this.querySelectorAll('.slider-dot');
      
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
            const slideIndex = Array.from(this.slider.children).indexOf(entry.target);
            this.updateActiveDot(slideIndex);
          }
        });
      }, observerOptions);
  
      this.slider.querySelectorAll('.slider__slide').forEach(slide => {
        observer.observe(slide);
      });
    }
  
    addDotClickListeners() {
      this.dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const slideIndex = parseInt(dot.getAttribute('data-slide-index'));
          const slideToFocus = this.slider.children[slideIndex];
          
          // Use existing slider scroll method
          this.slider.scrollTo({
            left: slideToFocus.offsetLeft,
            behavior: 'smooth'
          });
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