import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, verificationToken) => {
  const message = {
    to: ["aanytkaa@gmail.com", email],
    from: "aanytkaa@gmail.com",
    subject: "Welcome to YourContact",
    html: `To confirm you email please click on <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
    text: `To confirm you email please open the link http://localhost:3000/api/users/verify/${verificationToken}`,
  };

  await sgMail.send(message);
  console.log("Massage is sended");
  return true;
};

export default sendEmail;
