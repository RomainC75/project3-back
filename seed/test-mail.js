const nodemailer = require('nodemailer')


let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'spongeb0b.98475@gmail.com',
      pass: 'nnyiezbkwhqryuvn'
    }
  });

  transporter.sendMail({
    from: 'sponge.bob@mail.ee',
    to: 'rom.chenard@gmail.com', 
    subject: 'Awesome', 
    text: 'Awesome Message',
    html: '<b>Awesome Message</b> <a href="www.google.com">Click on the link below :</a>'
  })
  .then(info => console.log('-->ENVOYE !!'))
  .catch(error => console.log('-->ERRORRRRRRR ',error))