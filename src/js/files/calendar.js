import { flsModules } from './modules.js';
const times = new Map([
  ['08:00', '08:00 am'],
  ['09:00', '09:00 am'],
  ['10:00', '10:00 am'],
  ['11:00', '11:00 am'],
  ['12:00', '12:00 pm'],
  ['13:00', '01:00 pm'],
  ['14:00', '02:00 pm'],
  ['15:00', '03:00 pm'],
  ['16:00', '04:00 pm'],
  ['17:00', '05:00 pm'],
  ['18:00', '06:00 pm'],
  ['19:00', '07:00 pm'],
  ['20:00', '08:00 pm'],
  ['21:00', '09:00 pm'],
  ['22:00', '10:00 pm'],
]);
const bookedDates = [];

// Генерируем забронированные дни и время
let currentMonth = new Date();
for (let index = currentMonth.getMonth(); index < currentMonth.getMonth() + 6; index++) {
  const temp = new Date(currentMonth.getFullYear(), index);
  const lastDate = new Date(temp.getFullYear(), temp.getMonth() + 1, 0).getDate();

  let i = currentMonth.getMonth() === temp.getMonth() ? currentMonth.getDate() : 0;
  for (; i < lastDate; i++) {
    const randomTime = randomTimes();
    if (randomTime.length > 0) {
      bookedDates.push({
        year: temp.getFullYear(),
        month: temp.getMonth(),
        date: randomInteger(
          index === currentMonth.getMonth() ? currentMonth.getDate() : 1,
          lastDate,
        ),
        time: randomTime,
      });
    }
  }
}

function randomTimes() {
  const disabledTimes = [];
  let countDisabledTimes = randomInteger(0, times.size);
  const timesKeys = Array.from(times.keys());

  for (let i = 0; i < countDisabledTimes; i++) {
    let time = timesKeys[randomInteger(0, times.size - 1)];
    while (disabledTimes.includes(time)) {
      time = timesKeys[randomInteger(0, times.size - 1)];
    }
    disabledTimes.push(time);
  }
  return disabledTimes;
}
function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//==================================================
//======== Вспомагательные функции =================
//==================================================

// достаём забронированные дни по указаному месяцу года из массива забронированых дат
function filterBookedDates(year, month) {
  return bookedDates
    .filter((obj) => obj.year == year && obj.month == month && obj?.time.length == times.size)
    .map((obj) => obj.date);
}

// превращает обьект {year, month, date} в строку yy-mm-dd
function dateToString(fullDate, separator = '-', isReverce = false) {
  let array = [fullDate.year, `0${+fullDate.month + 1}`.slice(-2), `0${fullDate.date}`.slice(-2)];
  if (isReverce) array = array.reverse();

  return array.join(separator);
}
// сравнивает два обьекта типа {year, month, date} и возвращает true если одна и та же дата, иначе false
function isSameDate(fullDate1, fullDate2) {
  return dateToString(fullDate1) === dateToString(fullDate2);
}
// сравнивает два обьекта типа {year, month, date} и возвращает true если один и тот же месяц, иначе false
function isSameMonth(fullDate1, fullDate2) {
  function dateToString(date) {
    let array = [date.year, `0${+date.month + 1}`.slice(-2)];
    return array.join('-');
  }
  return dateToString(fullDate1) === dateToString(fullDate2);
}
// сравнивает два обьекта типа {year, month, date} и возвращает true если fullDate1 меньше fullDate2
function isMonthLess(fullDate1, fullDate2) {
  return dateToString(fullDate1) < dateToString(fullDate2);
}
// сравнивает два обьекта типа {year, month, date} и возвращает true если fullDate1 больше fullDate2
function isMonthMore(fullDate1, fullDate2) {
  return dateToString(fullDate1) > dateToString(fullDate2);
}
// возвращает ширину экрана
function getWindowWidth() {
  return document.documentElement.clientWidth || document.body.clientWidth;
}

//========================================================================================================================================================
class Times {
  constructor(wrapper, id, props = {}) {
    this._times = [
      ['08:00', '08:00 am'],
      ['09:00', '09:00 am'],
      ['10:00', '10:00 am'],
      ['11:00', '11:00 am'],
      ['12:00', '12:00 pm'],
      ['13:00', '01:00 pm'],
      ['14:00', '02:00 pm'],
      ['15:00', '03:00 pm'],
      ['16:00', '04:00 pm'],
      ['17:00', '05:00 pm'],
      ['18:00', '06:00 pm'],
      ['19:00', '07:00 pm'],
      ['20:00', '08:00 pm'],
      ['21:00', '09:00 pm'],
      ['22:00', '10:00 pm'],
    ];
    this._id = id;
    this.wrapper = wrapper;
    this._config = {
      checkedTime: null, // String (Example: '08:00', '19:00' etc.) -> выбранное время
      disabledTimes: [], // Array<string> (Example: ['08:00', '19:00', '22:00']) -> время, которое потенциально может быть активным, но в даный момент disable (например забронирован номер в отеле на это время)
    };
    this._setConfig(props);
    this._init();
  }

  _init() {
    this._createTimesBody();
    this.wrapper.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'input' && e.target.closest('.time__item')) {
        this._config.checkedTime = e.target.getAttribute('value');
      }
    });
  }
  update(props = {}) {
    this._setConfig(props);
    this._createTimesBody();
  }
  _setConfig(props = {}) {
    this._config = Object.assign(this._config, JSON.parse(JSON.stringify(props)));
  }
  _createTimesBody() {
    this.wrapper.innerHTML = '';

    this._times.forEach((time) => {
      const item = document.createElement('div');
      item.classList.add('time__item');

      const input = createInput.bind(this, time)();
      const label = createLabel.bind(this, time)();

      item.insertAdjacentElement('beforeend', input);
      item.insertAdjacentElement('beforeend', label);
      this.wrapper.insertAdjacentElement('beforeend', item);
    });

    function createInput(time) {
      const input = document.createElement('input');
      input.classList.add('hide-input');
      input.setAttribute('type', 'radio');
      input.setAttribute('id', `${this._id}-time-${+time[0].slice(0, 2)}`);
      input.setAttribute('name', 'time');
      input.setAttribute('value', time[0]);

      if (this._config.disabledTimes.includes(time[0])) input.setAttribute('disabled', true);
      if (this._config.checkedTime === time[0]) input.checked = true;
      return input;
    }

    function createLabel(time) {
      const label = document.createElement('label');
      label.classList.add('time__item-value');
      label.setAttribute('for', `${this._id}-time-${+time[0].slice(0, 2)}`);
      label.insertAdjacentText('beforeend', time[1]);
      return label;
    }
  }
  getCheckedTime() {
    return this._config.checkedTime;
  }
}

class Month {
  constructor(wrapper, id, props = {}) {
    this._weekDays = [
      ['Mon', 'Monday'],
      ['Tue', 'Tuesday'],
      ['Wed', 'Wednesday'],
      ['Thu', 'Thursday'],
      ['Fri', 'Friday'],
      ['Sat', 'Saturday'],
      ['Sun', 'Sunday'],
    ];

    this._id = id; // id для уникализации инпутов
    this.wrapper = wrapper; // оболочка, в которой будет отрисован календарный месяц

    this._config = {
      current: {
        // информация о текущем отображаемом месяце
        year: null, // Number -> год
        month: null, // Number -> месяц
        date: null, // Number -> дата
        lastDate: null, // Number -> последняя дата месяца
        firstDay: null, // Number -> первый день месяца (ПН-ВС)
        lastDay: null, // Number -> последний день месяца (ПН-ВС)
      },
      inactiveToDate: null, // Number -> дата (число) к которой остальные даты будут неактивны (например уже прошедшие дни до сегодняшнего числа)
      prevCheckedDate: null, // Number -> предыдущая выбранная дата (нужно для кастомного события calendarItemClick, чтоб можно было отследить нажата та же дата или другая)
      checkedDate: null, // Number -> выбранная дата
      disableDates: [], // Array<number> -> даты, которые потенциально могут быть активны, но в даный момент disable (например дата ещё не прошла, но на даный момент все номера в отеле забронированы на эту дату)
    };
    this._init(props);
  }

  _init(props) {
    this._setConfig(props);
    this._createCalendarBody();
    this.wrapper.addEventListener('click', (e) => {
      if (
        e.target.tagName.toLowerCase() == 'input' &&
        e.target.closest('.calendar__item--available')
      ) {
        this._config.checkedDate = e.target.getAttribute('value').split('-')[2];
        document.dispatchEvent(
          new CustomEvent('calendarItemClick', {
            detail: {
              checkedDate: this.getCheckedDate(),
              prevChecked: this._config.prevCheckedDate,
            },
          }),
        );
        this._config.prevCheckedDate = this.getCheckedDate();
      }
    });
  }

  // Обновить месяц с новыми данными
  update(props = {}) {
    this._setConfig(props);
    this._createCalendarBody();
  }

  // Сохранение данных переданных через пропсы в this._config
  _setConfig(props = {}) {
    this._config = Object.assign(this._config, JSON.parse(JSON.stringify(props)));
    this._config.prevCheckedDate = this.getCheckedDate();
    this._setAllInfoForMonth(props.current.year, props.current.month);
  }

  // Получение всей информации о нужном месяце
  _setAllInfoForMonth(year = null, month = null) {
    let currentMonthInfo = null;
    if (!year && !month) {
      currentMonthInfo = new Date();
    } else {
      currentMonthInfo = new Date(year, month);
    }

    this._config.current = {
      year: currentMonthInfo.getFullYear(),
      month: currentMonthInfo.getMonth(),
      date: currentMonthInfo.getDate(),
      lastDate: new Date(year, month + 1, 0).getDate(),
      lastDay: new Date(year, month + 1, 0).getDay(),
      firstDay: new Date(year, month, 1).getDay() - 1,
    };
  }

  // Создание тела месяца
  _createCalendarBody() {
    this.wrapper.innerHTML = ''; // Очищаем тело месяца

    // Создаем дни недели
    for (let i = 0; i < this._weekDays.length; i++) {
      this._createItem(this._weekDays[i][0], 'calendar__item--title');
    }

    // Создаем пустые item перед 1 числом месяца, если месяц начинается не с понедельника
    for (let i = this._config.current.firstDay - 1; i >= 0; i--) {
      this._createItem('', 'calendar__item--empty');
    }

    // Создаем дни месяца
    for (let i = 1; i <= this._config.current.lastDate; i++) {
      if (i < this._config.inactiveToDate) {
        // дни. которые прошли / не должны быть кликабельными
        this._createItem(i, 'calendar__item--past');
      } else if (this._config.disableDates.includes(i)) {
        // дни, которые могут быть кликабельными, но сейчас disabled
        this._createItem(i, 'calendar__item--booked');
      } else {
        // кликабельные дни
        const item = this._createItem(i, 'calendar__item--available', true);
        if (this._config.checkedDate == i)
          item.querySelector('input').setAttribute('checked', true);
      }
    }

    // Создаем пустые item в конце месяца, если месяц заканчивается не в воскресенье
    for (let i = 0; i < 7 - this._config.current.lastDay; i++) {
      this._createItem('', 'calendar__item--empty');
    }
  }

  // Создание дня месяца
  _createItem(value = '', className = null, clickable = false) {
    const calendarItem = document.createElement('div');
    calendarItem.classList.add('calendar__item');
    className && calendarItem.classList.add(className);

    if (clickable) {
      const radioInput = this._createRadioInput(value);
      calendarItem.insertAdjacentElement('beforeend', radioInput);
    }

    const valueItem = this._createValueItem(value, clickable);
    calendarItem.insertAdjacentElement('beforeend', valueItem);

    this.wrapper.insertAdjacentElement('beforeend', calendarItem);
    return calendarItem;
  }

  // Создание input, если день месяца должен быть кликабельным
  _createRadioInput(value) {
    const radioInput = document.createElement('input');
    radioInput.classList.add('hide-input');
    radioInput.setAttribute('type', 'radio');
    radioInput.setAttribute('id', this._id + '-date-' + value);
    radioInput.setAttribute('name', 'date');
    radioInput.setAttribute(
      'value',
      `${this._config.current.year}-${('0' + (this._config.current.month + 1)).slice(-2)}-${('0' + value).slice(-2)}`,
    );

    return radioInput;
  }

  // Создание item со значение (день месяца)
  _createValueItem(value, isLabel = false) {
    const item = document.createElement(isLabel ? 'label' : 'div');
    item.classList.add('calendar__item-value');
    if (isLabel) item.setAttribute('for', this._id + '-date-' + value);
    item.insertAdjacentText('afterbegin', value);

    return item;
  }

  // Возвращает полную информацию {year, month, date} о выбранном дне месяца, если такой был выбран, иначе null
  getCheckedDate() {
    if (!this._config.checkedDate) return null;

    return {
      year: +this._config.current.year,
      month: +this._config.current.month,
      date: +this._config.checkedDate,
    };
  }
}

class Calendar {
  constructor(parrent, id, props = {}) {
    this._months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this._id = id;
    this.parrent = parrent;
    this._calendarEl = null;
    this._calendarMonth = null;

    this._config = {
      minMonth: { year: null, month: null },
      maxMonth: { year: null, month: null },
      currentMonth: { year: null, month: null },
      inactiveToDate: { year: null, month: null, date: null },
      checkedDate: { year: null, month: null, date: null },
      disableDates: [],
    };

    this._setConfig(props);
    this._init();
  }

  _init() {
    this._calendarEl = this._createCalendarElement();
    this._setDateInfoHTML();

    this._calendarMonth = new Month(this._calendarEl.querySelector('.calendar__body'), this._id, {
      current: this._config.currentMonth,
      checkedDate: this._config.checkedDate.date,
      inactiveToDate: isSameMonth(this._config.currentMonth, this._config.inactiveToDate)
        ? this._config.inactiveToDate.date
        : null,
      disableDates: this._config.disableDates,
    });

    // обрабатываем кастомное событие calendarItemClick, которое происходит при клике на дату в календаре (создается в new Month в _init()...)
    document.addEventListener('calendarItemClick', (e) => {
      this._config.checkedDate = e.detail.checkedDate;
    });

    // при клике на кнопку навигации происходит смена месяца на следующий/предыдущий
    this._calendarEl.querySelectorAll('.calendar__nav-button').forEach((button) => {
      button.addEventListener('click', this._onCalendarNavClick.bind(this));
    });
  }

  // обновление календаря с новыми данными
  update(props = {}) {
    this._setConfig(props);
    this._setDateInfoHTML();

    this._calendarMonth.update({
      current: this._config.currentMonth,
      disableDates: this._config.disableDates,
      checkedDate: this._config.checkedDate.date,
      inactiveToDate: isSameMonth(this._config.currentMonth, this._config.inactiveToDate)
        ? this._config.inactiveToDate.date
        : null,
      minMonth: this._config.minMonth,
      maxMonth: this._config.maxMonth,
    });
  }

  // запись значений с пропсов в свойства класса
  _setConfig(props = {}) {
    const todayFullDate = new Date();
    // this._config = Object.assign(this._config, JSON.parse(JSON.stringify(props)));

    this._config.currentMonth = props.currentMonth
      ? props.currentMonth
      : {
          year: todayFullDate.getFullYear(),
          month: todayFullDate.getMonth(),
        };

    this._config.minMonth = props.minMonth
      ? props.minMonth
      : {
          year: todayFullDate.getFullYear(),
          month: todayFullDate.getMonth(),
        };
    this._config.maxMonth = props.maxMonth
      ? props.maxMonth
      : {
          year: new Date(todayFullDate.getFullYear(), todayFullDate.getMonth() + 5).getFullYear(),
          month: new Date(todayFullDate.getFullYear(), todayFullDate.getMonth() + 5).getMonth(),
        };

    this._config.inactiveToDate = props.inactiveToDate
      ? props.inactiveToDate
      : {
          year: todayFullDate.getFullYear(),
          month: todayFullDate.getMonth(),
          date: todayFullDate.getDate(),
        };

    this._config.checkedDate = props.checkedDate ? props.checkedDate : {};
    this._config.disableDates = props.disableDates ? props.disableDates : [];
  }

  // смена месяца на следующий/предыдущий при клике на кнопку навигации
  _onCalendarNavClick(e) {
    e.preventDefault();

    let month = this._config.currentMonth.month;
    if (e.currentTarget.classList.contains('calendar__nav-button--prev')) {
      if (!isMonthMore(this._config.currentMonth, this._config.minMonth)) return;
      month = this._config.currentMonth.month - 1;
    } else {
      if (!isMonthLess(this._config.currentMonth, this._config.maxMonth)) return;
      month = this._config.currentMonth.month + 1;
    }

    if (month < 0) {
      this._config.currentMonth.month = 11;
      this._config.currentMonth.year = this._config.currentMonth.year - 1;
    } else if (month > 11) {
      this._config.currentMonth.month = 0;
      this._config.currentMonth.year = this._config.currentMonth.year + 1;
    } else {
      this._config.currentMonth.month = month;
    }

    this._calendarMonth.update({
      current: this._config.currentMonth,
      disableDates: filterBookedDates(
        this._config.currentMonth.year,
        this._config.currentMonth.month,
      ),
      inactiveToDate: isSameMonth(this._config.currentMonth, this._config.inactiveToDate)
        ? this._config.inactiveToDate.date
        : null,
      checkedDate: isSameMonth(this._config.checkedDate, this._config.currentMonth)
        ? this._config.checkedDate.date
        : null,
    });

    this._setDateInfoHTML();
  }

  // отрисовывает месяц и год (February 2025) в блоке .calendar__full-time
  _setDateInfoHTML() {
    this._calendarEl.querySelector('.calendar__full-time').textContent = '';
    this._calendarEl
      .querySelector('.calendar__full-time')
      .insertAdjacentText(
        'afterbegin',
        `${this._months[this._config.currentMonth.month]} ${this._config.currentMonth.year}`,
      );
  }

  // создание HTML структуры календаря
  _createCalendarElement() {
    this.parrent.insertAdjacentHTML(
      'beforeend',
      `<div class="calendar">
        <div class="calendar__info">
          <div class="calendar__full-time"></div>
          <div class="calendar__navigations">
            <button class="calendar__nav-button calendar__nav-button--prev">
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 1L1 9L9 17" stroke="#313F38" />
              </svg>
            </button>
            <button class="calendar__nav-button calendar__nav-button--next">
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 1L1 9L9 17" stroke="#313F38" />
              </svg>
            </button>
          </div>
        </div>
        <div class="calendar__body"></div>
      </div>`,
    );
    return this.parrent.querySelector('.calendar');
  }

  // возвращает объект с информацией о выбранной дате (год, месяц, число)
  getCheckedDate() {
    return this._config.checkedDate ? this._config.checkedDate : null;
  }
}

//========================================================================================================================================================
class Book {
  constructor(parrent, id, props = {}) {
    this._id = id;
    this._calendar;
    this._time;
    this.parrent = parrent;
    this.bookEl;
    this.isCreatedBookElement = false;

    const todayFullDate = new Date();
    this._config = {
      bookedDates: [],
      currentMonth: {
        year: todayFullDate.getFullYear(),
        month: todayFullDate.getMonth(),
      },
      minMonth: {
        year: null,
        month: null,
      },
      maxMonth: {
        year: null,
        month: null,
      },
      inactiveToDate: {
        year: todayFullDate.getFullYear(),
        month: todayFullDate.getMonth(),
        date: todayFullDate.getDate(),
      },
      disableDates: filterBookedDates(todayFullDate.getFullYear(), todayFullDate.getMonth()),
      checkedDate: {
        year: null,
        month: null,
        date: null,
        time: null,
      },
    };

    this.updateTime = this.updateTime.bind(this);
    this.setFocusElement = this.setFocusElement.bind(this);

    this.focusedEl = null; // элемент, на котором будет фокус после закрытия Book (элемент по клику на который Book и открылся)
    this._focusEl = [
      'a[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ];
    this._focusCatch = this._focusCatch.bind(this);
  }

  _setConfig(props = {}) {
    if (props.bookedDates) this._config.bookedDates = props.bookedDates;
    if (props.currentMonth) this._config.currentMonth = props.currentMonth;
    if (props.disableDates) this._config.disableDates = props.disableDates;
    if (props.inactiveToDate) this._config.inactiveToDate = props.inactiveToDate;
    if (props.checkedDate) this._config.checkedDate = props.checkedDate;
    if (props.minMonth) this._config.minMonth = props.minMonth;
    if (props.maxMonth) this._config.maxMonth = props.maxMonth;
  }

  init(props = {}) {
    if (this.isCreatedBookElement) return;
    this.bookEl = this._createBookElement();
    this.isCreatedBookElement = true;

    this._setConfig(props);

    this._calendar = new Calendar(this.bookEl.querySelector('.book__calendar'), this._id, {
      checkedDate: this._config.checkedDate,
      inactiveToDate: this._config.inactiveToDate,
      minMonth: this._config.minMonth,
      maxMonth: this._config.maxMonth,
      currentMonth: this._config.currentMonth,
      disableDates: this._config.disableDates,
    });

    this._time = new Times(this.bookEl.querySelector('.time__body'), this._id, {
      checkedTime: this._config.checkedDate.time,
      disabledTimes: this._config.bookedDates.find((obj) =>
        isSameDate(obj, this._config.checkedDate),
      )?.time,
    });

    // на случай если book вставлено в form, то при нажатии на Enter, если input (дата или время) в фокусе произойдет отправка данных с формы.
    // Поэтому сначала удаляем окно с календарем и временем, чтоб не отправлялись данные из него
    this.bookEl.addEventListener('keypress', (e) => {
      if (
        e.target.tagName.toLowerCase() === 'input' &&
        e.key === 'Enter' &&
        e.target.closest('form')
      )
        this.closeBook();
    });

    // закрить .book без сохранения выбранной даты и время
    this.bookEl.querySelector('.book__cancel').addEventListener('click', (e) => {
      e.preventDefault();
      this.closeBook();
    });

    // на мобильных устройствах календарь и время отображаются отдельно. по умолчанию сначала отображается календарь.
    // появляется кнопка .book__choose-time, при клике на которую скрывается календарь и отображается время
    this.bookEl.querySelector('.book__choose-time').addEventListener('click', (e) => {
      e.preventDefault();
      this.bookEl.classList.add('_show-time');
    });

    // на мобильных устройствах, когда отображается время, появляется кнопка .book__back,
    // при клике на которую скрывается время и отображается календарь
    this.bookEl.querySelector('.book__back').addEventListener('click', (e) => {
      e.preventDefault();
      this.bookEl.classList.remove('_show-time');
    });

    document.dispatchEvent(
      new CustomEvent('initBook', {
        detail: {
          target: this.bookEl,
          parent: this.parrent,
        },
      }),
    );

    // Зацикливаем переключение с помощью Tab внутри Book
    if (!this.focusedEl) return;
    const focusable = this.bookEl.querySelectorAll(this._focusEl);
    focusable[0].focus();
    document.addEventListener('keydown', this._focusCatch);
  }

  // Создание тела Book
  _createBookElement() {
    this.parrent.insertAdjacentHTML(
      'beforeend',
      `<div class="book">
        <div class="book__wrapper">
          <div class="book__body">
            <div class="book__content">
              <div class="book__calendar">
                <div class="book__title">Choose date</div>
              </div>
              <div class="book__time time">
                <div class="book__title">Choose time</div>
                <div class="time__body"></div>
              </div>
            </div>
            <div class="book__actions">
              <button class="book__back">
                <svg
                  width="10"
                  height="18"
                  viewBox="0 0 10 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 1L1 9L9 17" stroke="#313F38" />
                </svg>
                Back
              </button>
              <button class="book__cancel"><span></span>Cancel</button>
              <button class="book__choose-time">
                Choose time
                <svg
                  width="10"
                  height="18"
                  viewBox="0 0 10 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 1L1 9L9 17" stroke="#313F38" />
                </svg>
              </button>
              <button class="book__confirm">book room</button>
            </div>
          </div>
        </div>
      </div>`,
    );
    return this.parrent.querySelector('.book');
  }

  // Закрыть Book
  closeBook(isFocusLastItem = true) {
    document.dispatchEvent(
      new CustomEvent('closeBook', {
        detail: {
          this: this,
          target: this.bookEl,
        },
      }),
    );

    if (this.isCreatedBookElement) {
      this.parrent.removeChild(this.bookEl);
      this.isCreatedBookElement = false;
      this.bookEl = null;
    }

    //========================================================================================================================================================
    if (!this.focusedEl) return;
    if (isFocusLastItem) this.focusedEl.focus();
    this.focusedEl = null;
    document.removeEventListener('keydown', this._focusCatch);
  }

  // Установить элемент, на котором будет фокус после закрытия Book (элемент по клику на который Book и открылся)
  setFocusElement(focusedEl) {
    this.focusedEl = focusedEl;
  }

  // Зацикливание фокуса с помощью tab на элементах внутри Book
  _focusCatch(e) {
    if (e.which !== 9 || !this.parrent) return;
    const focusable = this.bookEl.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);

    if (e.shiftKey && focusedIndex === 0) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }

  // Обновить Time с новыми даннымив
  updateTime(props = {}) {
    this._time.update(props);
  }

  // Получить выбранное время
  getCheckedTime() {
    return this._time.getCheckedTime();
  }

  // Получить выбранную дату
  getCheckedDate() {
    return this._calendar.getCheckedDate();
  }
}

//========================================================================================================================================================
//=== реализация появления Book в popup и просто под input, как выпадающее меню, немного отличается,
//=== но есть общие моменты, которые вынесены в отдельные функции
//========================================================================================================================================================
function getDefaultConfig() {
  const todayFullDate = new Date();
  const config = {
    currentMonth: {
      year: todayFullDate.getFullYear(),
      month: todayFullDate.getMonth(),
    },
    minMonth: {
      year: todayFullDate.getFullYear(),
      month: todayFullDate.getMonth(),
    },
    maxMonth: {
      year: new Date(todayFullDate.getFullYear(), todayFullDate.getMonth() + 5).getFullYear(),
      month: new Date(todayFullDate.getFullYear(), todayFullDate.getMonth() + 5).getMonth(),
    },
    inactiveToDate: {
      year: todayFullDate.getFullYear(),
      month: todayFullDate.getMonth(),
      date: todayFullDate.getDate(),
    },
    bookedDates: bookedDates,
  };
  return config;
}

function initBook(e, from, to, book, config, isLastFocusEl = false) {
  const target = e.currentTarget === from.el ? from : to;
  target.el.classList.add('_open-book');
  target.isActive = true;

  if (target.el === from.el) {
    to.isActive = false;
    to.el.classList.remove('_open-book');
  } else {
    from.isActive = false;
    from.el.classList.remove('_open-book');
  }

  // если нужная нам дата есть в массиве с информацией о забронированых датах, то получаем данные о ней в bookedDate
  let bookedDate = null;
  if ((from.isActive && from.data.date) || (to.isActive && !to.data.date && from.data.date)) {
    bookedDate = bookedDates.find((obj) => isSameDate(obj, from.data));
  } else if (to.isActive && to.data.date) {
    bookedDate = bookedDates.find((obj) => isSameDate(obj, to.data));
  }

  // Если нажато поле Check out
  let minMonth = config.minMonth;
  let inactiveToDate = { ...config.inactiveToDate };
  let currentMonth = { ...config.currentMonth };
  let disabledTimes = bookedDate ? [...bookedDate.time] : [];
  if (to.isActive && from.data.date) {
    const tempDisabledTimes = [...disabledTimes];
    times.forEach((value, key) => {
      if (key <= from.data.time && !tempDisabledTimes.includes(key)) tempDisabledTimes.push(key);
    });

    let tempDate;
    if (tempDisabledTimes.length === times.size) {
      tempDate = new Date(from.data.year, from.data.month, from.data.date + 1);
    } else {
      tempDate = new Date(from.data.year, from.data.month, from.data.date);
    }

    inactiveToDate = {
      year: tempDate.getFullYear(),
      month: tempDate.getMonth(),
      date: tempDate.getDate(),
    };
    currentMonth = {
      year: inactiveToDate.year,
      month: inactiveToDate.month,
    };
    minMonth = { ...currentMonth };

    if (to.data.date && isSameDate(from.data, to.data)) {
      times.forEach((value, key) => {
        if (key <= from.data.time && !disabledTimes.includes(key)) disabledTimes.push(key);
      });
    }
  } else if (from.isActive && from.data.month) {
    currentMonth = {
      year: from.data.year,
      month: from.data.month,
    };
  }
  let disableDates = filterBookedDates(currentMonth.year, currentMonth.month);

  // Устанавливает поле, по клику на которое открылся Book, как последний активный элемент, на который будет возвращён фокус после закрытия Book
  if (isLastFocusEl) book.setFocusElement(e.target);
  // Инициализация Book с нужными данными и его отображение
  book.init({
    bookedDates: config.bookedDates,
    currentMonth: currentMonth,
    disableDates: [...disableDates],
    inactiveToDate: inactiveToDate,
    checkedDate: target.data,
    minMonth,
    maxMonth: config.maxMonth,
  });
}

function confirmSelectDateAndTime(from, to, book) {
  // если были указаны и дата и время, то данные сохранятся, а функция вернёт true
  // иначе данные не сохранятся, а функция вернёт false
  const checkedDate = book.getCheckedDate();
  const checkedTime = book.getCheckedTime();

  if (!checkedDate?.date || !checkedTime) {
    alert('No date or time selected!!!');
    return false;
  }

  // сохраняем и отображаем выбранные дату и время в активном поле
  if (from.isActive) {
    setItemNewDate(from.el, from.data);
    // если после изменения даты и времени в "Check in" в поле "Check out" были выбраны дата и время и они окажутся меньше,
    // то очистить данные в "Check out"
    if (
      to.data.date &&
      Date.parse(dateToString(from.data) + 'T' + from.data.time + ':00') >=
        Date.parse(dateToString(to.data) + 'T' + to.data.time + ':00')
    ) {
      to.data = {
        year: null,
        month: null,
        date: null,
        time: null,
      };
      to.el.querySelector('input').removeAttribute('value');
      to.el.querySelector('.custom-date span').innerHTML = 'Check out';
    }
  } else {
    setItemNewDate(to.el, to.data);
  }

  return true;

  // отображает данные в активном поле и сохраняет их (в from или to)
  function setItemNewDate(item, data) {
    data.year = checkedDate.year;
    data.month = checkedDate.month;
    data.date = checkedDate.date;
    data.time = checkedTime;

    item.querySelector('input').setAttribute('value', `${dateToString(data)}T${data.time}`);
    item.querySelector('.custom-date span').innerHTML =
      `${dateToString(data, '/', true)}, ${times.get(data.time)}`;
  }
}

function onCalendarItemClick(e, from, to, book, config) {
  const checkedDate = e.detail.checkedDate;
  if (e.detail.prevChecked && isSameDate(e.detail.prevChecked, checkedDate)) return;

  const bookedDate = config.bookedDates.find((obj) => isSameDate(obj, checkedDate));
  const disabledTimes = bookedDate ? [...bookedDate.time] : [];

  if (to.isActive && from.data.time && isSameDate(checkedDate, from.data)) {
    times.forEach((value, key) => {
      if (key <= from.data.time && !disabledTimes.includes(key)) disabledTimes.push(key);
    });
  }

  let checkedTime = null;
  const activeInput = from.isActive ? from : to.isActive ? to : null;
  if (activeInput && isSameDate(checkedDate, activeInput.data)) checkedTime = activeInput.data.time;

  book.updateTime({ disabledTimes, checkedTime });
}

// Book как выпадающий список под input
document.querySelectorAll('[data-book]').forEach((bookEl, index) => {
  const book = new Book(bookEl, ++index, { bookedDates });

  let config = getDefaultConfig();
  const from = {
    el: bookEl.querySelector('[data-book-from]'),
    isActive: false,
    data: {
      year: null,
      month: null,
      date: null,
      time: null,
    },
  };
  const to = {
    el: bookEl.querySelector('[data-book-to]'),
    isActive: false,
    data: {
      year: null,
      month: null,
      date: null,
      time: null,
    },
  };

  from.el.addEventListener('click', (e) => onInputClick(e, from));
  to.el.addEventListener('click', (e) => onInputClick(e, to));

  function onInputClick(e, target) {
    // так как поля from и to кастомные, и содержат в себе скрытый input и кастомный, то собитые 'click' стработает 2 раза,
    // поэтому возвращаем false, когда e.target это input
    if (e.target.tagName.toLowerCase() == 'input') return;

    // если нажато то же поле, по которому открывался Book, то закрываем его
    if (target.el.classList.contains('_open-book')) {
      book.closeBook();
      return;
    }
    // закрывает Book на случай если он уже был открыт другим полем: from или to
    book.closeBook();

    initBook(e, from, to, book, config, true);

    if (window.innerWidth >= 1024) setBookPosition(book.bookEl, target.el);
    observer.observe(bookEl);

    document.addEventListener('closeBook', onCloseBook);
    document.addEventListener('calendarItemClick', onCalendarItemClickWrap);
    book.bookEl.querySelector('.book__confirm').addEventListener('click', () => {
      const isConfirm = confirmSelectDateAndTime(from, to, book);
      if (isConfirm) book.closeBook();
    });
  }

  function onCloseBook(e) {
    if (e.detail.this !== book) return;

    if (from.isActive) from.el.classList.remove('_open-book');
    else if (to.isActive) to.el.classList.remove('_open-book');

    observer.unobserve(bookEl);
    document.querySelector('.wrapper').style.removeProperty('padding-bottom');
    document.querySelector('.wrapper').removeAttribute('data-pb');
    document.removeEventListener('closeBook', onCloseBook);
    document.removeEventListener('calendarItemClick', onCalendarItemClickWrap);
  }

  function onCalendarItemClickWrap(e) {
    onCalendarItemClick(e, from, to, book, config);
  }

  const observer = new ResizeObserver((entries) => {
    const activeEl = from.isActive ? from.el : to.el;
    if (book.bookEl && activeEl) {
      setBookPosition(book.bookEl, activeEl);
    }
  });

  function setBookPosition(positionedEl, relativeEl) {
    const positionedElRect = positionedEl.getBoundingClientRect();
    const relativeElRect = relativeEl.getBoundingClientRect();
    const parrentRect = bookEl.getBoundingClientRect();
    let paddingBottom = document.querySelector('.wrapper').getAttribute('data-pb');
    paddingBottom = paddingBottom ? paddingBottom : 0;
    if (relativeElRect.left + positionedElRect.width < getWindowWidth()) {
      positionedEl.style.left = relativeElRect.left - parrentRect.left + 'px';
    } else {
      positionedEl.style.left =
        relativeElRect.left -
        parrentRect.left -
        (relativeElRect.left + positionedElRect.width - getWindowWidth()) +
        'px';
    }

    if (
      window.scrollY + positionedElRect.top + positionedElRect.height >
      document.documentElement.scrollHeight - paddingBottom
    ) {
      paddingBottom =
        window.scrollY +
        positionedElRect.top +
        positionedElRect.height -
        (document.documentElement.scrollHeight - paddingBottom);
      document.querySelector('.wrapper').style.paddingBottom = paddingBottom + 'px';
      document.querySelector('.wrapper').setAttribute('data-pb', paddingBottom);
    }
  }
});

// Book в popup
function bookInPopup() {
  const bookPopupInfo = new Map();
  let from, to, book, config, lastFocusEl;
  document.addEventListener('beforePopupOpen', (e) => {
    if (e.detail.popup.targetOpen.selector !== '#form-book-popup') return;
    lastFocusEl = e.detail.popup.lastFocusEl;
    const popupEl = e.detail.popup.targetOpen.element;

    config = getDefaultConfig();
    from = {
      el: popupEl.querySelector('[data-book-from]'),
      isActive: false,
      data: bookPopupInfo.get(lastFocusEl)
        ? bookPopupInfo.get(lastFocusEl).from
        : {
            year: null,
            month: null,
            date: null,
            time: null,
          },
    };
    to = {
      el: popupEl.querySelector('[data-book-to]'),
      isActive: false,
      data: bookPopupInfo.get(lastFocusEl)
        ? bookPopupInfo.get(lastFocusEl).to
        : {
            year: null,
            month: null,
            date: null,
            time: null,
          },
    };

    if (from.data.date) {
      setInfoToField(from);
    } else {
      from.el.querySelector('.custom-date span').innerHTML = 'Check to';
    }
    if (to.data.date) {
      setInfoToField(to);
    } else {
      to.el.querySelector('.custom-date span').innerHTML = 'Check out';
    }

    from.el.addEventListener('click', onInputClick);
    to.el.addEventListener('click', onInputClick);
  });

  document.addEventListener('beforePopupClose', (e) => {
    if (e.detail.popup.hash !== e.detail.popup.targetOpen.selector) return;
    if (from && from.el) from.el.removeEventListener('click', onInputClick);
    if (to && to.el) to.el.removeEventListener('click', onInputClick);
    if (book) book.closeBook();
  });

  function setInfoToField(target) {
    target.el
      .querySelector('input')
      .setAttribute('value', `${dateToString(target.data)}T${target.data.time}`);
    target.el.querySelector('.custom-date span').innerHTML =
      `${dateToString(target.data, '/', true)}, ${times.get(target.data.time)}`;
  }
  function onInputClick(e) {
    const bookPopup = document.querySelector('#book-popup');
    book = new Book(bookPopup.querySelector('.popup__content'), 'popup', { bookedDates });

    initBook(e, from, to, book, config);

    document.addEventListener('calendarItemClick', onCalendarItemClickWrap);
    book.bookEl.querySelector('.book__confirm').addEventListener('click', () => {
      const isConfirm = confirmSelectDateAndTime(from, to, book);
      if (!isConfirm) return;

      bookPopupInfo.set(lastFocusEl, {
        from: from.data,
        to: to.data,
      });

      book.closeBook();
      from.el.removeEventListener('click', onInputClick);
      to.el.removeEventListener('click', onInputClick);
      flsModules.popup.close();

      setTimeout(function () {
        flsModules.popup.open('#form-book-popup');
      }, 0);

      document.removeEventListener('calendarItemClick', onCalendarItemClickWrap);
    });
    document.addEventListener('closeBook', onCloseBook);
  }
  function onCalendarItemClickWrap(e) {
    onCalendarItemClick(e, from, to, book, config);
  }
  function onCloseBook() {
    from.el.removeEventListener('click', onInputClick);
    to.el.removeEventListener('click', onInputClick);
    document.removeEventListener('closeBook', onCloseBook);
    flsModules.popup.close();
    setTimeout(function () {
      flsModules.popup.open('#form-book-popup');
    }, 0);
  }
}
bookInPopup();
