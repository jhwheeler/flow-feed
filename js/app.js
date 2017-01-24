var GitHub_Base_URL = 'https://api.github.com/search/repositories';
var StackOverFlow_Base_URL = 'https://api.stackexchange.com/2.2/search';

function getGitHub(searchTerm, callback) {
    var query = {
        q: searchTerm,
    }
    $.getJSON(GitHub_Base_URL, query, callback);
}

function getStack(searchTerm, callback) {
    var query = {
        intitle: searchTerm,
        site: "stackoverflow"
    }
    $.ajax({
            type: 'GET',
            url: StackOverFlow_Base_URL,
            async: false,
            data: query,
            jsonpCallback: 'JSON_CALLBACK',
            contentType: "application/json",
            dataType: 'jsonp',
            success: callback
    });
    /*$.ajax({
            type: "GET",
            url: StackOverFlow_Base_URL,
            client_id: 8837,
            key: "NBo4EBEDNt7nncSaVaIybg((",
            processData: false,
            data: query,
            dataType: "json",
            success: callback
    });*/
}

function displayGitData(data) {
            console.log(data.items);
}

function displayStackData(data) {
            console.log(data.items);
}

function watchSubmit() {
    $('.js-search-form').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        getGitHub(query, displayGitData);
        getStack(query, displayStackData);
    });
}

$(function() {
    watchSubmit();
});
