const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

 
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

 
const generalLimiter = createRateLimit(
  15 * 60 * 1000,  
  100,  
  "Too many requests from this IP, please try again later."
);

 
const authLimiter = createRateLimit(
  15 * 60 * 1000,  
  5,  
  "Too many authentication attempts, please try again later."
);

 
const uploadLimiter = createRateLimit(
  60 * 60 * 1000, 
  20,  
  "Too many upload attempts, please try again later."
);

 
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders,
};
