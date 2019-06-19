'use strict';

//---------------------------------------------Global Variables------------------------------------------------
var arrayOfImageObjects = [];
var imageSelector = document.getElementById('imageSelector');
var leftImageTag = document.getElementById ('imageLeft');
var middleImageTag = document.getElementById ('imageMiddle');
var rightImageTag = document.getElementById ('imageRight');
var resultsList = document.getElementById ('results');
var totalClicks = 0;
var leftProductImage = null;
var middleProductImage = null;
var rightProductImage = null;


//-----------------------------------------------Constructor---------------------------------------------------
var ImageObject = function (name, path) {
  this.name = name;
  this.path = path;
  this.timesShown = 0;
  this.timesClicked = 0;
  arrayOfImageObjects.push(this);
};

//-----------------------------------------------Image Objects------------------------------------------------

new ImageObject ('Bag', '/imgs/bag.jpg');
new ImageObject ('Banana', '/imgs/banana.jpg');
new ImageObject ('Bathroom', '/imgs/bathroom.jpg');
new ImageObject ('Boots', '/imgs/boots.jpg');
new ImageObject ('Breakfast', '/imgs/breakfast.jpg');
new ImageObject ('Bubblegum', '/imgs/bubblegum.jpg');
new ImageObject ('Chair', '/imgs/chair.jpg');
new ImageObject ('Cthulhu', '/imgs/cthulhu.jpg');
new ImageObject ('Dog-duck', '/imgs/dog-duck.jpg');
new ImageObject ('Dragon', '/imgs/dragon.jpg');
new ImageObject ('Pen', '/imgs/pen.jpg');
new ImageObject ('Pet Sweep', '/imgs/pet-sweep.jpg');
new ImageObject ('Scissors', '/imgs/scissors.jpg');
new ImageObject ('Shark', '/imgs/shark.jpg');
new ImageObject ('Sweep', '/imgs/sweep.png');
new ImageObject ('Tauntaun', '/imgs/tauntaun.jpg');
new ImageObject ('Unicorn', '/imgs/unicorn.jpg');
new ImageObject ('USB', '/imgs/usb.gif');
new ImageObject ('Water Can', '/imgs/water-can.jpg');
new ImageObject ('Wine Glass', '/imgs/wine-glass.jpg');

//-------------------------------------------Randomly Display Products------------------------------------------
var previousProducts = [];
var displayNewProducts = function () {

  do {
    var leftProduct = Math.floor(Math.random() * arrayOfImageObjects.length);

    do {
      var middleProduct = Math.floor(Math.random() * arrayOfImageObjects.length);
    } while (middleProduct === leftProduct);

    do {
      var rightProduct = Math.floor(Math.random() * arrayOfImageObjects.length);
    } while (rightProduct === middleProduct || rightProduct === leftProduct);

    leftProductImage = arrayOfImageObjects[leftProduct];
    middleProductImage = arrayOfImageObjects[middleProduct];
    rightProductImage = arrayOfImageObjects[rightProduct];
  } while (compare(leftProduct, middleProduct, rightProduct) === false);
  previousProducts = [];
  renderNewProducts (leftProduct, middleProduct, rightProduct);
  previousProducts.push(leftProduct, middleProduct, rightProduct);
};

//Render new images on the screen
var renderNewProducts = function (leftProduct, middleProduct, rightProduct) {
  leftImageTag.src = arrayOfImageObjects[leftProduct].path;
  middleImageTag.src = arrayOfImageObjects[middleProduct].path;
  rightImageTag.src = arrayOfImageObjects[rightProduct].path;
};

//-------------------------------------------Actions on Event ('click')-----------------------------------------

var handleUserSelection = function (event) {
  if (totalClicks < 25) {
    console.log('number of clicks: ', totalClicks);
    var id = event.target.id;

    if (id === 'imageLeft' || id === 'imageMiddle' || id === 'imageRight') {
      if (id === 'imageLeft') {
        leftProductImage.timesClicked++;
      }
      if (id === 'imageMiddle') {
        middleProductImage.timesClicked++;
      }
      if (id === 'imageRight') {
        rightProductImage.timesClicked++;
      }

      leftProductImage.timesShown++;
      middleProductImage.timesShown++;
      rightProductImage.timesShown++;
      totalClicks++;
      var totalClicksStorageString = JSON.stringify(totalClicks);
      localStorage.setItem ('Total Clicks', totalClicksStorageString);

      displayNewProducts();
    }
  }
  if (totalClicks === 25) {
    renderResults();
    displayChart();

    //Save results to local storage
    addToLocalStorage('Array of Image Objects', arrayOfImageObjects);


    imageSelector.removeEventListener('click', handleUserSelection);
  }
};

//-------------------------------------------Compare to Last selection---------------------------------------

var compare = function (leftProduct, middleProduct, rightProduct) {

  for (var j = 0; j < previousProducts.length; j++) {
    if (leftProduct === previousProducts[j]) {
      return false;
    } if (middleProduct === previousProducts[j]) {
      return false;
    } if (rightProduct === previousProducts[j]) {
      return false;
    }
  } return true;
};

//-------------------------------------------Add Data to Local Storage-----------------------------------------

function addToLocalStorage (keyName, item) {
  var itemConvertedToString = JSON.stringify(item);
  localStorage.setItem (keyName, itemConvertedToString);
}

//-------------------------------------------Render List of Results---------------------------------------------

var renderResults = function () {
  var ulEl = document.createElement('ul');
  for (var i = 0; i < arrayOfImageObjects.length; i++) {
    var productName = arrayOfImageObjects[i].name;
    var productClicks = arrayOfImageObjects[i].timesClicked;
    var productShows = arrayOfImageObjects[i].timesShown;
    var productPercent = productClicks / productShows;
    productPercent = Math.round(productPercent * 100);

    var liEl =document.createElement('li');
    liEl.textContent = productName + ': selected ' + productPercent + '% of ' + productShows + ' times shown';
    ulEl.appendChild(liEl);
  }
  resultsList.appendChild(ulEl);
};

//---------------------------------------------Chart of Results-------------------------------------------------
function displayChart () {
  var productNames = [];
  var productPercent = [];
  var productColors = [];
  function chartData () {
    for (var k = 0; k < arrayOfImageObjects.length; k++) {
      productNames.push(arrayOfImageObjects[k].name);
      productPercent.push(Math.round((arrayOfImageObjects[k].timesClicked / arrayOfImageObjects[k].timesShown) * 100));
      productColors.push(random_rgba(.5));
    }
  }

  //base script for this function was found at: https://stackoverflow.com/questions/23095637/how-do-you-get-random-rgb-in-javascript
  console.log(productColors);
  function random_rgba(a) {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + a + ')';
  }

  chartData();
  var ctx = document.getElementById('resultsChartCanvas').getContext('2d');
  var resultsChartCanvas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [{
        label: '# of Votes',
        data: productPercent,
        backgroundColor: productColors,
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

//--------------------------------------Initial Page Rendering Items--------------------------------------------


imageSelector.addEventListener('click', handleUserSelection);

displayNewProducts();
