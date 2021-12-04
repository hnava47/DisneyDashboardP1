$(document).ready(function () {
  const $searchInput = $('#input');
  const $searchBtn = $('#submitBtn');
  let charList = [];
  let charDetails = {};

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

  function retrieveChar(index) {
    return $.ajax({
      method: 'GET',
      url: 'https://api.disneyapi.dev/characters?page=' + index
    }).then(response => {
      for (let i = 0; i < response.data.length; i++) {
        charList.push(response.data[i].name);
        charDetails[response.data[i].name] = {
          id: response.data[i]._id,
          films: response.data[i].films,
          img: response.data[i].imageUrl,
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

    let selectChar = $searchInput.val();

    console.log(charDetails[selectChar]);
  });


  // local storage 

  let name = $searchInput.val();

  window.localStorage.setItem('user', JSON.stringify(name));



  // $.ajax({
  //   method: 'GET',
  //   url: 'https://imdb-api.com/en/API/SearchMovie/k_bicys5i4/Tangled'
  // }).then(function(response) {
  //   console.log(response);
  // }).catch(function(error) {
  //   console.log(error);
  // });

});
