// ==========================================
// MOCK DATABASE
// ==========================================
// Simulates a database of users
// In real apps, this data would come from a server/database
const users = {
  1: { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  2: { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  3: { id: 3, name: 'Carol Williams', email: 'carol@example.com' }
};

// Simulates posts for each user
// Each user ID maps to an array of their posts
const userPosts = {
  1: ['Learning JavaScript', 'Understanding Promises', 'Async/Await Guide'],
  2: ['CSS Tips', 'Responsive Design'],
  3: ['Node.js Basics', 'Express Tutorial', 'MongoDB Guide', 'REST APIs']
};

// ==========================================
// PROMISE FUNCTIONS
// ==========================================

/**
 * Fetches a user by ID (simulates API call with 2-second delay)
 * @param {number} userId - The ID of the user to fetch
 * @returns {Promise} Promise that resolves with user object or rejects if not found
 */
// function fetchUser(userId){
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const user = users[userId];
//             if(user){
//                 // User found - fulfill the promise with user data
//                 resolve(user);
//             }
//             else{
//                 // User not found - reject the promise with error message
//                 reject('User not found!');
//             }
//         }, 2000);  // 2-second delay simulates network request
//     });
// }

//Real APi version
async function fetchUser(userId){
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

    if(!response.ok){
        throw new Error(`User not found ! Message : ${response.status}`);
    }

    const user = await response.json();

    return user; 
}



/**
 * Fetches posts for a specific user (simulates API call with 2-second delay)
 * @param {number} userId - The ID of the user whose posts to fetch
 * @returns {Promise} Promise that resolves with array of posts or rejects if not found
 */
// function fetchUserPosts(userId){
//     return new Promise((resolve, reject) => {
//          setTimeout(() => {
//             const posts = userPosts[userId];
//             if(posts){
//                 // Posts found - fulfill promise with posts array
//                 resolve(posts);
//             }
//             else{
//                 // No posts found - reject promise
//                 reject('No posts found for this user');
//             }
//          }, 2000);  // 2-second delay
//     });
// }

// Real API version
async function fetchUserPosts(userId){
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

    if(!response.ok){
        throw new Error(`User not found ! Message : ${response.status}`);
    }

    const posts = await response.json();

    return posts; 
}

// Select elements
const button = document.querySelector('#fetch-btn');
const input = document.querySelector('#user-id');
const output = document.querySelector('#output');

button.addEventListener('click', async function(params) {
    const userId = input.value;
    button.disabled = true;

    try{
    // Step 1: Fetch user data
    const user = await fetchUser(userId);
    output.innerHTML = `<div class="step"><strong>Step 1:</strong> Fetched user: ${user.name}</div>`;

    // Step 2: Fetch posts for that user
    const posts = await fetchUserPosts(user.id);
    output.innerHTML += `<div class="step"><strong>Step 2:</strong> Fetched ${posts.length} posts</div>`;

    // Step 3: Display complete profile
    output.innerHTML += `
      <div class="user-profile">
        <h2>${user.name}</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <h3>Recent Posts:</h3>
        <ul>${posts.slice(0, 5).map(post => `<li><strong>${post.title}</strong></li>`).join('')}</ul>
      </div>`;
    }
    catch(error){
         throw new Error(`Users not found ! Message : ${response.status}`);
    }
    finally{
        button.disabled = false;
    }
    
});

/**
 * Counts the number of posts (simulates processing with 2-second delay)
 * @param {Array} posts - Array of posts to count
 * @returns {Promise} Promise that resolves with post count
 */
function fetchPostCount(posts){
    return new Promise((resolve, reject) => {
         setTimeout(() => {
                // Count the posts and resolve
                resolve(posts.length);
         }, 2000);  // 2-second delay
    });
}

// ==========================================
// EXAMPLE 1: PROMISE CHAINING WITH .then()
// ==========================================

// Demonstrates sequential async operations using .then() chaining
// Total time: 6 seconds (2 + 2 + 2)

fetchUser(1)  // Step 1: Fetch user (2 seconds)
    .then(user => {
        console.log(`User found: ${user.name}`);
        // Return the next promise to continue the chain
        return fetchUserPosts(user.id);
    })
    .then(posts => {  // Step 2: Fetch posts (2 seconds)
        console.log(`Found ${posts.length} posts`);
        // Return the next promise to continue the chain
        return fetchPostCount(posts);
    })
    .then(count => {  // Step 3: Count posts (2 seconds)
        console.log(`Total posts: ${count}`);
    })
    .catch(error => {
        // Catches errors from ANY step in the chain
        console.error(`Error: `, error);
    })
    .finally(() => {
        // Always runs whether success or failure
        console.log('Process Complete');
    });

// ==========================================
// EXAMPLE 2: ASYNC/AWAIT SYNTAX (SINGLE USER)
// ==========================================

/**
 * Fetches and displays data for a single user using async/await
 * This is the modern, more readable way to handle promises
 * @param {number} userId - The ID of the user to fetch
 */
async function showUserData(userId){
    try{
        // Step 1: Fetch user (pauses here for 2 seconds)
        const user = await fetchUser(userId);
        console.log(`Welcome ${user.name}`);

        // Step 2: Fetch posts (pauses here for 2 seconds)
        const posts = await fetchUserPosts(user.id);
        console.log(`You have ${posts.length} posts`);

        // Step 3: Count posts (pauses here for 2 seconds)
        const count = await fetchPostCount(posts);
        console.log(`Post count: ${count}`);
        
        // Total time: 6 seconds (sequential: 2 + 2 + 2)
    }
    catch(error){
        // Catches any error from any await statement
        console.error('Failure due to:', error);
    }
    finally {
        // Always runs - good for cleanup operations
        console.log('Done');
    }
}

// Call the async function
showUserData(1);

// ==========================================
// EXAMPLE 3: FETCHING MULTIPLE USERS IN PARALLEL
// ==========================================

/**
 * Fetches data for multiple users simultaneously using Promise.all()
 * This is MUCH faster than fetching one at a time
 * @param {Array} userIds - Array of user IDs to fetch
 */
async function showMultipleUsers(userIds){
    try{
        // Create an array of promises - one for each user
        // All promises start executing immediately (in parallel)
        const userPromises = userIds.map(async (id) => {
            // For each user ID, fetch user, posts, and count
            const user = await fetchUser(id);
            const posts = await fetchUserPosts(user.id);
            const count = await fetchPostCount(posts);
            
            // Return an object with user's name and post count
            return { name: user.name, postCount: count };
        });

        // Promise.all() waits for ALL promises to complete
        // Returns array of results in the same order as input
        // Total time: ~6 seconds (all run in parallel, not 18 seconds sequential!)
        const results = await Promise.all(userPromises);
        
        console.log('Users and their post counts:', results);
        // Output: [
        //   { name: 'Alice Johnson', postCount: 3 },
        //   { name: 'Bob Smith', postCount: 2 },
        //   { name: 'Carol Williams', postCount: 4 }
        // ]
    }
    catch(error){
        // If ANY promise fails, Promise.all() rejects immediately
        console.error('Error fetching multiple users:', error);
    }
    finally {
        console.log('All fetches complete');
    }
}

// Fetch data for all three users at once
showMultipleUsers([1, 2, 3]);


// ==========================================
// OPTIONAL CHALLENGES FOR PRACTICE
// ==========================================

/*
CHALLENGE 1: ADD INPUT VALIDATION (Easy - 5-10 minutes)
----------------------------------------------------
Add validation to the button click handler to ensure userId is between 1-10.

TODO:
1. Check if userId is empty, less than 1, or greater than 10
2. If invalid, display an error message and return early
3. This prevents unnecessary API calls

HINT: Add this check right after const userId = input.value;
HINT: Use output.innerHTML = '<p class="error">...</p>' to show error
HINT: Use return; to exit the function early


CHALLENGE 2: ADD SEARCH POSTS FEATURE (Medium - 15-20 minutes)
----------------------------------------------------
Create a search function that fetches all posts and filters by a search term.

TODO:
1. Add HTML elements for search (input and button)
2. Create async function searchPosts(searchTerm)
   - Fetch all posts: 'https://jsonplaceholder.typicode.com/posts'
   - Parse the JSON response
   - Filter posts where title or body includes searchTerm (case-insensitive)
   - Return filtered results
3. Add event listener to search button
   - Validate search term is not empty
   - Show loading state
   - Call searchPosts and display results
   - Handle errors

HINTS:
- Use .filter() to filter the posts array
- Use .toLowerCase() on both searchTerm and post fields for case-insensitive
- Use .includes() to check if searchTerm exists
- Display first 10 results with .slice(0, 10)


CHALLENGE 3: CREATE A NEW POST (Medium - 15-20 minutes)
----------------------------------------------------
Add functionality to create a new post using POST request.

TODO:
1. Add HTML elements (title input, body textarea, create button)
2. Create async function createPost(postData)
   - Use fetch with POST method
   - Set headers: { 'Content-Type': 'application/json' }
   - Set body: JSON.stringify(postData)
   - Check response.ok
   - Parse and return JSON
3. Add event listener to create button
   - Get title and body from inputs
   - Validate inputs are not empty
   - Create post data object: { title, body, userId }
   - Call createPost function
   - Display success message with created post details

HINTS:
- POST URL: 'https://jsonplaceholder.typicode.com/posts'
- postData should have: title, body, userId (as number)
- JSONPlaceholder doesn't actually save - it's a fake API
- Response will include a fake ID (101)


CHALLENGE 4: ADD LOADING SPINNER (Medium - 15 minutes)
----------------------------------------------------
Replace text loading message with an animated CSS spinner.

TODO:
1. Add CSS for spinner:
   - Create circle with border and border-radius: 50%
   - Make top border different color
   - Add rotation animation with @keyframes
   - Center with margin: 0 auto
2. Update JavaScript:
   - Change output.innerHTML from text to <div class="spinner"></div>

HINTS:
- border: 4px solid #f3f3f3;
- border-top: 4px solid #3498db;
- animation: spin 1s linear infinite;
- @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }


CHALLENGE 5: ADD RANDOM USER BUTTON (Easy - 10 minutes)
----------------------------------------------------
Add a button that fetches a random user ID between 1-10.

TODO:
1. Add HTML button: <button id="random-btn">Get Random User</button>
2. Select the button in JavaScript
3. Add click event listener that:
   - Generates random number between 1-10
   - Sets input.value to that number
   - Triggers the fetch button click

HINTS:
- Random number: Math.floor(Math.random() * 10) + 1
- Set input: input.value = randomUserId
- Trigger click: button.click()


BONUS CHALLENGES:
----------------------------------------------------
- Fetch user's albums: 'https://jsonplaceholder.typicode.com/albums?userId=${userId}'
- Fetch user's todos: 'https://jsonplaceholder.typicode.com/todos?userId=${userId}'
- Fetch comments for a post: 'https://jsonplaceholder.typicode.com/comments?postId=${postId}'
- Add "Load More Posts" button to show more than 5 posts
- Display completed vs incomplete todos count
- Show photos from an album: 'https://jsonplaceholder.typicode.com/photos?albumId=${albumId}'

All JSONPlaceholder endpoints: https://jsonplaceholder.typicode.com/
*/

