const GitHub_Base_URL = 'https://api.github.com/search/repositories';
const StackOverFlow_Base_URL = 'https://api.stackexchange.com/2.2/search';

const helperFunctions = {
  searchSuggestedTopic: function() {
    const thisTopic = $(this).text();
    $('.js-query').val(thisTopic);
    $('.js-search-form').submit();
  },
  formatGitDate: function(date) {
    const creationDate = new Date(date).toDateString();
    return creationDate;
  },
  formatStackDate: function(date) {
    const creationDate = new Date(date*1000).toDateString();
    return creationDate;
  },
}

const dataGetters = {
  getGitHub: function(searchTerm, callback) {
    const query = {
      q: searchTerm,
      sort: 'updated'
    }
    $.getJSON(GitHub_Base_URL, query, callback);
  },

  getStack: function(searchTerm, callback) {
    const query = {
      intitle: searchTerm,
      site: 'stackoverflow',
      sort: 'creation',
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

const dataDisplayers = {
  displayGitData: function(data) {
    let sourceElement = '';
    let updatedSince = '';
    data.items.forEach(function(element) {
      const formattedDate = helperFunctions.formatGitDate(element.pushed_at);
      if (element.description === null) {
        element.description = 'No description...';
      }
      sourceElement += `
        <div class="source-content-piece">
          <a href="${element.html_url}" target="_blank">
            <h4>${element.full_name}</h4>
          </a>
          <p class="repo-description">${element.description}</p>
          <p class="repo-language"> ${element.language} </p>
          <div class="git-star"></div>
          <p class="repo-stars"> ${element.stargazers_count} </p>
          <div class="git-fork"></div>
          <p class="repo-forks"> ${element.forks_count} </p>
          <p class="repo-updated">Updated ${formattedDate}</p> \n
        </div>
      `;
    });
    $('.js-github-source-content').html(sourceElement);
  },
  displayStackData: function(data) {
    let questionTags = '';
    let sourceElement = '';
    data.items.forEach(function(element) {
      for (let i = 0; i < element.tags.length; i++) {
        questionTags += `
          <div class="element-tag">
            <a href="https://stackoverflow.com/questions/tagged/${element.tags[i]}">
              ${element.tags[i]}
            </a>
          </div>
        `;
      }
      const elementBody = element.body.substring(0, 400);
      const formattedDate = helperFunctions.formatStackDate(element.creation_date);
      sourceElement += `
        <div class="source-content-piece">
          <div class="so-content-piece-header">
            <div class="question">
              <a href="${element.link}" target="_blank">
              <h4>${element.title}</h4>
              </a>
            </div>
            <div class="stat-container">
              <div class="vote-box">
                  <p class="score">${element.score}</p>
                  <p class="votes">votes</p>
              </div>
              <div class="answer-box">
                <p class="answer-count">${element.answer_count}</p>
                <p class="answers">answers</p>
              </div>
            </div>
          </div>
          <div class="question-content">
            <div class="question-body">${elementBody}...</div>
            <div class="question-tags">${questionTags}</div>
            <div class="ask-date">
              <p>asked ${formattedDate} by <a href="${element.owner.link} " target="_blank"> ${element.owner.display_name} </a></p>
            </div>
          </div>
        </div>
      `;
    });
    $('.js-stack-overflow-source-content').html(sourceElement);
  }
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    const query = $(this).find('.js-query').val();
    dataGetters.getGitHub(query, dataDisplayers.displayGitData);
    dataGetters.getStack(query, dataDisplayers.displayStackData);
  });
}

$(function() {
  $('.js-suggested-topic').on('click', helperFunctions.searchSuggestedTopic);
  watchSubmit();
});
