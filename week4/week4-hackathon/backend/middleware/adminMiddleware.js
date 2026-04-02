export const admin = (req, res, next) => {
  console.log('Admin middleware - User:', req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Admin check failed - User role:', req.user?.role);
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
