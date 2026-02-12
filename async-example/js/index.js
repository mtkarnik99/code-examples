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
function fetchUser(userId){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users[userId];
            if(user){
                // User found - fulfill the promise with user data
                resolve(user);
            }
            else{
                // User not found - reject the promise with error message
                reject('User not found!');
            }
        }, 2000);  // 2-second delay simulates network request
    });
}

/**
 * Fetches posts for a specific user (simulates API call with 2-second delay)
 * @param {number} userId - The ID of the user whose posts to fetch
 * @returns {Promise} Promise that resolves with array of posts or rejects if not found
 */
function fetchUserPosts(userId){
    return new Promise((resolve, reject) => {
         setTimeout(() => {
            const posts = userPosts[userId];
            if(posts){
                // Posts found - fulfill promise with posts array
                resolve(posts);
            }
            else{
                // No posts found - reject promise
                reject('No posts found for this user');
            }
         }, 2000);  // 2-second delay
    });
}

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