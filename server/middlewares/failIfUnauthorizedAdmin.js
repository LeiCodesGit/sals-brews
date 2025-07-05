const failIfUnauthorizedAdmin = (req, res, next) => {
  // Check if the session has a logged-in user
<<<<<<< HEAD

=======
>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
    if (!req.session.user || req.session.user.userType !== "admin") {
        return res.status(401).json({ message: "Unauthorized: Admin access only" });
    }

    next();
};

export default failIfUnauthorizedAdmin;

<<<<<<< HEAD
=======

>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
