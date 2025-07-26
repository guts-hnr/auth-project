import Joi from "joi";

const userShema = Joi.object({
  username: Joi.string().min(2).max(20),
  email: Joi.string().min(5).max(30),
  password: Joi.string().min(4).max(10),
});

export default userShema;
