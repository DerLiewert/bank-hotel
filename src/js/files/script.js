// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from './functions.js';
// Підключення списку активних модулів
import { flsModules } from './modules.js';
import { Parallax } from '../libs/parallax.js';
import { ScrollWatcher } from '../libs/watcher.js';

const matchMediaMax1024 = window.matchMedia(`(max-width: 1023.98px)`);

let bodyLockStatus = false;
let bodyUnlock = (delay = 0) => {
  setTimeout(() => {
    if (!bodyLockStatus) return;

    const lockPaddingElements = document.querySelectorAll('[data-lp]');

    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.removeProperty('padding-right');
    });
    document.body.style.removeProperty('padding-right');
    document.documentElement.classList.remove('lock');
    bodyLockStatus = false;
  }, delay);
};

let bodyLock = (delay = 0) => {
  setTimeout(() => {
    if (bodyLockStatus) return;

    const lockPaddingElements = document.querySelectorAll('[data-lp]');
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';

    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });

    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add('lock');
    bodyLockStatus = true;
  }, delay);
};

let bodyLockToggle = (delay = 0) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};

//========================================================================================================================================================
//=== Переміщення блоку контактів та авторизації з ПК-версії хедера в бургеp меню на екрані <992 =====================================================================
//========================================================================================================================================================
function movingHeaderBlocks() {
  const header = document.querySelector('.header');
  if (!header) return;

  matchMediaMax1024.addEventListener('change', onMatchMediaChange);
  if (matchMediaMax1024.matches) onMatchMediaChange(matchMediaMax1024);

  function onMatchMediaChange(e) {
    const headerNav = header.querySelector('.header-nav');
    const headerCall = header.querySelector('.header__call');

    if (e.matches) {
      header.querySelector('.header__mobile-menu').insertAdjacentElement('afterbegin', headerNav);
      header.querySelector('.header__info').insertAdjacentElement('afterbegin', headerCall);
    } else {
      header.querySelector('.header__logo').insertAdjacentElement('afterend', headerNav);
      headerNav.insertAdjacentElement('afterend', headerCall);
    }
  }
}
movingHeaderBlocks();

//========================================================================================================================================================
//=== Open/close бергер меню =============================================================================================================================
//========================================================================================================================================================
function initBurger() {
  const burger = document.querySelector('.burger-icon');
  if (!burger) return;

  burger.addEventListener('click', () => {
    if (document.documentElement.classList.contains('menu-open')) {
      closeMenu();
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      openMenu();
    }
  });

  const pcMatchMedia = window.matchMedia('(min-width: 1023.98px)');
  const onScreenWidthChange = (e) => {
    if (e.matches) closeMenu();
  };
  pcMatchMedia.addEventListener('change', onScreenWidthChange);
  onScreenWidthChange(pcMatchMedia);
}

function closeMenu() {
  document.documentElement.classList.remove('menu-open');
  bodyUnlock();
}
function openMenu() {
  document.documentElement.classList.add('menu-open');
  bodyLock();
}

initBurger();

//========================================================================================================================================================
function facilities() {
  const facilitiesItemsBlock = document.querySelector('.facilities__items');
  if (!facilitiesItemsBlock) return;

  const facilitiesItemRO = new ResizeObserver((entries) => {
    entries.forEach((entry) => setArrowPosition(entry));
  });
  facilitiesItemRO.observe(facilitiesItemsBlock);

  let watcher = new ScrollWatcher({}, []);
  let parallax = null;
  facilitiesItemsBlock.addEventListener('click', (e) => {
    const facilitiesItem = e.target.closest('.facilities-item');
    if (!facilitiesItem) return;

    if (facilitiesItem.classList.contains('open')) {
      const facilitiesArrow = e.target.closest('.facilities-item__arrow');
      if (facilitiesArrow) closeItem(facilitiesItem);
    } else {
      openItem(facilitiesItem);
    }
  });

  const startOpenItem = facilitiesItemsBlock.querySelector('[data-open]');
  if (startOpenItem) {
    openItem(startOpenItem);
    document.addEventListener('watcherCallback', setArrowPosition);
  }

  function setArrowPosition(e) {
    const isWatcherCallback = e.detail ? true : false;
    if (
      isWatcherCallback &&
      e.detail.entry.target !== startOpenItem.querySelector('.facilities-item__content')
    )
      return;

    const openItem = isWatcherCallback
      ? startOpenItem
      : e.target.querySelector('.facilities-item.open');

    if (openItem) {
      const itemInner = openItem.querySelector('.facilities-item__inner');
      const arrow = openItem.querySelector('.facilities-item__arrow');
      const text = openItem.querySelector('.facilities-item__text');
      const content = openItem.querySelector('.facilities-item__content');
      const parrentWidth = isWatcherCallback
        ? facilitiesItemsBlock.clientWidth
        : e.contentRect.width;
      const marginTop = isWatcherCallback
        ? parseInt(e.detail.observer.rootMargin.split(' ')[0])
        : 0;

      if (parrentWidth > 1023.98) {
        arrow.style.top =
          content.getBoundingClientRect().top -
          itemInner.getBoundingClientRect().top +
          marginTop +
          'px';
      } else {
        arrow.style.top =
          text.getBoundingClientRect().top - itemInner.getBoundingClientRect().top + 'px';
      }
    }
  }

  function openItem(item) {
    const activeItem = facilitiesItemsBlock.querySelector('.facilities-item.open');
    if (activeItem) closeItem(activeItem);

    parallax = new Parallax([...item.querySelectorAll('[data-prlx-parent-custom]')]);
    watcher.scrollWatcherUpdate(item.querySelectorAll('[data-watch-custom]'));
    item.classList.add('open');
  }
  function closeItem(item) {
    item.classList.remove('open');

    if (parallax) {
      parallax.destroyEvents();
      parallax = null;
    }

    item.querySelectorAll('[data-watch-custom]').forEach((watchItem) => {
      watchItem.classList.remove('_watcher-view');
    });

    watcher.scrollWatcherOffAll();
    item.querySelector('.facilities-item__arrow').style.removeProperty('top');
  }
}
facilities();

//========================================================================================================================================================
//======== goto ==========================================================================================================================================
//========================================================================================================================================================
function goto() {
  // data-goto - указать ID / класс блока
  const gotoLinks = document.querySelectorAll('[data-goto]');
  if (!gotoLinks.length) return;

  gotoLinks.forEach((gotoLink) => {
    gotoLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeMenu(); // если клик на пункт меню в открытом бургере, то закрываем его перед скролом к нужному блоку

      const gotoElement = document.querySelector(gotoLink.dataset.goto);
      if (!gotoElement) return;

      window.scrollTo({
        top: gotoElement.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth',
      });
    });
  });
}
goto();
