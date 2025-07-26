import Joi from "joi";

const userLog = Joi.object({
  username: Joi.string().min(2).max(20),
  password: Joi.string().min(4).max(10),
});

const emailLog = Joi.object({
  email: Joi.string().min(5).max(30),
  password: Joi.string().min(4).max(10),
});

export { userLog, emailLog };
