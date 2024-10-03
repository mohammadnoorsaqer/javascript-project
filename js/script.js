document.getElementById("myForm").addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get form input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create an object to store the data
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
    };

    // Store the form data in localStorage
    localStorage.setItem("contactData", JSON.stringify(formData));

    // Display a message to the user
    alert("Your message has been sent successfully!");

    // Submit the form to FormSubmit
    event.target.submit();
});
