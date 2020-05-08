'use strict';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const info = document.querySelector('.info');

let login = localStorage.getItem('login');

const getData = async function(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу: ${url}, статус ошибки: ${response.status}`);
  }

  return await response.json();
} 

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth () {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle("is-open");
}

function notAuthorized() {

  function logIn(event) {
    event.preventDefault();

    if (!loginInput.value.trim()) {
      loginInput.style.borderColor = 'red';
    } else {
      login = loginInput.value;
      localStorage.setItem('login', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    }
  }

  console.log('isNotAuthorized');
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function authorized() {

  function logOut() {
    login = null;
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    localStorage.removeItem('login');
    checkAuth();
  }

  console.log('isAuthrozed');
  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurant(restaurant) {
  const { image, kitchen, name, price, stars, products, time_of_delivery } = restaurant;
  const card = `
    <a class="card card-restaurant" data-name="${name}" data-price="${price}" data-stars="${stars}" data-kitchen="${kitchen}" data-products="${products}">
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${time_of_delivery} мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  </a>
  <!-- /.card -->
  `;
  cardsRestaurants.insertAdjacentHTML('afterbegin', card);
}

function createCardGood(goods) {
  const {id, name, description, price, image} = goods;
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
    </div>
    `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function createRestaurantInfo(data) {
  const { name, kitchen, price, stars } = data;
  info.insertAdjacentHTML('beforeend', `
    <div class="section-heading">
    <h2 class="section-title restaurant-title">${name}</h2>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  </div>
  `);
  menu.insertAdjacentElement('beforebegin', info);
}

function openGoods(event) {

  if (!login) {
    toggleModalAuth();
  } else {
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      cardsMenu.textContent = '';
      info.textContent = '';

      createRestaurantInfo(restaurant.dataset);
      getData(`./db/${restaurant.dataset.products}`).then(function(data) {
        data.forEach(createCardGood);
      });
    }
  }
}

function init() {
  getData('./db/partners.json').then(function(data) {
    data.forEach(createCardRestaurant)
  });
  
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function() {
    containerPromo.classList.remove('hide');
    menu.classList.add('hide');
    restaurants.classList.remove('hide');
    info.textContent = '';
  });
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  
  
  checkAuth();
  
  new Swiper ('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 5000,
    }
  })
}

init();