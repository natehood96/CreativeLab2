var myPokemon = [
    { "name": "", "pokeUrl": "" },
];



$(document).ready(function () {
    $("#pokeInput").change(function () {
        var pokemonName = $('#pokeInput :selected').text();
        console.log(pokemonName);
            var myUrl = "";
             if (pokemonName == 'Squirtle'){
                 myUrl = "https://api.pokemontcg.io/v1/cards/bw8-24";
             }
             if (pokemonName == 'Charmander'){
                 myUrl = "https://api.pokemontcg.io/v1/cards/g1-rc3";
             }
             if (pokemonName == 'Bulbasaur') {
                 var myUrl = "https://api.pokemontcg.io/v1/cards/dp3-77"
             }
            console.log(myUrl);
            $.ajax({
                url: myUrl,
                dataType: "json",
                success: function (parsed_json) {
                    console.log(parsed_json);
                    var type = parsed_json.card.supertype;
                    var pokeUrl = parsed_json.card.imageUrl;
                    console.log(type);
                    $('#squr-image').attr('src', pokeUrl);
                    $('#squr-image').show();
                    //e.preventDefault();
                }
            });
        $("#submitButton").click(function (e) {
            e.preventDefault();
            window.location.href ="game.html";
           // return false;
        });
    });
});