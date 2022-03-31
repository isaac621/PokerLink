import nodemailer from 'nodemailer'


const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})


function sendConfirmationEmail(name, email, confirmationCode){
    
    transport.sendMail({
        from: process.env.EMAIL_USE,
        to: email,
        subject: "PokerLink: Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>This is your confirmation code <br>
        <h2>${confirmationCode} <h2><br>Please confirm your email by clicking on the following link</p>
        <a href=${process.env.CLIENT_HOST}/verify/> Click here</a>
        </div>`,}).catch(err=>console.log(err))
}

function sendForgotPasswordEmail(name, email, forgotCode){
    
    transport.sendMail({
        from: process.env.EMAIL_USE,
        to: email,
        subject: "PokerLink: ResetPassword",
        html: `<h1>Reset Password</h1>
        <h2>Hello ${name}</h2>
        <p>This is your reset password code <br>
        <h2>${forgotCode} <h2><br>Please reset your password by clicking on the following link</p>
        <a href=${process.env.CLIENT_HOST}/reset/> Click here</a>
        </div>`,}).catch(err=>console.log(err))
}

export{sendConfirmationEmail, sendForgotPasswordEmail}