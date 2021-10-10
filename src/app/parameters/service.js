const { mail, emailsTemplate } = require("../../../configs");
const { mailSender, Exception, errors } = require("../../utils");

class Parameters {
  constructor(data) {}

  static async getEnums() {
    const result = require("../../database/models/embedded/enums");

    return result;
  }

  static async getErrors(code) {
    let result = Object.keys(errors).map((val) => {
      if (typeof errors[val] === "function") return errors[val]("someValue");
      return errors[val];
    });
    if (code) result = result.filter((val) => val.code.startsWith(code));
    return result;
  }

  static async partners(data) {
    await mailSender(mail.support, "Partnership request", emailsTemplate.partnerMail, {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      note: data.note,
    });
  }
}

module.exports = Parameters;
