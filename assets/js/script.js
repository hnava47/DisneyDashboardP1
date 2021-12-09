$(document).ready(function() {
  const $searchInput = $('#input');
  const $searchBtn = $('#submitBtn');
  const $primaryName = $('#primary-name');
  const $primaryImg = $('#polaroid');
  const $showEl = $('#show');
  const $gameEl = $('#game');
  const $filmEl = $('#film');
  const $favEl = $('#favorites');
  const $errorEl = $('#error');
  const $filmRef = $('#film-ref');
  const $nameRef = $('#name-ref');
  const $trailerEl = $('#trailer');
  const $fixedEl = $('#fixed');
  const $delBtn = $('#delBtn');
  const $warnEl = $('#warn');
  const $warnBtn = $('#warnBtn');
  const $errorDel = $('.delete');
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

  function removeChar(char) {
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

  function clearPage() {
    $primaryName.text('');
    $primaryImg.children().remove();
    $showEl.children().remove();
    $gameEl.children().remove();
    $filmEl.children().remove();
  };

  function generateDash(selectChar) {
    if (charDetails[selectChar]) {
      $plusButton.prop('disabled', false);

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
          .addClass('button is-large is-fullwidth is-inverted mb-1 filmFav');
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

      $filmRef.text('Films');
      $nameRef.text('Back to Top')

      $primaryImg.append($anchorImg);
    } else {
      $plusButton.prop('disabled', true);

      $searchInput.css({
        'outline-style': 'solid',
        'outline-color': 'red'
      });
      $errorEl.show();
    };
  };

  $searchBtn.on('click', event => {
    event.preventDefault();

    clearPage();

    $searchInput.css("outline-style", "none");
    $errorEl.hide();

    let searchChar = $searchInput.val().toLowerCase();

    generateDash(searchChar);
  });

  $errorDel.on('click', function() {
    $searchInput.css('outline-style', 'none');
    $errorEl.hide();
  })

  // Event listener to enable minus button on favorite character selected
  $(document).on('click', '.fav-item', function() {
    $minusButton.prop('disabled', false);

    let favChar = $(this);

    if (favChar.hasClass('selected')) {
      favChar.removeClass('selected');
    } else {
      favChar.addClass('selected');
    };

    if ($('.selected').length) {
      $minusButton.prop('disabled', false);
    } else {
      $minusButton.prop('disabled', true);
    };

    generateDash(favChar.text().toLowerCase());
  });

  $plusButton.on('click', function() {
    let details = {
      name: $primaryName.text()
    };

    removeChar(details.name);

    characters.unshift(details);

    localStorage.setItem('characters', JSON.stringify(characters));

    displayFav();
  });

  // Event listener to displays modal upon minus button click
  $minusButton.on('click', showModal);

  // Exit modal when no button selected
  $noBtnEl.on('click', hideModal);

  // Event listener to remove favorite from local storage
  $yesBtnEl.on('click', function() {
    hideModal();

    let $selectedFav = $('.selected');

    for (let i = 0; i < $selectedFav.length; i++) {
      removeChar($selectedFav[i].textContent);
      $selectedFav[i].remove();
    };
  });

  $(document).on('click', '.filmFav', function() {
    let apiKey = 'k_bicys5i4'
    let filmName = $(this).text();

    $fixedEl.hide();
    $trailerEl.attr('src', '');
    $warnEl.hide();

    $.ajax({
      method: 'GET',
      url: 'https://imdb-api.com/en/API/SearchMovie/' + apiKey + '/' + filmName
    }).then(response => {
      let filmId = response.results[0].id;

      $.ajax({
        method: 'GET',
        url: 'https://imdb-api.com/en/API/Trailer/' + apiKey + '/' + filmId
      }).then(response => {
        if (response.linkEmbed) {
          $trailerEl.attr('src', response.linkEmbed + '?autoplay=false&width=640');

          $fixedEl.show();
        } else {

        };
      }).catch(error => {
        console.log(error);
      });

    }).catch(error => {
      console.log(error);
    });
  });

  $delBtn.on('click', function() {
    $fixedEl.hide();
    $trailerEl.attr('src', '');
  });

});
