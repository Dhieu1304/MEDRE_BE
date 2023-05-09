window.onload = function(){ 
    var checkbox = document.getElementById("show_password");
    checkbox.onclick = function(){
        const pwd = document.getElementById("new_password");
        const cfpwd = document.getElementById("confirm_password");
        if (pwd.type === "password") {
            pwd.type = "text";
        } else {
            pwd.type = "password";
        }
        if (cfpwd.type === "password") {
            cfpwd.type = "text";
        } else {
            cfpwd.type = "password";
        }
    }
    var url = window.location.href;
    var string = url.split('/');
    prtc = window.location.protocol;
    host = window.location.host;
    token = string[string.length - 1];
};


$(document).ready(function() {
    jQuery.validator.addMethod('valid_password', function (value) {
        var regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).*$/m;
        return value.trim().match(regex);
      });

    $('#reset_password_form').validate({
        rules: {
            "new_password": {
                required: true,
                minlength: 8,
                valid_password: true,
            },
            "confirm_password": {
                required: true,
                equalTo: "#new_password",
            },
        },
        messages: {
            "new_password": {
                required: 'New password is required.',
                minlength: 'Password must be at least 8 characters.',
                valid_password: "Password must contain at least 1 letter and 1 number.",
            },
            "confirm_password": {
                required: 'Confirm password is required.',
                equalTo: "Password does not match.",
            },
        }
    });

    $('#reset_password_form').on('submit', function(e) {
        e.preventDefault();

        var new_password = $('#new_password').val();
        var submit_url = `${prtc}//${host}/auth/reset-password/${token}`;
        $.ajax({
            type: 'post',
            url:submit_url,
            data: {
                'new_password': new_password,
            },
            datatype: "json",
        }).done(function (data) {
            console.log(data);
            $('#message').text(data.message);
        });
        
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    })
});