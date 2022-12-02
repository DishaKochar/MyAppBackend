const nodemailer= require('nodemailer')
const {google} = require ('googleapis')
const { oauth2 } = require('googleapis/build/src/apis/oauth2')
const { model } = require('mongoose')

const CLIENT_ID = '725345445689-6nsuu85ehbumc77t8nqnu80i6ufbin0a.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04mCSPVEoh4SRCgYIARAAGAQSNwF-L9Ir7_B6BfmKPg7sS8BHaVrNNwwsyTEOQCzsNPgov4ZgQweHKU8hKRqLTZYVX0qFUj87byI'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN })


async function sendMail(email){
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type:'OAuth2',
                user: 'kochardisha15@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refresh_token:REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        })

        const mailOptions ={
                from: 'DishaKochar <kochardisha15@gmail.com>',
                to: email,
                subject: 'Successful Registeration',
                text: 'You have successfully registered',
                html: `<h1>Welcome to the book shop</h1> <a href="http://localhost:3000/verification/${email}">Verification</a>`
        };
        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        return error
    }
}
exports.sender = function(email){
    sendMail(email).then(result=> console.log('Email Sent...', result))
    .catch((error)=> console.log(error.message));
    }
