$.ajax({
    method: 'GET',
    url: 'https://api.disneyapi.dev/characters/308'
  }).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  });

  $.ajax({
    method: 'GET',
    url: 'https://imdb-api.com/en/API/SearchMovie/k_bicys5i4/Tangled'
  }).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  });
