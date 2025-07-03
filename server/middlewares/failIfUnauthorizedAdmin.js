const failIfUnauthorizedAdmin = (req, res, next) => {
  // Check if the session has a logged-in user

    if (!req.session.user || req.session.user.userType !== "admin") {
        return res.status(401).json({ message: "Unauthorized: Admin access only" });
    }

    next();
};

export default failIfUnauthorizedAdmin;

