const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Institutional Administrator privileges required',
    });
  }
};

module.exports = { requireAdmin };
