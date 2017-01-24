var GitHub_Base_URL = 'https://api.github.com/search/repositories';

function getDataFromAPI(searchTerm, callback) {
    var query = {
        q: searchTerm,
    }
    $.getJSON(GitHub_Base_URL, query, callback);
}

function displaySearchData(data) {
            console.log(data.items);
}

function watchSubmit() {
    $('.js-search-form').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        console.log(query)
        getDataFromAPI(query, displaySearchData);
    });
}

$(function() {
    watchSubmit();
});
