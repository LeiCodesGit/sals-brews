const failIfUnauthorizedAdmin = (req, res, next) => {
  // Check if the session has a logged-in user
<<<<<<< HEAD
    if (!req.session.user || req.session.user.userType !== "admin") {
        return res.status(401).json({ message: "Unauthorized: Admin access only" });
    }

    next();
};

export default failIfUnauthorizedAdmin;
=======
  if (!req.session.user || req.session.user.userType !== "admin") {
    return res.status(401).json({ message: "Unauthorized: Admin access only" });
  }

  next();
};

export default failIfUnauthorizedAdmin;
>>>>>>> f61a4df34a05b5eba5a1b00384f5ef04a148a00c
