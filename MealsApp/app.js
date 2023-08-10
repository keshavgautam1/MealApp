// Get DOM elements
const searchBar = document.getElementById('search-input'); // Search input element
const mealsDiv = document.getElementById('meals-container'); // Container for displaying meals
const randomButton = document.getElementById('random-button'); // Button for displaying random image
const myFavoriteMeals = document.getElementById('favorite-meals-button'); // Button for displaying favorite meals

let favouriteArray = []; // Array to store favorite meal IDs
let URL; // URL for API requests

// Check if favouriteArray exists in localStorage, otherwise initialize it
if (!localStorage.getItem("favouriteArray")) {
  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
} else {
  favouriteArray = JSON.parse(localStorage.getItem("favouriteArray"));
}

// Function to fetch and display more details about a meal
async function moreDetails() {
  let id = this.id;
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();

  mealsDiv.innerHTML = '';

  let meals = data.meals[0];

  const div = document.createElement('div');
  div.classList.add('details-card');
  div.innerHTML = `
    <h3>${meals.strMeal}</h3>
    <img src="${meals.strMealThumb}" alt="">
    <p>${meals.strInstructions}</p>
    <h5>Cuisine Type: ${meals.strArea}</h5>
    <a href="${meals.strYoutube}"><button type="button" class='border-circle more-details' id='${meals.idMeal}'>Watch Video</button></a>`;

  mealsDiv.append(div);
}

// Function to toggle favorites
function toggleFavorites(event) {
  event.preventDefault();
  let index = favouriteArray.indexOf(this.id);
  if (index == -1) {
    favouriteArray.push(this.id);
    this.classList.add('clicked');
  } else {
    favouriteArray.splice(index, 1);
    this.classList.remove('clicked');
  }

  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
}

// Function to fetch and create meals based on the provided URL
async function createMeals(URL) {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    mealsDiv.innerHTML = '';
    for (let meals of data.meals) {
      const div = document.createElement('div');
      div.classList.add('meal-card');
      div.innerHTML = `
        <img src="${meals.strMealThumb}" alt="">
        <h4>${meals.strMeal}</h4>
        <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
        ${
          favouriteArray.includes(meals.idMeal) ? `<a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>` : `<a href="" class='favourite' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
        }`;

      mealsDiv.append(div);
    }

    var favoriteButton = document.querySelectorAll('a');
    for (let button of favoriteButton) {
      button.addEventListener('click', toggleFavorites);
    }

    var moreDetailsbutton = document.querySelectorAll('.more-details');
    for (let button of moreDetailsbutton) {
      button.addEventListener('click', moreDetails);
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to display search results based on the input value
function displaySearchResults() {
  let keyword = searchBar.value;
  URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
  createMeals(URL);
}

// Function to display a random meal image
function displayRandomImage() {
  URL = `https://www.themealdb.com/api/json/v1/1/random.php`;
  createMeals(URL);
}

// Function to display favorite meals
async function displayFavoriteMeals() {
  mealsDiv.innerHTML = '';

  for (let meal of favouriteArray) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    const data = await response.json();

    let meals = data.meals[0];

    const div = document.createElement('div');
    div.classList.add('meal-card');
    div.innerHTML = `
      <img src="${meals.strMealThumb}" alt="">
      <h4>${meals.strMeal}</h4>
      <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
      <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

    mealsDiv.append(div);

    var favoriteButton = document.querySelectorAll('a');
    for (let button of favoriteButton) {
      button.addEventListener('click', toggleFavorites);
    }

    var moreDetailsbutton = document.querySelectorAll('.more-details');
    for (let button of moreDetailsbutton) {
      button.addEventListener('click', moreDetails);
    }
  }
}

// Event listeners
searchBar.addEventListener('input', displaySearchResults); // Search bar input event
randomButton.addEventListener('click', displayRandomImage); // Random image button click event
myFavoriteMeals.addEventListener('click', displayFavoriteMeals); // Favorite meals button click event



//  Function to Clear Search Results
function clearSearchResults() {
  // Check if the search bar has a value (i.e., a search has been performed)
  if (searchBar.value) {
    mealsDiv.innerHTML = '';
  }
}

// Function to Display Instructions Only
function displayInstructions() {
  mealsDiv.innerHTML = `
    <div class='instructions'>
      <h3>Instructions</h3>
      <p>This is a Meals App that allows you to search for different meals and view their details. You can also mark your favorite meals.</p>
      <ul>
      <li>Search for any meal by typing the name of the meal in the search box and press the search icon.</li>
      <li>Add your favorite meal to the favorite section by clicking on the heart icon.</li>
      <li>Clear search results by clicking on the "Clear Search Results" button.</li>
      <li>View your favorite meals by clicking on the "My Favorite Meals" button.</li>
    </ul>
    </div>`;
}

// Event listeners for Clear Search Results and Instructions buttons
document.getElementById('clear-button').addEventListener('click', clearSearchResults);
document.getElementById('instructions-button').addEventListener('click', displayInstructions);
