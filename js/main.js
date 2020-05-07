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


let login = localStorage.getItem('login');

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

function createCardRestaurant() {

  const card = `
    <a class="card card-restaurant">
    <img src="img/gusi-lebedi/preview.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Гуси Лебеди</h3>
        <span class="card-tag tag">75 мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 1 000 ₽</div>
        <div class="category">Русская кухня</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  </a>
  <!-- /.card -->
  `;
  cardsRestaurants.insertAdjacentHTML('afterbegin', card);
}

function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Везувий</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
          «Халапенье», соус «Тобаско», томаты.
        </div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">545 ₽</strong>
      </div>
    </div>
    `);
  cardsMenu.insertAdjacentElement('beforeend', card);
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
      createCardGood();
      createCardGood();
      createCardGood();
    }
  }
}

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function() {
  containerPromo.classList.remove('hide');
  menu.classList.add('hide');
  restaurants.classList.remove('hide');
});
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);


checkAuth();

createCardRestaurant();