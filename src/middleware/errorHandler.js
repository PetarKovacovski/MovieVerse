export default function errorHandler(err, req, res, next) {
    console.error("GLOBAL CATCH Error:", err.stack);
    console.error("Request Details:", {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user
    });
  
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal Server Error" });
  }
  