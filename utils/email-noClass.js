//non-class based email option

const nodemailer = require('nodemailer');
const {htmlToText} = require('html-to-text');
const ejs = require('ejs');

const sendEmail = async options => {

    try{
        
            let transporter;
          //in production, send emails using nodemailer and sendgrid as host
            if(process.env.NODE_ENV === 'production') {
                transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USERNAME,
                        pass: process.env.SENDGRID_PASSWORD
                    }
                });
            }else {

                //in development, sending emails using nodemailer and mailtrap as host
                  transporter = nodemailer.createTransport({
                      host: process.env.EMAIL_HOST,
                      port: process.env.EMAIL_PORT,
                      auth: {
                          user: process.env.EMAIL_USERNAME,
                          pass: process.env.EMAIL_PASSWORD
                      }
                  });
            }
        
            
            // console.log(__dirname+'/../views/email/welcome.ejs');
        
            let html;
            console.log(options.type);
            if (options.type == 'welcome') {
                ejs.renderFile(`${__dirname}/../views/email/welcome.ejs`,{data:options},(err,str)=>{
                    if(err){
                        console.log(err);
                    } else {
                        // console.log(str);
                        html = str;
                    }
                });

            } else {
                ejs.renderFile(`${__dirname}/../views/email/email_week.ejs`,{data:options},(err,str)=>{
                    if(err){
                        console.log(err);
                    } else {
                        // console.log(str);
                        html = str;
                    }
                });

            }

            const mailOptions = {
                from: `Prato <${process.env.EMAIL_FROM}>`,
                to: options.email,
                subject: options.subject,
                html,
                text: htmlToText(html),
                // text: options.message
            };
        
            await transporter.sendMail(mailOptions);

    } catch(err){
        console.log(err);
    }

}

module.exports = sendEmail;