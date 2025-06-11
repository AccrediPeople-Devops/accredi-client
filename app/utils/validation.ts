import * as Joi from "joi";

export const registrationSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
  contactNumber: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  profileImage: Joi.object({
    url: Joi.string().required(),
    key: Joi.string().required(),
  }).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});

export const validateForm = (data: any, schema: Joi.ObjectSchema) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (!error) return { isValid: true, errors: {} };

  const errors = error.details.reduce(
    (acc: Record<string, string>, current) => {
      const key = current.path[0] as string;
      acc[key] = current.message.replace(/["]/g, "");
      return acc;
    },
    {}
  );

  return { isValid: false, errors };
};
