const nodemailer = require("nodemailer");
const { mail, website } = require("../../configs");
const ejs = require("ejs");

/**
 * Mail sender - sends emails using 'nodemailer'
 *
 * @param {String} to - receiver email
 * @param {String} subject - email subject
 * @param {String} text
 * @param {String} html
 *
 * @returns {Promise}
 */

//MM-18
module.exports = async (to, subject, template, data = {}) => {
  const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    auth: {
      user: mail.noReply,
      pass: mail.password,
    },
  });
  data.website = website;
  const html = await ejs.renderFile(template, data);

  const mailOptions = { from: `BrandsMenu <${mail.noReply}>`, to, subject, html };

  return transporter.sendMail(mailOptions);
};
