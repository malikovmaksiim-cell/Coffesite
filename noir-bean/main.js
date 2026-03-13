import './style.css'

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Reveal Animations using Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
});

// Force check on load in case observer misses initial viewport items
setTimeout(() => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('active');
    }
  });
}, 100);

// Hero Canvas Background Animation
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const frameCount = 169; // As requested, exactly 169 frames
  const images = [];
  let imagesLoaded = 0;
  let currentFrame = 0;

  // Load images
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    const paddedIndex = i.toString().padStart(3, '0');
    // Images are located in public/images/frames/
    img.src = `/images/frames/ezgif-frame-${paddedIndex}.jpg`;
    img.onload = () => {
      imagesLoaded++;
      // Set canvas to native resolution of the first loaded image
      if (imagesLoaded === 1 && currentFrame === 0) {
        canvas.width = img.width;
        canvas.height = img.height;
        renderFrame();
      }
      if (imagesLoaded === frameCount) {
        // Start animation loop when all loaded
        requestAnimationFrame(playAnimation);
      }
    };
    images.push(img);
  }

  // Draw frame exactly to canvas natural bounds (CSS will handle scaling)
  const renderFrame = () => {
    if (images[currentFrame] && images[currentFrame].complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[currentFrame], 0, 0, canvas.width, canvas.height);
    }
  };

  let lastTime = 0;
  const fps = 24; // 24 frames per second for cinematic feel
  const interval = 1000 / fps;

  const playAnimation = (timestamp) => {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    
    if (delta >= interval) {
      currentFrame = (currentFrame + 1) % frameCount;
      renderFrame();
      lastTime = timestamp - (delta % interval);
    }
    requestAnimationFrame(playAnimation);
  };
}

// --- Scroll to Top Button ---
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// --- Mobile Navigation Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const mobileLangToggle = document.getElementById('mobile-lang-toggle');
const mobileOrderBtn = document.getElementById('mobile-order-btn');

function openMobileMenu() {
  mobileMenuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMobileMenu() {
  mobileMenuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', openMobileMenu);
closeMobileMenuBtn.addEventListener('click', closeMobileMenu);

mobileNavLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

mobileOrderBtn.addEventListener('click', () => {
  closeMobileMenu();
  orderBtn.click(); // Trigger the main order button logic
});


// --- Premium Booking Flow Logic ---
const modal = document.getElementById('order-modal');
const orderBtn = document.getElementById('order-btn');
const closeModal = document.getElementById('close-modal');

// Views
const bookingFormView = document.getElementById('booking-form-view');
const bookingSuccessView = document.getElementById('booking-success-view');
const closeSuccessBtn = document.getElementById('close-success-btn');

orderBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // Reset views
  bookingFormView.classList.remove('hidden-view');
  bookingSuccessView.classList.add('hidden-view');
  document.getElementById('order-form').reset();
  
  // Reset custom pickers
  document.getElementById('pickup-date-display').value = '';
  document.getElementById('pickup-date').value = '';
  document.getElementById('pickup-time-display').value = '';
  document.getElementById('pickup-time').value = '';
  selectedDate = null;
  selectedTime = null;
  renderCalendar();
  
  modal.classList.add('open');
});

const closeAllPickers = () => {
  document.getElementById('date-picker-dropdown').classList.remove('active');
  document.getElementById('time-picker-dropdown').classList.remove('active');
};

const closeModalLogic = () => {
  modal.classList.remove('open');
  closeAllPickers();
};

closeModal.addEventListener('click', closeModalLogic);
closeSuccessBtn.addEventListener('click', closeModalLogic);

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalLogic();
  }
  // Also close atmosphere modal if clicking outside it
  if (e.target === atmosphereModal) {
    closeAtmosphereModal();
  }
});

// --- Atmosphere Interactive Modal ---
const atmosphereModal = document.getElementById('atmosphere-modal');
const closeAtmosphereBtn = document.getElementById('close-atmosphere-modal');
const atmosphereImg = document.getElementById('atmosphere-modal-img');
const atmosphereTitle = document.getElementById('atmosphere-modal-title');
const atmosphereDesc = document.getElementById('atmosphere-modal-desc');

let currentAtmosphereItem = null;

const showcaseItems = document.querySelectorAll('.showcase-item');
showcaseItems.forEach(item => {
  item.addEventListener('click', () => {
    currentAtmosphereItem = item;
    
    // Inject Image
    atmosphereImg.src = item.getAttribute('data-modal-img');
    
    // Inject Text based on current language
    updateAtmosphereModalText();
    
    atmosphereModal.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent scrolling
  });
});

function updateAtmosphereModalText() {
  if (!currentAtmosphereItem) return;
  
  if (currentLang === 'en') {
    atmosphereTitle.textContent = currentAtmosphereItem.getAttribute('data-modal-title-en');
    atmosphereDesc.textContent = currentAtmosphereItem.getAttribute('data-modal-text-en');
  } else {
    atmosphereTitle.textContent = currentAtmosphereItem.getAttribute('data-modal-title-ru');
    atmosphereDesc.textContent = currentAtmosphereItem.getAttribute('data-modal-text-ru');
  }
}

function closeAtmosphereModal() {
  atmosphereModal.classList.remove('open');
  document.body.style.overflow = '';
  currentAtmosphereItem = null;
}

closeAtmosphereBtn.addEventListener('click', closeAtmosphereModal);

// Custom Date Picker Logic
let currentDate = new Date(); // Month currently being viewed
let selectedDate = null; // Actual selected Date object

const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthNamesRu = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const datePickerGroup = document.getElementById('date-picker-group');
const dateInputDisplay = document.getElementById('pickup-date-display');
const dateHiddenInput = document.getElementById('pickup-date');
const dateDropdown = document.getElementById('date-picker-dropdown');
const calendarDays = document.getElementById('calendar-days');
const calendarMonthYear = document.getElementById('calendar-month-year');
const prevMonthBtn = document.querySelector('.prev-month');
const nextMonthBtn = document.querySelector('.next-month');

dateInputDisplay.addEventListener('click', (e) => {
  e.stopPropagation();
  const isActive = dateDropdown.classList.contains('active');
  closeAllPickers();
  if (!isActive) {
    dateDropdown.classList.add('active');
    renderCalendar();
  }
});

dateDropdown.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent closing when clicking inside dropdown
});

document.addEventListener('click', (e) => {
  if (!datePickerGroup.contains(e.target) && !document.getElementById('time-picker-group').contains(e.target)) {
    closeAllPickers();
  }
});

prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

function renderCalendar() {
  calendarDays.innerHTML = '';
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const monthNames = currentLang === 'en' ? monthNamesEn : monthNamesRu;
  calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Pad empty days before first day of month
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('calendar-day', 'empty');
    calendarDays.appendChild(emptyDiv);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = day;
    
    const dateToCheck = new Date(year, month, day);
    dateToCheck.setHours(0, 0, 0, 0);
    
    if (dateToCheck < today) {
      dayDiv.classList.add('disabled');
    } else {
      if (selectedDate && dateToCheck.getTime() === selectedDate.getTime()) {
        dayDiv.classList.add('selected');
      }
      
      dayDiv.addEventListener('click', () => {
        selectedDate = new Date(year, month, day);
        dateHiddenInput.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Format display date
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        // Use 'en-US' or 'ru-RU' based on currentLang
        const locale = currentLang === 'en' ? 'en-US' : 'ru-RU';
        dateInputDisplay.value = selectedDate.toLocaleDateString(locale, options);
        
        // Reset time if selected time is now invalid (e.g. past time on today)
        validateSelectedTime();
        
        dateDropdown.classList.remove('active');
        
        // Also remove error styling if any
        dateInputDisplay.style.borderColor = '';
      });
    }
    
    calendarDays.appendChild(dayDiv);
  }
}

// Custom Time Picker Logic
let selectedTime = null; // Format "HH:MM"
const timeInputDisplay = document.getElementById('pickup-time-display');
const timeHiddenInput = document.getElementById('pickup-time');
const timeDropdown = document.getElementById('time-picker-dropdown');
const timeSlotsGrid = document.getElementById('time-slots-grid');

timeInputDisplay.addEventListener('click', (e) => {
  e.stopPropagation();
  // Require Date to be selected first
  if (!selectedDate) {
    dateInputDisplay.style.borderColor = '#ff4d4f';
    const alertMsg = currentLang === 'en' ? 'Please select a date first' : 'Пожалуйста, сначала выберите дату';
    alert(alertMsg);
    return;
  }
  
  const isActive = timeDropdown.classList.contains('active');
  closeAllPickers();
  if (!isActive) {
    timeDropdown.classList.add('active');
    renderTimeSlots();
  }
});

timeDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
});

function renderTimeSlots() {
  timeSlotsGrid.innerHTML = '';
  
  // Operating hours (7am to 7pm)
  const startHour = 7;
  const endHour = 19;
  const interval = 30; // minutes
  
  const now = new Date();
  const isToday = selectedDate && 
                  selectedDate.getDate() === now.getDate() && 
                  selectedDate.getMonth() === now.getMonth() && 
                  selectedDate.getFullYear() === now.getFullYear();

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      // Don't generate 19:30
      if (h === endHour && m > 0) continue;
      
      const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      
      // Formatting for display (12h format for EN, 24h for RU if desired, keeping simple 24h for both for now or 12h)
      const period = h >= 12 ? 'PM' : 'AM';
      let displayH = h % 12 || 12;
      const displayTime = `${displayH}:${String(m).padStart(2, '0')} ${period}`;
      
      const slotDiv = document.createElement('div');
      slotDiv.classList.add('time-slot');
      slotDiv.textContent = displayTime;
      
      // Check if time is in the past (if today)
      // Allow booking at least 30 mins in advance
      let isDisabled = false;
      if (isToday) {
        const slotTime = new Date(now);
        slotTime.setHours(h, m, 0, 0);
        // Add 30 buffer
        const bufferTime = new Date(now.getTime() + 30 * 60000);
        if (slotTime < bufferTime) {
          isDisabled = true;
          slotDiv.classList.add('disabled');
        }
      }
      
      if (!isDisabled) {
        if (selectedTime === timeString) {
          slotDiv.classList.add('selected');
        }
        
        slotDiv.addEventListener('click', () => {
          selectedTime = timeString;
          timeHiddenInput.value = timeString;
          timeInputDisplay.value = displayTime;
          timeDropdown.classList.remove('active');
        });
      }
      
      timeSlotsGrid.appendChild(slotDiv);
    }
  }
  
  if (timeSlotsGrid.children.length === 0 || Array.from(timeSlotsGrid.children).every(child => child.classList.contains('disabled'))) {
    const noSlotsMsg = document.createElement('div');
    noSlotsMsg.style.gridColumn = '1 / -1';
    noSlotsMsg.style.textAlign = 'center';
    noSlotsMsg.style.padding = '1rem';
    noSlotsMsg.style.color = 'var(--text-secondary)';
    noSlotsMsg.textContent = currentLang === 'en' ? 'No available slots today' : 'Сегодня нет свободного времени';
    timeSlotsGrid.appendChild(noSlotsMsg);
  }
}

function validateSelectedTime() {
  if (!selectedTime || !selectedDate) return;
  
  const now = new Date();
  const isToday = selectedDate.getDate() === now.getDate() && 
                  selectedDate.getMonth() === now.getMonth() && 
                  selectedDate.getFullYear() === now.getFullYear();
                  
  if (isToday) {
    const [h, m] = selectedTime.split(':').map(Number);
    const slotTime = new Date(now);
    slotTime.setHours(h, m, 0, 0);
    const bufferTime = new Date(now.getTime() + 30 * 60000);
    
    if (slotTime < bufferTime) {
      // Invalid time selected for today, clear it
      selectedTime = null;
      timeHiddenInput.value = '';
      timeInputDisplay.value = '';
    }
  }
}

// --- WhatsApp Integration (Order & Contact) ---
const orderForm = document.getElementById('order-form');
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const time = timeHiddenInput.value;
  const date = dateInputDisplay.value; // Store the nicely formatted date
  const name = document.getElementById('guest-name').value;
  const phone = document.getElementById('guest-phone').value;
  const comment = document.getElementById('guest-comment').value;
  
  if (!time || !selectedDate) {
      alert(currentLang === 'en' ? 'Please select date and time' : 'Пожалуйста, выберите дату и время');
      return;
  }
  
  const greeting = currentLang === 'en' ? 'Hello, I would like to place an order!' : 'Здравствуйте, я хотел бы сделать заказ!';
  let message = `${greeting}\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nTime: ${timeInputDisplay.value}`;
  
  if (comment.trim() !== '') {
      message += `\nComment: ${comment}`;
  }
  
  // Show success view instead of immediate redirect to make it feel more complete
  bookingFormView.classList.add('hidden-view');
  bookingSuccessView.classList.remove('hidden-view');
  
  // Open WhatsApp in background
  const waUrl = `https://wa.me/3725551234?text=${encodeURIComponent(message)}`;
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 1500); // Small delay to let user read success message
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const msg = document.getElementById('contact-message').value;
    
    const greeting = currentLang === 'en' ? 'New Website Message' : 'Новое сообщение с сайта';
    const finalMsg = `${greeting}\n\nFrom: ${name}\n\nMessage:\n${msg}`;
    
    const waUrl = `https://wa.me/3725551234?text=${encodeURIComponent(finalMsg)}`;
    window.open(waUrl, '_blank');
    contactForm.reset();
  });
}

// --- Language Toggle ---
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'en';

function applyLanguage() {
  const toggleText = currentLang === 'en' ? 'RU' : 'EN';
  langToggle.textContent = toggleText;
  mobileLangToggle.textContent = toggleText; // update mobile toggle too
  
  // Find all elements with data translation attributes
  const translatableElements = document.querySelectorAll('[data-en][data-ru], [data-en-placeholder][data-ru-placeholder]');
  translatableElements.forEach(el => {
    if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
       el.value = el.getAttribute(`data-${currentLang}`);
    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
       if (el.hasAttribute(`data-${currentLang}-placeholder`)) {
         el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
       }
    } else {
       el.innerHTML = el.getAttribute(`data-${currentLang}`);
    }
  });
  
  // Also update atmosphere modal if it is open
  if (document.getElementById('atmosphere-modal').classList.contains('open')) {
    updateAtmosphereModalText();
  }
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ru' : 'en';
  applyLanguage();
});

mobileLangToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ru' : 'en';
  applyLanguage();
});
