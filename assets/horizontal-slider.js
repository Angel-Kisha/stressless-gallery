class SliderDots extends HTMLElement {
    constructor() {
      super();
      this.slider = this.closest('slider-component').querySelector('.slider');
      this.dots = this.querySelectorAll('.slider-dot');
      this.slides = Array.from(this.slider.querySelectorAll('.slider__slide'));
      this.totalSlides = this.slides.length;
      this.slidesPerView = this.calculateSlidesPerView();
      
      this.initializeSliderObserver();
      this.addDotClickListeners();
    }
  
    calculateSlidesPerView() {
      // Determine number of slides visible based on screen width
      const sliderWidth = this.slider.clientWidth;
      const slideWidth = this.slides[0]?.clientWidth || 0;
      return Math.floor(sliderWidth / slideWidth);
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
            this.updateActiveDot(this.calculateDotIndex(slideIndex));
          }
        });
      }, observerOptions);
  
      this.slides.forEach(slide => {
        observer.observe(slide);
      });
    }
  
    calculateDotIndex(slideIndex) {
      // Calculate which dot should be active based on first visible slide
      return Math.floor(slideIndex / this.slidesPerView);
    }
  
    addDotClickListeners() {
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.centerSlideGroup(index);
        });
      });
    }
  
    centerSlideGroup(dotIndex) {
      // Calculate the first slide of the group to scroll to
      const firstSlideIndex = dotIndex * this.slidesPerView;
      const targetSlide = this.slides[firstSlideIndex];
      
      if (!targetSlide) return;
  
      // Calculate scroll position to show the group of slides
      const sliderRect = this.slider.getBoundingClientRect();
      const targetSlideRect = targetSlide.getBoundingClientRect();
      
      const scrollAmount = 
        targetSlideRect.left - 
        sliderRect.left + 
        this.slider.scrollLeft;
  
      this.slider.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
  
      // Update active dot
      this.updateActiveDot(dotIndex);
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