var GitHub_Base_URL = 'https://api.github.com/search/repositories';
var StackOverFlow_Base_URL = 'https://api.stackexchange.com/2.2/search';
var Twitter_Base_URL = 'https://api.twitter.com/1.1/search/tweets.json';

function getTwitter(searchTerm, callback) {
    var query = {
        q: searchTerm
    }
    $.ajax({
        type: 'GET',
        url: Twitter_Base_URL,
        async: false,
        dataType: 'jsonp',
        data: query,
        contentType: 'application/json',
        owner_ID: '4096223488',
        access_token: '4096223488-cVwLF9SCwqQFdRAc3TuWPzk5zCfkVn9mNjpV9VC',
        access_token_secret: 'X4mbCDyeMXh3itnD99cy29mQPdUoUFptly443Ov15f8ak',
        success: callback
    })
}

function getGitHub(searchTerm, callback) {
    var query = {
        q: searchTerm
    }
    $.getJSON(GitHub_Base_URL, query, callback);
}

function getStack(searchTerm, callback) {
    var query = {
        intitle: searchTerm,
        site: 'stackoverflow'
    }
    $.ajax({
            type: 'GET',
            url: StackOverFlow_Base_URL,
            async: false,
            data: query,
            jsonpCallback: 'JSON_CALLBACK',
            contentType: 'application/json',
            dataType: 'jsonp',
            success: callback
    });
}

function displayTwitterData(data) {
    console.dir(data.items);
}

function displayGitData(data) {
    console.dir(data.items);
}

function displayStackData(data) {
    console.dir(data.items);
}

function watchSubmit() {
    $('.js-search-form').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        getTwitter(query, displayTwitterData);
        getGitHub(query, displayGitData);
        getStack(query, displayStackData);
    });
}

$(function() {
    watchSubmit();
});
