import Joi from "joi";

const loginShema = Joi.object({
  username: Joi.string().min(2).max(20),
  email: Joi.string().min(5).max(30).email(),
  password: Joi.string().min(4).max(10).required(),
}).xor("email", "username");

export default loginShema;
