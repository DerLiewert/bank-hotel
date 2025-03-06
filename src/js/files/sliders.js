/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

import { flsModules } from './modules.js';
import { Parallax } from '../libs/parallax.js';
import { ScrollWatcher } from '../libs/watcher.js';
// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Базові стилі
// import '../../scss/base/swiper.scss';
// Повний набір стилів з scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Повний набір стилів з node_modules
// import 'swiper/css';

// Ініціалізація слайдерів
function initSliders() {
  // Список слайдерів
  // Перевіряємо, чи є слайдер на сторінці
  if (document.querySelector('.rooms__slider')) {
    // Вказуємо склас потрібного слайдера
    // Створюємо слайдер
    const roomsSlider = new Swiper('.rooms__slider', {
      // Вказуємо склас потрібного слайдера
      // Підключаємо модулі слайдера
      // для конкретного випадку
      modules: [Navigation, Pagination, EffectFade],
      init: false,
      // observer: true,
      // observeParents: true,
      // slidesPerView: 1,
      // slidesPerGroup: 1,
      // spaceBetween: 0,
      autoHeight: true,
      speed: 600,

      //touchRatio: 0,
      //simulateTouch: false,
      loop: true,
      //preloadImages: false,
      //lazy: true,

      // Ефекти
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      // autoplay: {
      //   delay: 3000,
      //   disableOnInteraction: false,
      // },

      // Пагінація
      pagination: {
        el: '.rooms__pagination',
        type: 'fraction',
        formatFractionCurrent: function (number) {
          return ('0' + number).slice(-2);
        },
        formatFractionTotal: function (number) {
          return ('0' + number).slice(-2);
        },
        renderFraction: function (currentClass, totalClass) {
          return (
            '<span class="' +
            currentClass +
            '"></span>' +
            '<span class="swiper-pagination-separator"> / </span>' +
            '<span class="' +
            totalClass +
            '"></span>'
          );
        },
      },

      // Скроллбар
      /*
			scrollbar: {
				el: '.swiper-scrollbar',
				draggable: true,
			},
			*/

      // Кнопки "вліво/вправо"
      navigation: {
        nextEl: '.rooms__next',
      },
      /*
			// Брейкпоінти
			breakpoints: {
				640: {
					slidesPerView: 1,
					spaceBetween: 0,
					autoHeight: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1268: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
			*/
      // Події
      on: {},
    });

    const matchMediaMax1024 = window.matchMedia(`(max-width: 1023.98px)`);
    const matchMediaMax1440 = window.matchMedia(`(max-width: 1439.98px)`);
    const matchMediaMax767 = window.matchMedia(`(max-width: 767.98px)`);

    const roomsSlideRO = new ResizeObserver((entries) => {
      const slider = entries[0].target;
      const activeSlide = slider.querySelector('.swiper-slide-active');
      const roomsNext = slider.querySelector('.rooms__next');
      const roomsSlideText = activeSlide.querySelector('.rooms-slide__text');
      const roomsSlideContent = activeSlide.querySelector('.rooms-slide__content');

      if (entries[0].contentRect.width > 767.98) {
        roomsNext.style.top =
          roomsSlideContent.getBoundingClientRect().top - slider.getBoundingClientRect().top + 'px';
      } else {
        roomsNext.style.top =
          roomsSlideText.getBoundingClientRect().top - slider.getBoundingClientRect().top + 'px';
      }
    });

    let watcher = new ScrollWatcher({}, []);
    let parallax;

    roomsSlider.on('init', onChangeActiveSlide);
    roomsSlider.init();
    roomsSlider.on('slideChange', onChangeActiveSlide);

    function onChangeActiveSlide(e) {
      const prevSlide = e.slides[e.previousIndex];
      const activeSlide = e.slides[e.activeIndex];
      if (activeSlide.classList.contains('_prlx-init') && prevSlide === activeSlide) return;

      if (parallax) parallax.destroyEvents();
      prevSlide.querySelectorAll('[data-watch]').forEach((watchItem) => {
        watchItem.classList.remove('_watcher-view');
      });
      prevSlide.classList.remove('_prlx-init');
      activeSlide.classList.add('_prlx-init');

      watcher.scrollWatcherOffAll();
      watcher = new ScrollWatcher({}, activeSlide.querySelectorAll('[data-watch]'));
      // watcher.scrollWatcherUpdate(activeSlide.querySelectorAll('[data-watch]'));
      parallax = new Parallax([...activeSlide.querySelectorAll('[data-prlx-parent-slide]')]);
    }

    //========================================================================================================================================================

    matchMediaMax1440.addEventListener('change', (e) => onMatchMediaChange(e));
    if (matchMediaMax1440.matches) onMatchMediaChange(matchMediaMax1440);

    matchMediaMax1024.addEventListener('change', (e) => onMatchMediaChange(e, false));
    if (matchMediaMax1024.matches) onMatchMediaChange(matchMediaMax1024, false);

    matchMediaMax767.addEventListener('change', (e) => onMatchMediaChange(e));
    if (matchMediaMax767.matches) onMatchMediaChange(matchMediaMax767);

    function onMatchMediaChange(e, isSetObserveOnMathes = true) {
      const slider = document.querySelector('.rooms__slider');
      if (isSetObserveOnMathes) {
        if (e.matches) {
          roomsSlideRO.observe(slider);
        } else {
          roomsSlideRO.unobserve(slider);
          slider.querySelector('.rooms__next').style.removeProperty('top');
        }
      } else {
        if (e.matches) {
          roomsSlideRO.unobserve(slider);
          slider.querySelector('.rooms__next').style.removeProperty('top');
        } else {
          roomsSlideRO.observe(slider);
        }
      }
    }

    //========================================================================================================================================================
  }
}
// Скролл на базі слайдера (за класом swiper scroll для оболонки слайдера)
function initSlidersScroll() {
  let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
  if (sliderScrollItems.length > 0) {
    for (let index = 0; index < sliderScrollItems.length; index++) {
      const sliderScrollItem = sliderScrollItems[index];
      const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
      const sliderScroll = new Swiper(sliderScrollItem, {
        observer: true,
        observeParents: true,
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: {
          enabled: true,
        },
        scrollbar: {
          el: sliderScrollBar,
          draggable: true,
          snapOnRelease: false,
        },
        mousewheel: {
          releaseOnEdges: true,
        },
      });
      sliderScroll.scrollbar.updateSize();
    }
  }
}

window.addEventListener('load', function (e) {
  // Запуск ініціалізації слайдерів
  initSliders();
  // Запуск ініціалізації скролла на базі слайдера (за класом swiper_scroll)
  //initSlidersScroll();
});
