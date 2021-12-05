$(document).ready(function() {
  const $searchInput = $('#input');
  const $searchBtn = $('#submitBtn');
  const $primaryName = $('#primary-name');
  const $primaryImg = $('#primary-img');
  const $showEl = $('#show');
  const $gameEl = $('#game');
  const $infoEl = $('#info');
  const $setImg = $('<img>');
  const $plusButton = $('#p-button')
  const $minusButton = $('#m-button');
  const $modalEl = $('#modal-ter');
  const $yesBtnEl = $('#modal-yes-button');
  const $noBtnEl = $('#modal-no-button');
  let charList = [];
  let charDetails = {};

  retrieveChar(1).then(dataLength => {
    for (let i = 2; i <= dataLength; i++) {
      retrieveChar(i);
    };
  });

  $(function() {
    $searchInput.autocomplete({
      minLength: 3,
      source: charList
    });
  });

  function retrieveChar(index) {
    return $.ajax({
      method: 'GET',
      url: 'https://api.disneyapi.dev/characters?page=' + index
    }).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        let imgURL = '';

        if (response.data[i].imageUrl !== undefined) {
          imgURL = response.data[i].imageUrl.slice(0, response.data[i].imageUrl.length-34);
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

  $searchBtn.on('click', event => {
    event.preventDefault();

    $showEl.children().remove();
    $gameEl.children().remove();

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
    }

    $setImg.attr({
        src: charDetails[selectChar].img,
        alt: 'Image of Character'
      });

    $infoEl.text("Additional Info")
      .attr('href', charDetails[selectChar].source);

    $primaryImg.append($setImg);
  });

  // Event listener to enable minus button on favorite character selected
  $(document).on('click', '.fav-item', function() {
    $minusButton.prop('disabled', false);
  });

  // Function to show modal
  function showModal() {
      $modalEl.addClass('is-active');
  };

  // Function to hide modal
  function hideModal() {
    $modalEl.removeClass('is-active');
  };

  // Event listener to displays modal upon minus button click
  $minusButton.on('click', showModal);

  // Event listener to remove favorite from local storage
  $yesBtnEl.on('click', function() {
    hideModal();
  });

  // Exit modal when no button selected
  $noBtnEl.on('click', hideModal);

    // $.ajax({
    //   method: 'GET',
    //   url: 'https://imdb-api.com/en/API/SearchMovie/k_bicys5i4/Tangled'
    // }).then(function(response) {
    //   console.log(response);
    // }).catch(function(error) {
    //   console.log(error);
    // });

});
