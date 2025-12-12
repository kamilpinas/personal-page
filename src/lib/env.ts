const env = {
  emailJs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  },
};

if (
  !env.emailJs.serviceId ||
  !env.emailJs.templateId ||
  !env.emailJs.publicKey
) {
  throw new Error("Missing EmailJS environment variables. Please check your .env file.");
}

export default env;
