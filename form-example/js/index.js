// Select the form and output div
const form = document.querySelector('#user-form');
const output = document.querySelector('#output');

console.log(form);
console.log(output);

// Listen for form submit
form.addEventListener('submit', function(Event) {
      // Prevent page reload
    event.preventDefault();

    // console.log("Form Submitted!");

    // Get input elements and their values
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const colorValue = document.querySelector('#color').value;

    // Log to console
    console.log(name);
    console.log(email);
    console.log(colorValue);
    
    // Create result elements
    output.innerHTML = '';
    const namePara = document.createElement('p');
    namePara.textContent = 'Name: ' + name;

    const colorPara = document.createElement('p');
    colorPara.textContent = 'Name: ' + colorValue;

    const emailPara = document.createElement('p');
    emailPara.textContent = 'Name: ' + email;

     // Add to output
    output.appendChild(namePara);
    output.appendChild(emailPara);
    output.appendChild(colorPara);

    //Reset form after submission
    form.reset();

});




