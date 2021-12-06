$(document).ready(function() {
  const $searchInput = $('#input');
  const $searchBtn = $('#submitBtn');
  const $primaryName = $('#primary-name');
  const $primaryImg = $('#polaroid');
  const $showEl = $('#show');
  const $gameEl = $('#game');
  const $filmEl = $('#film');
  const $favEl = $('#favorites');
  const $setImg = $('<img>');
  const $anchorImg = $('<a>');
  const $plusButton = $('#p-button')
  const $minusButton = $('#m-button');
  const $modalEl = $('#modal-ter');
  const $yesBtnEl = $('#modal-yes-button');
  const $noBtnEl = $('#modal-no-button');
  let charList = [];
  let charDetails = {};
  let characters = JSON.parse(localStorage.getItem('characters')) || [];

  retrieveChar(1).then(dataLength => {
    for (let i = 2; i <= dataLength; i++) {
      retrieveChar(i);
    };
  });

  $(function () {
    $searchInput.autocomplete({
      minLength: 3,
      source: charList
    });
  });

  displayFav()

  function retrieveChar(index) {
    return $.ajax({
      method: 'GET',
      url: 'https://api.disneyapi.dev/characters?page=' + index
    }).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        let imgURL = '';

        if (response.data[i].imageUrl !== undefined) {
          imgURL = response.data[i].imageUrl.slice(0, response.data[i].imageUrl.length - 34);
        };

        charList.push(response.data[i].name);
        charDetails[response.data[i].name.toLowerCase()] = {
          name: response.data[i].name,
          id: response.data[i]._id,
          films: response.data[i].films,
          img: imgURL,
          source: response.data[i].sourceUrl,
          shows: response.data[i].tvShows,
          games: response.data[i].videoGames,
          url: response.data[i].url
        };
      };

      return response.totalPages;
    }).catch(error => {
      console.log(error);
    });
  };

  // Function to show modal
  function showModal() {
    $modalEl.addClass('is-active');
  };

  // Function to hide modal
  function hideModal() {
    $modalEl.removeClass('is-active');
  };

  function displayFav() {
    $favEl.children().remove();
    for (let i = 0; i < characters.length; i++) {
      let $favBtn = $('<button>');

      $favBtn.text(characters[i].name)
        .addClass('button is-info is-outlined is-fullwidth custom-shadow fav-item');

      $favEl.append($favBtn);
    };
  };

  function removeDup(char) {
    let uniqueLs = [];
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].name !== char) {
            uniqueLs.push(characters[i]);
        };
    };

    localStorage.removeItem('characters');
    localStorage.setItem('characters', JSON.stringify(uniqueLs));
    characters = JSON.parse(localStorage.getItem('characters'));
  };

  $searchBtn.on('click', event => {
    event.preventDefault();

    $showEl.children().remove();
    $gameEl.children().remove();
    $filmEl.children().remove();

    let selectChar = $searchInput.val().toLowerCase();

    $primaryName.text(charDetails[selectChar].name);

    for (let i = 0; i < charDetails[selectChar].shows.length; i++) {
      let $showDet = $('<li>');

      $showDet.text(charDetails[selectChar].shows[i]);
      $showEl.append($showDet);
    };

    for (let i = 0; i < charDetails[selectChar].games.length; i++) {
      let $gameDet = $('<li>');

      $gameDet.text(charDetails[selectChar].games[i]);
      $gameEl.append($gameDet);
    };

    for (let i = 0; i < charDetails[selectChar].films.length; i++) {
      let $filmDet = $('<button>');

      $filmDet.text(charDetails[selectChar].films[i])
        .addClass('button is-large is-fullwidth is-inverted mb-1');
      $filmEl.append($filmDet);
    };

    $setImg.attr({
      src: charDetails[selectChar].img,
      alt: 'Image of Character'
    });

    $anchorImg.append($setImg)
      .attr({
        href: charDetails[selectChar].source,
        target: '_blank',
        title: '(Click for additional content)'
      });

    $primaryImg.append($anchorImg);
  });

  // Event listener to enable minus button on favorite character selected
  $(document).on('click', '.fav-item', function() {
    $minusButton.prop('disabled', false);

    let removeVal = this

    // Exit modal when no button selected
    $noBtnEl.on('click', hideModal);

    // Event listener to remove favorite from local storage
    $yesBtnEl.on('click', function() {
      hideModal();

    // Remove from HTML
    removeVal.remove();

    // Remove from Local Storage

    });
  });

  // Event listener to displays modal upon minus button click
  $minusButton.on('click', showModal);

  // Disable minus button when click anywhere besides favorite items
  $('body').click(event => {
    let $favItem = $('.fav-item');
    if (!$(event.target).closest($favItem).length) {
      $minusButton.prop('disabled', true);
    };
  });

  $plusButton.on('click', function() {
    let details = {
      name: $primaryName.text()
    };

    removeDup(details.name);

    characters.unshift(details);

    localStorage.setItem('characters', JSON.stringify(characters));

    displayFav();
  });

    // $.ajax({
    //   method: 'GET',
    //   url: 'https://imdb-api.com/en/API/SearchMovie/k_bicys5i4/Tangled'
    // }).then(function(response) {
    //   console.log(response);
    // }).catch(function(error) {
    //   console.log(error);
    // });

  //localStorage

  // const storageInput = document.getElementById('input');
  // const text = document.getElementById('input');
  // const button = document.getElementById('submitBtn');
  // const storedInput = localStorage.getItem('disney')

  // if (storageInput) {
  //   text.textContent = storedInput
  // }

  // storageInput.addEventListener('input', letter => {
  //   text.content.data = letter.target.value
  // })

  // const saveTOlocalStorage = () => {
  //   localStorage.setItem('disney', text.content)
  // }

  // button.addEventListener('click', saveTOlocalStorage)


});
