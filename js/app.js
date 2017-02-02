var GitHub_Base_URL = 'https://api.github.com/search/repositories';
var StackOverFlow_Base_URL = 'https://api.stackexchange.com/2.2/search';

var helperFunctions = {
    timeSince: function(date) {
        if (typeof date !== 'object') {
            date = new Date(date);
        }

        var seconds = Math.floor((new Date() - date) / 1000);
        var intervalType;

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            intervalType = 'year';
        } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalType = 'month';
            } else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalType = 'day';
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalType = 'hour';
                    } else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalType = 'minute';
                        } else {
                            interval = seconds;
                            intervalType = 'second';
                        }
                    }
                }
            }
        }

        if (interval > 1 || interval === 0) {
            intervalType += 's';
        }

        return interval + ' ' + intervalType;
    },
    formatDate: function(date) {
        var creationDate = new Date(date*1000).toDateString();
        //if < 24 hours ago, return # of hours
        //if > 24 hours ago, return MM/DD/YY, e.g. "Feb 1 '17"
        return creationDate;
    },
    getExcerpt: function() {
        var textToHide = $('.question-body').text().substring(400);
        console.log($('.question-body').text());
        var visibleText = $('.question-body').text().substring(1, 400);
        $('.question-body').html(visibleText + ('<span class="text-to-hide">' + textToHide + '</span>'));
        $('.text-to-hide').hide();
    }
}

var dataGetters = {
    getGitHub: function(searchTerm, callback) {
        var query = {
            q: searchTerm
        }
        $.getJSON(GitHub_Base_URL, query, callback);
    },

    getStack: function(searchTerm, callback) {
        var query = {
            intitle: searchTerm,
            site: 'stackoverflow',
            filter: 'withbody'
        }
        $.ajax({
                type: 'GET',
                url: StackOverFlow_Base_URL,
                async: false,
                data: query,
                contentType: 'application/json',
                dataType: 'jsonp',
                success: callback
        });
    }
}

var dataDisplayers = {
    displayGitData: function(data) {
        var sourceElement = '';
        var updatedSince = '';
        data.items.forEach(function(element) {
           updatedSince = timeSince(element.updated_at);
           if (element.description === null) {
               element.description = 'No description...';
           }
           sourceElement +=
               '<div class="source-content-piece">' +
                   '<a href="' + element.html_url + '" target="_blank">' +
                       '<h4>' + element.full_name + '</h4>' +
                   '</a>' +
                   '<p class="repo-description">' + element.description + ' </p>' +
                   '<div class="repo-language-circle"></div>' +
                   '<p class="repo-language"> ' + element.language + ' </p>'  +
                   '<div class="git-star"></div>' +
                   '<p class="repo-stars"> ' + element.stargazers_count + ' </p>' +
                   '<div class="git-fork"></div>' +
                   '<p class="repo-forks"> ' + element.forks_count + ' </p>' +
                   '<p class="repo-updated">Updated ' + updatedSince + ' ago</p> \n' +
               '</div>';
        });
        $('.js-github-source-content').html(sourceElement);
    },
    displayStackData: function(data) {
        var questionTags = '';
        var sourceElement = '';
        data.items.forEach(function(element) {
            for (var i = 0; i < element.tags.length; i++) {
                questionTags +=
                    '<div class="element-tag">' +
                    '<a href="https://stackoverflow.com/questions/tagged/' +
                    element.tags[i] + '">' +
                    element.tags[i] +
                    '</a>' +
                    '</div>';
            }
            var formattedDate = formatDate(element.creation_date);
            sourceElement +=
                '<div class="source-content-piece">' +
                    '<div class="so-content-piece-header">' +
                        '<div class="stat-container">' +
                            '<div class="vote-box">' +
                                '<p class="score">' + element.score + '</p>' +
                                '<p class="votes">votes</p>' +
                            '</div>' +
                            '<div class="answer-box">' +
                                '<p class="answer-count">' + element.answer_count + '</p>' +
                                '<p class="answers">answers</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="question">' +
                            '<a href="' + element.link + '" target="_blank">' +
                            '<h4>' + element.title + '</h4></a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="question-content">' +
                        '<p class="question-body">' + element.body + '</p>' +
                        '<div class="question-tags">' + questionTags + '</div>' +
                        '<div class="ask-date">' +
                            '<p>asked ' + formattedDate + ' by ' +
                            '<a href="' + element.owner.link +
                                '" target="_blank">' + element.owner.display_name +
                            '</a></p>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        });
        $('.js-stack-overflow-source-content').html(sourceElement);
    }
}

function watchSubmit() {
    $('.js-search-form').submit(function(e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        //getTwitter(query, displayTwitterData);
        getGitHub(query, displayGitData);
        getStack(query, displayStackData);
        //getExcerpt();
    });
}

$(function() {
    watchSubmit();
});
