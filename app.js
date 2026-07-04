document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scrolled Shadow Effect ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Drawer Menu ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.innerHTML = '&#9776;'; // Menu bar icon
      } else {
        mobileDrawer.classList.add('open');
        mobileMenuBtn.innerHTML = '&times;'; // Close X icon
      }
    });

    // Close drawer when clicking a mobile nav link
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.innerHTML = '&#9776;';
      });
    });
  }

  // --- Doctors Carousel Slider Logic ---
  const carouselTrackWrapper = document.querySelector('.carousel-track-wrapper');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (carouselTrackWrapper && prevBtn && nextBtn) {
    const getSlideWidth = () => {
      const slide = carouselTrackWrapper.querySelector('.carousel-slide');
      return slide ? slide.getBoundingClientRect().width : 0;
    };

    nextBtn.addEventListener('click', () => {
      const slideWidth = getSlideWidth();
      carouselTrackWrapper.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      const slideWidth = getSlideWidth();
      carouselTrackWrapper.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });
    
    const handleScroll = () => {
      const scrollLeft = carouselTrackWrapper.scrollLeft;
      const maxScroll = carouselTrackWrapper.scrollWidth - carouselTrackWrapper.clientWidth;
      
      prevBtn.style.opacity = scrollLeft <= 8 ? '0.4' : '1';
      prevBtn.style.pointerEvents = scrollLeft <= 8 ? 'none' : 'auto';
      nextBtn.style.opacity = scrollLeft >= maxScroll - 8 ? '0.4' : '1';
      nextBtn.style.pointerEvents = scrollLeft >= maxScroll - 8 ? 'none' : 'auto';
    };
    
    carouselTrackWrapper.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial status check
    setTimeout(handleScroll, 200);
  }

  // --- Surgery Cost & EMI Calculator ---
  const surgerySelect = document.getElementById('calc-surgery');
  const citySelect = document.getElementById('calc-city');
  const resultBasePrice = document.getElementById('result-base-price');
  const resultInsurance = document.getElementById('result-insurance');
  const resultEmi = document.getElementById('result-emi');

  // Surgery database
  const surgeryData = {
    lasik: { basePrice: 38000, name: 'LASIK Eye Surgery', insurance: '90% Covered', coveragePercent: 90 },
    cataract: { basePrice: 28000, name: 'Cataract Surgery', insurance: '95% Covered', coveragePercent: 95 },
    piles: { basePrice: 42000, name: 'Laser Proctology (Piles)', insurance: '100% Covered (Cashless)', coveragePercent: 100 },
    urology: { basePrice: 48000, name: 'Urology (Kidney Stone)', insurance: '100% Covered (Cashless)', coveragePercent: 100 },
    ortho: { basePrice: 95000, name: 'Knee Joint Replacement', insurance: '95% Covered', coveragePercent: 95 },
    gyne: { basePrice: 35000, name: 'Gynecology Treatment', insurance: '90% Covered', coveragePercent: 90 },
    hernia: { basePrice: 45000, name: 'Laparoscopic Hernia', insurance: '100% Covered (Cashless)', coveragePercent: 100 },
    lap: { basePrice: 55000, name: 'Laparoscopic Gallbladder', insurance: '100% Covered (Cashless)', coveragePercent: 100 }
  };

  // City modifier
  const cityModifiers = {
    delhi: 1.05,
    mumbai: 1.08,
    bangalore: 1.03,
    gurugram: 1.05,
    noida: 1.0,
    pune: 0.98,
    hyderabad: 0.97,
    chennai: 0.98
  };

  const calculateCost = () => {
    if (!surgerySelect || !citySelect) return;
    const surgery = surgerySelect.value;
    const city = citySelect.value;

    const selectedSurgery = surgeryData[surgery] || surgeryData.lasik;
    const modifier = cityModifiers[city] || 1.0;

    const finalBasePrice = Math.round(selectedSurgery.basePrice * modifier);
    const calculatedEmi = Math.round(finalBasePrice / 12); // 12 months 0% EMI

    // Update UI with animation/smooth change
    if (resultBasePrice && resultInsurance && resultEmi) {
      animateValue(resultBasePrice, parseInt(resultBasePrice.innerText.replace(/[^\d]/g, '')) || 0, finalBasePrice, 300, '₹');
      resultInsurance.innerText = selectedSurgery.insurance;
      animateValue(resultEmi, parseInt(resultEmi.innerText.replace(/[^\d]/g, '')) || 0, calculatedEmi, 300, '₹', '/mo');
      
      const progressBar = document.getElementById('result-insurance-progress');
      if (progressBar) {
        progressBar.style.width = selectedSurgery.coveragePercent + '%';
      }
    }
  };

  // Helper function to animate number counters
  const animateValue = (obj, start, end, duration, prefix = '', suffix = '') => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      obj.innerHTML = prefix + currentVal.toLocaleString('en-IN') + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  if (surgerySelect && citySelect) {
    surgerySelect.addEventListener('change', calculateCost);
    citySelect.addEventListener('change', calculateCost);
    // Initialize calculator
    calculateCost();
  }

  // --- FAQ Accordion Toggles ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const content = i.querySelector('.faq-content');
          if (content) content.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.faq-content');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    }
  });

  // --- Booking Modal Multi-Step Logic ---
  const modalOverlay = document.getElementById('booking-modal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  
  const modalForm = document.getElementById('modal-booking-form');
  const modalSteps = document.querySelectorAll('.step-content');
  const stepDots = document.querySelectorAll('.step-dot');
  
  const btnPrevStep = document.getElementById('btn-prev-step');
  const btnNextStep = document.getElementById('btn-next-step');
  const successView = document.getElementById('success-view');

  let currentStep = 0;

  const openModal = (defaultSpeciality = '') => {
    if (!modalOverlay) return;
    
    // Set default speciality selector if provided
    if (defaultSpeciality) {
      const selectSpec = document.getElementById('modal-speciality');
      if (selectSpec) {
        selectSpec.value = defaultSpeciality;
      }
    }
    
    modalOverlay.classList.add('open');
    resetModal();
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
  };

  const resetModal = () => {
    currentStep = 0;
    if (modalForm) modalForm.reset();
    if (modalForm) modalForm.style.display = 'block';
    if (successView) successView.style.display = 'none';
    showStep(currentStep);
  };

  const showStep = (stepIdx) => {
    if (modalSteps.length === 0) return;
    
    modalSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === stepIdx);
    });

    stepDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx <= stepIdx);
    });

    // Handle button visibility
    if (stepIdx === 0) {
      btnPrevStep.style.visibility = 'hidden';
      btnNextStep.innerText = 'Next Step →';
    } else if (stepIdx === modalSteps.length - 1) {
      btnPrevStep.style.visibility = 'visible';
      btnNextStep.innerText = 'Confirm Booking ✓';
    } else {
      btnPrevStep.style.visibility = 'visible';
      btnNextStep.innerText = 'Next Step →';
    }
  };

  // Click handler to open booking modal from various CTA buttons
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const spec = btn.getAttribute('data-speciality') || '';
      openModal(spec);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (btnNextStep && btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });

    btnNextStep.addEventListener('click', () => {
      // Validate current step fields
      const activeStepEl = modalSteps[currentStep];
      const inputs = activeStepEl.querySelectorAll('input, select');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          isValid = false;
        }
      });

      if (!isValid) return;

      if (currentStep < modalSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
      } else {
        // Final submit - Process booking locally and show success screen
        submitBooking();
      }
    });
  }

  const submitBooking = () => {
    if (!modalForm || !successView) return;
    
    // Get values
    const name = document.getElementById('modal-name').value;
    const phone = document.getElementById('modal-phone').value;
    const speciality = document.getElementById('modal-speciality').value;
    const city = document.getElementById('modal-city').value;

    // Generate random booking ID & care manager
    const bookingId = 'HVC-' + Math.floor(100000 + Math.random() * 900000);
    const careManagers = ['Amit Sharma', 'Niti Gupta', 'Tarun Verma', 'Priyanka Sen', 'Vikram Malhotra'];
    const assignedManager = careManagers[Math.floor(Math.random() * careManagers.length)];

    // Populate success details
    document.getElementById('booking-id-val').innerText = bookingId;
    document.getElementById('manager-name-val').innerText = assignedManager;

    // Hide form, show success
    modalForm.style.display = 'none';
    successView.style.display = 'flex';
  };

  // --- Home Form Submit Handler ---
  const quickBookingForm = document.getElementById('hero-booking-form');
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('hero-name').value;
      const phone = document.getElementById('hero-phone').value;
      const speciality = document.getElementById('hero-speciality').value;

      // Prefill and launch modal to finish step 2
      openModal(speciality);
      
      // Autofill fields in modal
      const modalName = document.getElementById('modal-name');
      const modalPhone = document.getElementById('modal-phone');
      
      if (modalName) modalName.value = name;
      if (modalPhone) modalPhone.value = phone;

      // Advance to step 1 (where city is)
      currentStep = 1;
      showStep(currentStep);
    });
  }

  // --- Scroll Reveal Effect ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 50) {
        el.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  // Run once initially
  revealOnScroll();
});
