import Joi from "joi";

const deleteShema = Joi.object({
  username: Joi.string().min(2).max(20),
  email: Joi.string().min(7).max(30).email(),
}).xor("username", "email");

export default deleteShema;
