const nodemailer = require('nodemailer');
const {htmlToText} = require('html-to-text');
const ejs = require('ejs');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Prato <${process.env.EMAIL_FROM}>`;
        this.week = user.week;
    }

    newTransport(){
        //in production, send emails using nodemailer and sendgrid as host
          if(process.env.NODE_ENV === 'production') {
              return nodemailer.createTransport({
                  service: 'SendGrid',
                  auth: {
                      user: process.env.SENDGRID_USERNAME,
                      pass: process.env.SENDGRID_PASSWORD
                  }
              });
        } 
    
        //in development, sending emails using nodemailer and mailtrap as host
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    //Send the email

    async send(template, subject) {

        //render html based on template
        let html;
        ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`,{
            firstName: this.firstName,
            url: this.url,
            week: this.week,
            subject
        },(err,str)=>{
            if(err){
                console.log(err);
            } else {
                html = str;
                // console.log(html);
            }
        });


    //define mail options
    const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
    };

    //create transport and send email
    await this.newTransport().sendMail(mailOptions);

    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Prato!');
    }
    async sendWeek() {
        await this.send('email_week', 'Prato - Your Week!');
    }

}
