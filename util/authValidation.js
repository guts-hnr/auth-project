import Joi from "joi";

const userShema = Joi.object({
  username: Joi.string().min(2).max(20).required(),
  email: Joi.string().min(5).max(30).email().required(),
  password: Joi.string().min(4).max(10).required(),
});

export default userShema;
