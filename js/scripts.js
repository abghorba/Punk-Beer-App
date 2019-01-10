$(document).ready(function(){
    const $panelIds = [$('#panel1'), $('#panel2'), $('#panel3'), $('#panel4'),
        $('#panel5'), $('#panel6'), $('#panel7'), $('#panel8'), $('#panel9')];

    generateRandom($panelIds);

    // Display beers with ABV < 5.0%
    $('#weak-beers').on('click', function(){
        setTimeout(getBeerInfo("weak", $panelIds), 200);
    });

    // Display beers with ABV 5.0% - 8.0%
    $('#medium-beers').on('click', function() {
        setTimeout(getBeerInfo("medium", $panelIds), 200);
    });

    // Display beers with ABV > 8.0%
    $('#strong-beers').on('click', function(){
        setTimeout(getBeerInfo("strong", $panelIds), 200);
    });

    // Display random beers
    $('#random').on('click', function(){
        setTimeout(generateRandom($panelIds), 200);
    });

    $('.panel-body').mouseenter(function(){
        $(this).find('.hover-text').show();
    }).mouseleave(function(){
        $(this).find('.hover-text').hide();
    });
});



/*
Clears all panels and popovers.
*/
function clearPanels() {
    $('.panel-heading').empty();
    $('.panel-body').empty();
    $('.panel-footer').empty();
}



/*
Makes an AJAX request to the Punk Beer API with filter 'random' 9 times.
The 'random' filter only sends back information on one beer.
This way lets the user randomly see 9 out of the 200+ beers stored in the API.
*/
function generateRandom($panelIds) {
    clearPanels();

    // Make AJAX requests
    $.each($panelIds, function(i, $panelId){
        $.ajax({
            type: 'GET',
            url: "https://api.punkapi.com/v2/beers/random",
            dataType: 'json',
            success: function(beers){
                $.each(beers, function(j, beer){
                    $panelId.children('.panel-heading').append(beer.name);
                    $panelId.children('.panel-body').append(`<img src=${beer.image_url} class="beer-img" alt="Image"> <div class="hover-text">${beer.description}</div>`);
                    $panelId.children('.panel-footer').append(`ABV: ${beer.abv}%. ${beer.tagline}`);
                });
            }
        });
    });
}



/*
Makes an AJAX request depending on what strength of beer selected.
Randomly chooses a beer from the API response and shows user that beer
and the next eight in the API response.
@param beer_strength    Must be either "weak", "medium", or "strong"
*/
function getBeerInfo(beer_strength, $panelIds) {
    // Ensure program doesn't reach out of bounds in API response
    const LENGTH_BUFFER = 10;

    clearPanels();

    // Determine the filters for the API endpoint.
    var query_url = '';
    if (beer_strength == "weak"){
        query_url = '?abv_lt=5&';
    }
    else if (beer_strength == "medium"){
        query_url = '?abv_gt=5&abv_lt=8&';
    }
    else if(beer_strength == "strong"){
        query_url = '?abv_gt=8&';
    }

    // Make AJAX request
    $.ajax({
        type: 'GET',
        url: `https://api.punkapi.com/v2/beers${query_url}per_page=80`,
        dataType: 'json',
        success: function(beers){
            // May not get 80 results from the API response.
            lengthOfBeers = beers.length;
            var index = getRandInt(lengthOfBeers - LENGTH_BUFFER);
            $.each($panelIds, function(i, $panelId){
                // Want to randomly choose from the API response.
                $panelId.children('.panel-heading').append(beers[index].name);
                $panelId.children('.panel-body').append(`<img src=${beers[index].image_url} class="beer-img" alt="Image"> <p class="hover-text">${beers[index].description}</p>`);
                $panelId.children('.panel-footer').append(`ABV: ${beers[index].abv}%. ${beers[index].tagline}`);
                index++;
            });
        }
    });
}



/*
Function to get a random integer from the range 0 to max.
*/
function getRandInt(max){
    return Math.floor(Math.random() * max);
}