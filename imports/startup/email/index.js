process.env.MAIL_URL = 'smtps://elisavetar638@gmail.com:ELISAVET1311@smtp.gmail.com:465';

Meteor.methods({
  "email.send"(to,subject, text){
    Email.send({
    from: "from@mailinator.com",
    to: to,
    subject: subject,
    text: text
    });
  }
});
