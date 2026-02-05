// Select elements we need
const button = document.querySelector('#add-btn');
const container = document.querySelector('#container');

// console.log(button);
// console.log(container);

// Counter for items
let itemCount =0;

// Add event listener to button
button.addEventListener('click', function() {
    //console.log("Button has been clicked");

    // Increase count
    itemCount++;

     // Create new div element
    const newItem = document.createElement('div');

     // Add class to new element
    newItem.classList.add('item');

    // Add text content
    newItem.textContent = "Item " + itemCount;

    // Add event listener to child div
    newItem.addEventListener('click', function() {
        newItem.style.backgroundColor = "#3498db";
        newItem.style.color = 'white';
    });

     // Add to container
    container.appendChild(newItem);
});



