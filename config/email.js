var nodemailer = require('nodemailer');

module.exports.sendEmail = function( email, token) {
 
    var email = email;
    var token = token;
 
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'betamuseason16@gmail.com', // Your email id
            pass: 'Majo0126*' // Your password
        }
    });
 
    var mailOptions = {
        from: 'betamuseason16@gmail.com',
        to: email,
        subject: 'Reset Password Link - http://mu.leaders.com.co',
        html: '<p>You requested for reset password, kindly use this <a href="http://mu.leaders.com.co/update-password?code=' + token + '">link</a> to reset your password</p>'
 
    };
 
    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(1)
        } else {
            console.log(0)
        }
    });
};

