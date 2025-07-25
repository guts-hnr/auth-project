import Joi from "joi";

const userShema = Joi.object({
  username: Joi.string().min(2).max(20),
  password: Joi.string().min(4).max(10),
});

export default userShema;
