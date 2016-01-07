var URL = "http://52.10.21.162/contact-form"

$(function() {

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            // Prevent spam click and default submit behaviour
            $("#btnSubmit").attr("disabled", true);
            event.preventDefault();
            
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var ccopy = $("input#ccopy").is(':checked') ? "checked" : "";
            var message = $("textarea#message").val();
            var recaptchares = $("#g-recaptcha-response").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: URL,
                type: "POST",
                data: {
                    name: name,
                    email: email,
                    text: message,
                    carboncopy: ccopy,
                    grecaptcharesponse: recaptchares
                },
                cache: false,
                success: function() {
                    grecaptcha.reset();
                    // Enable button & show success message
                    $("#btnSubmit").attr("disabled", false);
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Your message has been sent. </strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    grecaptcha.reset();
                    var mailServerErrorMessage = ", it seems that my mail server is not responding. Please try again later!";
                    if(jqXHR.responseText == 'captchaFAILED'){
                        mailServerErrorMessage = ", you FAILED the <strong>captcha<strong> challenge! did you check <strong>I'm not a robot</strong>?";
                    }
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + mailServerErrorMessage);
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

// When clicking on Full hide fail/success boxes
$('#name').focus(function() {
    $('#success').html('');
});
