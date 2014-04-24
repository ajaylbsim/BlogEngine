


$(document).ready(function() {

    $('#signup').hide();

    console.log("-----------------------------------------")
    $('#close').click(function()
    {
        $('#login_module').hide();
    })

$('#signin ').click(function()
{
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    $("#registerHere").validate({
        rules: {
            user_name: "required",
            user_email: {required: true, email: true,messages:"please   "},
            user_password: {required: true, minlength: 6},
            cpwd: {required: true, equalTo: "#pwd"},
            gender: "required"
        },

        messages: {
            user_name: "Enter your first and last name",
            user_email: {
                required: "Enter your email address",
                email: "Enter valid email address"},
            user_password: {
                required: "Enter your password",
                minlength: "Password must be minimum 6 characters"},
            cpwd: {
                required: "Enter confirm password",
                equalTo: "Password and Confirm Password must match"},
            gender: "Select Gender"
        },

        errorClass: "help-inline",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.control-group').addClass('error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.control-group').removeClass('error');
            $(element).parents('.control-group').addClass('success');
        }
    })

});



    $('#SIGNUP').click(function()
    {
        console.log(">>>>>>>>>>>>>>>>>>>SIGNUP>>>>>>>>>>>>>>>>>>>>>>>>>");
        $("#registerSIGNUP").validate({
            rules: {
                user_name: "required",
                user_email: {required: true, email: true,messages:"please   "},
                user_password: {required: true, minlength: 6},
                cpwd: {required: true, equalTo: "#pwd"},
                gender: "required"
            },

            messages: {
                user_name: "Enter your first and last name",
                user_email: {
                    required: "Enter your email address",
                    email: "Enter valid email address"},
                user_password: {
                    required: "Enter your password",
                    minlength: "Password must be minimum 6 characters"},
                cpwd: {
                    required: "Enter confirm password",
                    equalTo: "Password and Confirm Password must match"},
                gender: "Select"
            },

            errorClass: "help-inline",
            errorElement: "span",
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.control-group').addClass('error');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.control-group').removeClass('error');
                $(element).parents('.control-group').addClass('success');
            }
        })

    });


});


