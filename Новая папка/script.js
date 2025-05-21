document.addEventListener("DOMContentLoaded", () => {
  // Прелоадер
  const loader = document.getElementById("loader")
  setTimeout(() => {
    loader.style.opacity = "0"
    setTimeout(() => {
      loader.style.display = "none"
    }, 500)
  }, 1000)

  // Плавный скролл для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Закрываем меню, если оно открыто
        if (burgerMenu.classList.contains("active")) {
          toggleMobileMenu()
        }
      }
    })
  })

  // Бургер-меню
  const burgerMenu = document.getElementById("burgerMenu")
  const mainNav = document.getElementById("main-nav")

  function toggleMobileMenu() {
    burgerMenu.classList.toggle("active")
    burgerMenu.setAttribute("aria-expanded", burgerMenu.classList.contains("active"))
    mainNav.classList.toggle("active")
    document.body.classList.toggle("no-scroll")
  }

  burgerMenu.addEventListener("click", toggleMobileMenu)

  // Закрытие меню при клике на ссылку
  const navLinks = document.querySelectorAll(".main-nav a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (burgerMenu.classList.contains("active")) {
        toggleMobileMenu()
      }
    })
  })

  // Добавляем класс при скролле для шапки
  const header = document.getElementById("header")
  const scrollTopBtn = document.getElementById("scrollTopBtn")

  function handleScroll() {
    if (window.pageYOffset > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    // Кнопка "Наверх"
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("visible")
    } else {
      scrollTopBtn.classList.remove("visible")
    }

    // Анимация появления элементов при скролле
    checkFade()

    // Анимация статистики
    animateStats()
  }

  window.addEventListener("scroll", handleScroll)

  // Кнопка "Наверх"
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Анимация появления элементов при скролле
  const fadeElements = document.querySelectorAll(".fade-in")

  function checkFade() {
    fadeElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight - 100) {
        element.classList.add("visible")
      }
    })
  }

  window.addEventListener("load", checkFade)

  // Параллакс эффект
  const parallaxElements = document.querySelectorAll(".parallax")

  if (window.innerWidth > 768) {
    window.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      parallaxElements.forEach((element) => {
        element.style.transform = `translate(${x * 10}px, ${y * 10}px)`
      })
    })
  }

  // Фильтрация меню
  const filterBtns = document.querySelectorAll(".filter-btn")
  const menuItems = document.querySelectorAll(".menu-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Удаляем активный класс у всех кнопок
      filterBtns.forEach((btn) => btn.classList.remove("active"))
      // Добавляем активный класс текущей кнопке
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      menuItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "translateY(0)"
          }, 50)
        } else {
          item.style.opacity = "0"
          item.style.transform = "translateY(20px)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Корзина
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  const cartBtn = document.getElementById("cartBtn")
  const cartModal = document.getElementById("cartModal")
  const closeCart = document.getElementById("closeCart")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")
  const cartCount = document.getElementById("cartCount")
  const checkoutBtn = document.getElementById("checkoutBtn")
  const addToCartBtns = document.querySelectorAll(".add-to-cart")

  // Обновление счетчика корзины
  function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
    cartCount.textContent = totalItems
  }

  // Обновление отображения корзины
  function updateCartDisplay() {
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>'
      cartTotal.textContent = "0 ₸"
      checkoutBtn.disabled = true
    } else {
      cartItems.innerHTML = ""
      let total = 0

      cart.forEach((item, index) => {
        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"
        cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${item.price} ₸</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">&times;</button>
                `

        cartItems.appendChild(cartItem)
        total += item.price * item.quantity
      })

      cartTotal.textContent = `${total} ₸`
      checkoutBtn.disabled = false

      // Добавляем обработчики событий для кнопок в корзине
      setupCartControls()
    }
  }

  // Настройка обработчиков событий для кнопок в корзине
  function setupCartControls() {
    // Кнопки "+" для увеличения количества
    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        cart[index].quantity++
        saveCart()
        updateCartDisplay()
      })
    })

    // Кнопки "-" для уменьшения количества
    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        if (cart[index].quantity > 1) {
          cart[index].quantity--
        } else {
          cart.splice(index, 1)
        }
        saveCart()
        updateCartDisplay()
      })
    })

    // Кнопки удаления товара
    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        cart.splice(index, 1)
        saveCart()
        updateCartDisplay()
      })
    })
  }

  // Сохранение корзины в localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCounter()
  }

  // Очистка корзины
  function clearCart() {
    cart = []
    saveCart()
    updateCartDisplay()
  }

  // Открытие/закрытие корзины
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault()
    cartModal.classList.add("open")
  })

  closeCart.addEventListener("click", () => {
    cartModal.classList.remove("open")
  })

  // Закрытие корзины при клике вне её
  document.addEventListener("click", (e) => {
    if (
      cartModal.classList.contains("open") &&
      !cartModal.contains(e.target) &&
      e.target !== cartBtn &&
      !e.target.closest(".add-to-cart")
    ) {
      cartModal.classList.remove("open")
    }
  })

  // Добавление товара в корзину
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const name = this.getAttribute("data-name")
      const price = Number.parseInt(this.getAttribute("data-price"))

      // Проверяем, есть ли уже такой товар в корзине
      const existingItem = cart.find((item) => item.name === name)

      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        existingItem.quantity++
      } else {
        // Если товара нет, добавляем новый
        cart.push({
          name: name,
          price: price,
          quantity: 1,
        })
      }

      saveCart()
      updateCartDisplay()
      showNotification(`${name} добавлен в корзину`, "success")

      // Анимация кнопки
      this.classList.add("added")
      setTimeout(() => {
        this.classList.remove("added")
      }, 300)

      // Открываем корзину
      setTimeout(() => {
        cartModal.classList.add("open")
      }, 500)
    })
  })

  // Оформление заказа
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      // Открываем модальное окно оформления заказа
      openModal(document.getElementById("checkoutModal"))
    }
  })

  // Модальные окна
  const modals = document.querySelectorAll(".modal")
  const modalCloseButtons = document.querySelectorAll(".modal__close")
  const checkoutModal = document.getElementById("checkoutModal")
  const orderSuccessModal = document.getElementById("orderSuccessModal")
  const closeSuccessModal = document.getElementById("closeSuccessModal")

  // Функция открытия модального окна
  function openModal(modal) {
    modal.classList.add("active")
    document.body.classList.add("no-scroll")
  }

  // Функция закрытия модального окна
  function closeModal(modal) {
    modal.classList.remove("active")
    document.body.classList.remove("no-scroll")
  }

  // Закрытие модальных окон
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      closeModal(this.closest(".modal"))
    })
  })

  // Закрытие модального окна при клике вне его
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this)
      }
    })
  })

  // Форма заказа
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]')
  const deliveryAddress = document.getElementById("deliveryAddressGroup")

  deliveryRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "delivery") {
        deliveryAddress.style.display = "block"
        document.getElementById("address").setAttribute("required", "")
      } else {
        deliveryAddress.style.display = "none"
        document.getElementById("address").removeAttribute("required")
      }
    })
  })

  const orderForm = document.getElementById("orderForm")

  orderForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let isValid = true
    const nameInput = document.getElementById("name")
    const phoneInput = document.getElementById("phone")
    const emailInput = document.getElementById("email")
    const timeInput = document.getElementById("time")
    const addressInput = document.getElementById("address")
    const deliverySelected = document.querySelector('input[name="delivery"]:checked').value === "delivery"

    // Валидация имени
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Пожалуйста, введите ваше имя")
      isValid = false
    } else {
      clearError(nameInput)
    }

    // Валидация телефона
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    if (!phoneRegex.test(phoneInput.value)) {
      showError(phoneInput, "Пожалуйста, введите корректный номер телефона")
      isValid = false
    } else {
      clearError(phoneInput)
    }

    // Валидация email (необязательное поле)
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showError(emailInput, "Пожалуйста, введите корректный email")
      isValid = false
    } else {
      clearError(emailInput)
    }

    // Валидация времени
    if (timeInput.value === "") {
      showError(timeInput, "Пожалуйста, укажите время получения")
      isValid = false
    } else {
      clearError(timeInput)
    }

    // Валидация адреса (если выбрана доставка)
    if (deliverySelected && addressInput.value.trim() === "") {
      showError(addressInput, "Пожалуйста, введите адрес доставки")
      isValid = false
    } else {
      clearError(addressInput)
    }

    // Если форма валидна, отправляем данные
    if (isValid) {
      // Здесь должна быть логика отправки заказа
      closeModal(checkoutModal)
      openModal(orderSuccessModal)

      // Очищаем корзину после успешного заказа
      clearCart()
    }
  })

  // Закрытие модального окна успешного заказа
  closeSuccessModal.addEventListener("click", () => {
    closeModal(orderSuccessModal)
    orderForm.reset()
  })

  // Функция для отображения ошибки
  function showError(input, message) {
    const formGroup = input.closest(".form-group")
    let errorElement = formGroup.querySelector(".error-message")

    input.classList.add("error")

    if (!errorElement) {
      errorElement = document.createElement("div")
      errorElement.className = "error-message"
      formGroup.appendChild(errorElement)
    }

    errorElement.textContent = message
    errorElement.style.color = "#f44336"
    errorElement.style.fontSize = "0.8rem"
    errorElement.style.marginTop = "5px"
  }

  // Функция для очистки ошибки
  function clearError(input) {
    const formGroup = input.closest(".form-group")
    const errorElement = formGroup.querySelector(".error-message")

    input.classList.remove("error")

    if (errorElement) {
      errorElement.textContent = ""
    }
  }

  // Функция проверки email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Форма подписки на новости
  const newsletterForm = document.getElementById("newsletterForm")

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const emailInput = this.querySelector('input[type="email"]')

    if (!emailInput.value || !isValidEmail(emailInput.value)) {
      showNotification("Пожалуйста, введите корректный email", "error")
    } else {
      showNotification("Вы успешно подписались на новости!", "success")
      emailInput.value = ""
    }
  })

  // Форма обратной связи
  const contactForm = document.getElementById("contactForm")

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const nameInput = document.getElementById("contactName")
    const emailInput = document.getElementById("contactEmail")
    const messageInput = document.getElementById("contactMessage")

    let isValid = true

    // Валидация имени
    if (nameInput.value.trim() === "") {
      showError(nameInput, "Пожалуйста, введите ваше имя")
      isValid = false
    } else {
      clearError(nameInput)
    }

    // Валидация email
    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, "Пожалуйста, введите корректный email")
      isValid = false
    } else {
      clearError(emailInput)
    }

    // Валидация сообщения
    if (messageInput.value.trim() === "") {
      showError(messageInput, "Пожалуйста, введите ваше сообщение")
      isValid = false
    } else {
      clearError(messageInput)
    }

    if (isValid) {
      showNotification("Спасибо за сообщение! Мы ответим вам в ближайшее время.", "success")
      this.reset()
    }
  })

  // Уведомления
  function showNotification(message, type = "info") {
    const notification = document.getElementById("notification")

    // Устанавливаем иконку в зависимости от типа
    let iconClass = "fas fa-info-circle"
    notification.className = "notification"

    switch (type) {
      case "success":
        iconClass = "fas fa-check-circle"
        notification.classList.add("success")
        break
      case "error":
        iconClass = "fas fa-exclamation-circle"
        notification.classList.add("error")
        break
      case "warning":
        iconClass = "fas fa-exclamation-triangle"
        notification.classList.add("warning")
        break
    }

    notification.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`
    notification.classList.add("show")

    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }

  // Анимация статистики
  const statNumbers = document.querySelectorAll(".stat__number")
  let statsAnimated = false

  function animateStats() {
    if (statsAnimated) return

    const statsSection = document.querySelector(".stats-section")
    if (!statsSection) return

    const statsSectionTop = statsSection.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    if (statsSectionTop < windowHeight - 100) {
      statsAnimated = true

      statNumbers.forEach((number) => {
        const target = Number.parseInt(number.getAttribute("data-count"))
        const duration = 2000
        const step = target / (duration / 16)
        let current = 0

        const counter = setInterval(() => {
          current += step
          if (current >= target) {
            clearInterval(counter)
            current = target
          }
          number.textContent = Math.floor(current)
        }, 16)
      })
    }
  }

  // Галерея
  const galleryItems = document.querySelectorAll(".gallery-item")
  const galleryModal = document.getElementById("galleryModal")
  const galleryModalImage = document.getElementById("galleryModalImage")
  const galleryPrev = document.getElementById("galleryPrev")
  const galleryNext = document.getElementById("galleryNext")

  if (galleryItems.length && galleryModal && galleryModalImage) {
    let currentImageIndex = 0
    const galleryImages = Array.from(galleryItems).map((item) => ({
      src: item.querySelector("img").src,
      alt: item.querySelector("img").alt,
    }))

    // Открытие модального окна галереи
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        currentImageIndex = index
        updateGalleryModal()
        openModal(galleryModal)
      })
    })

    // Обновление изображения в модальном окне
    function updateGalleryModal() {
      galleryModalImage.src = galleryImages[currentImageIndex].src
      galleryModalImage.alt = galleryImages[currentImageIndex].alt
    }

    // Переключение на предыдущее изображение
    galleryPrev.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length
      updateGalleryModal()
    })

    // Переключение на следующее изображение
    galleryNext.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length
      updateGalleryModal()
    })

    // Навигация с клавиатуры
    document.addEventListener("keydown", (e) => {
      if (!galleryModal.classList.contains("active")) return

      if (e.key === "ArrowLeft") {
        galleryPrev.click()
      } else if (e.key === "ArrowRight") {
        galleryNext.click()
      } else if (e.key === "Escape") {
        closeModal(galleryModal)
      }
    })
  }

  // Слайдер отзывов
  const testimonialsSlider = document.getElementById("testimonialsSlider")
  const testimonialPrev = document.getElementById("testimonialPrev")
  const testimonialNext = document.getElementById("testimonialNext")
  const testimonialDots = document.getElementById("testimonialDots")

  if (testimonialsSlider && testimonialPrev && testimonialNext && testimonialDots) {
    const testimonialItems = testimonialsSlider.querySelectorAll(".testimonial-item")
    if (testimonialItems.length) {
      let currentSlide = 0
      const slideWidth = 100 // в процентах

      // Инициализация слайдера
      function initTestimonialsSlider() {
        // Создаем обертку для слайдов
        const slidesWrapper = document.createElement("div")
        slidesWrapper.className = "testimonial-slides"
        slidesWrapper.style.display = "flex"
        slidesWrapper.style.transition = "transform 0.5s ease"
        slidesWrapper.style.width = `${testimonialItems.length * 100}%`

        // Перемещаем слайды в обертку
        while (testimonialsSlider.firstChild) {
          slidesWrapper.appendChild(testimonialsSlider.firstChild)
        }

        testimonialsSlider.appendChild(slidesWrapper)

        // Создаем точки навигации
        testimonialItems.forEach((_, index) => {
          const dot = document.createElement("span")
          dot.className = "testimonial-dot"
          if (index === 0) dot.classList.add("active")

          dot.addEventListener("click", () => {
            goToSlide(index)
          })

          testimonialDots.appendChild(dot)
        })

        // Устанавливаем начальное положение
        updateSliderPosition()
      }

      // Обновление позиции слайдера
      function updateSliderPosition() {
        const slidesWrapper = testimonialsSlider.querySelector(".testimonial-slides")
        slidesWrapper.style.transform = `translateX(-${(currentSlide * slideWidth) / testimonialItems.length}%)`

        // Обновляем активную точку
        const dots = testimonialDots.querySelectorAll(".testimonial-dot")
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentSlide)
        })
      }

      // Переход к определенному слайду
      function goToSlide(index) {
        currentSlide = index
        updateSliderPosition()
      }

      // Переход к предыдущему слайду
      testimonialPrev.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + testimonialItems.length) % testimonialItems.length
        updateSliderPosition()
      })

      // Переход к следующему слайду
      testimonialNext.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % testimonialItems.length
        updateSliderPosition()
      })

      // Автоматическое переключение слайдов
      let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialItems.length
        updateSliderPosition()
      }, 5000)

      // Останавливаем автоматическое переключение при наведении
      testimonialsSlider.addEventListener("mouseenter", () => {
        clearInterval(slideInterval)
      })

      // Возобновляем автоматическое переключение при уходе курсора
      testimonialsSlider.addEventListener("mouseleave", () => {
        slideInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % testimonialItems.length
          updateSliderPosition()
        }, 5000)
      })

      // Инициализация слайдера
      initTestimonialsSlider()
    }
  }

  // Установка текущего года в футере
  document.getElementById("currentYear").textContent = new Date().getFullYear()

  // Инициализация
  handleScroll()
  updateCartCounter()
  updateCartDisplay()
})
