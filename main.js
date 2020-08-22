/**
 * Makes AJAX call to reddit api with subreddit name, returning
 * parsed JSON response object to user
 * @param subredditName - subreddit to make api request for
 * @return promise containing response data
 */
function getSubredditPosts(subredditName) {
  return $.ajax({
    type: "GET",
    url: `https://www.reddit.com/r/${subredditName}.json`
  });
}

/**
 * Given the JSON response from the Reddit subreddit
 * api, parse out the title, score, and author and 
 * display to user
 * @param results - results returned from reddit api
 */
function displayResults(results) {

  // Create a fragment to store our HTML we generate
  const fragment = document.createDocumentFragment();

  // Iterate over results
  // Note the { data } syntax is called object destructuring
  // See here for more info:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  results.data.children.forEach(({ data }) => {

    // Create a div for the individual post
    const div = document.createElement("div");
    
    // Create elements to hold the info we want to display
    const postTitle = document.createElement("a");
    const postAuthor = document.createElement("p");
    const postScore = document.createElement("p");

    // Add info from reddit data to the elements
    postTitle.textContent = `Title: ${data.title}`;
    postTitle.href = data.url;
    postTitle.target = "_blank";
    postScore.textContent = `Score: ${data.score}`;
    postAuthor.textContent = `Author: ${data.author}`;

    // Add individual elements to div
    div.append(postTitle);
    div.append(postAuthor);
    div.append(postScore);

    // Add the div to the outer fragment
    fragment.append(div);
  });

  // Add fragment to results div in HTML
  document.querySelector("#results").appendChild(fragment);
}

/**
 * Clears everything out of results div and errors div
 */
function clearResults() {
  triggerError(false);
  document.querySelector("#results").innerHTML = "";
}

/**
 * Trigger the 'loading' div to indicate to user
 * page is loading
 * @param show - whether to show/hide loading from user
 */
function triggerLoading(show=true) {
  document.querySelector(".loader").hidden = !show;
}

/**
 * Trigger the 'error' div to indicate to user
 * there was an error loading results
 *
 * (Note this was optional and was not mentioned in the
 * assignment description)
 * 
 * @param show - whether or not to show error message
 */
function triggerError(show=true) {
  document.querySelector("#error").hidden = !show;
}

/**
 * Checks user input to make sure it's not empty
 * @return false if empty, true otherwise
 */
function checkInput() {
  return _getInputNode().value != "";
}

/**
 * Gets user input for requested subreddit
 * @return string containing desired subreddit
 */
function getInput() {
  return _getInputNode().value;
}

/**
 * Gets user input node from DOM that contains the
 * desired subreddit
 * @return Node
 */
function _getInputNode() {
  return document.querySelector("#subredditInput");
}

/**
 * Given that a user submits the form:
 * 1. Trigger the loading icon
 * 2. Call out to reddit api to get data from user provided subreddit
 * 3. Display results to user, or display error message in the case of an error
 * 
 * @param event - event object from submit triggered event
 */
function handleSubmit(event) {

  // Prevent page refresh
  event.preventDefault();

  // If user accidentally submits empty input,
  // don't do anything
  if (!checkInput()) return;

  // Clear results/error divs
  clearResults();

  // Trigger the loading animation
  triggerLoading();

  // Try to get subreddit data
  getSubredditPosts(getInput())

    // Success case
    .then(res => {
      // Turn off loading animation 
      triggerLoading(false);

      // Display results
      displayResults(res);
    })

    // Error case
    .catch(err => {

      // Log error
      console.error(err);

      // Turn off loading animation
      triggerLoading(false);

      // Trigger error message
      triggerError();
    });
}

// Add the event listener to the form
document.querySelector("#subredditInputForm").addEventListener("submit", handleSubmit);
