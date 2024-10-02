document.getElementById("myForm").addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
    };

    
    localStorage.setItem("contactData", JSON.stringify(formData));

    
    alert("Your message has been successfully sent!");

    // Submit the form to FormSubmit
    event.target.submit();
});
