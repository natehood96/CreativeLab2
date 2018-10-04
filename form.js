$(document).ready(function () {
     $("#submitButton").click(function (e) {
        var value; //= $("#cityField").val();
        var squrUrl = "https://api.pokemontcg.io/v1/cards/bw8-24";
        var charUrl = "https://api.pokemontcg.io/v1/cards/g1-rc3";
         var bulbUrl = "https://api.pokemontcg.io/v1/cards/dp3-77"
        console.log(myurl);
        $.ajax({
            url: myurl,
            dataType: "json",
            success: function (parsed_json) {
                console.log(parsed_json);
                var type = parsed_json.card.supertype;
                var pokeUrl = parsed_json.card.imageUrl;
                console.log(type);
                $('#squr-image').attr('src', pokeUrl);
            }
        });
        console.log(value);
        e.preventDefault();
        $("#displayCity").text(value);
    });
});


/*
$("#stackButton").click(function(e){
    var value = $("#stack_id").val();
      var myurl= "  https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=";
    myurl += value; //javascript
    myurl += "&site=stackoverflow"
    console.log(myurl);
    $.ajax({
      url : myurl,
      dataType : "json",
          success : function(data) {
             var everything;
              everything = "<ul>";
              $.each(data.items, function(i,item) {
                everything += "<li> "+ item.link;
                everything += "<li> "+ item.title;
                everything += "<li> "+ item.view_count;
              });
              everything += "</ul>";
              $("#stack").html(everything);
            }
    });
  });
  */