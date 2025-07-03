const redirectIfNotLoggedIn = (req, res, next) => {
<<<<<<< HEAD
    if (!req.session || !req.session.user) {
        return res.redirect("/auth/login");
    }

    next(); 
};

export default redirectIfNotLoggedIn;
=======
  if (!req.session || !req.session.user) {
    return res.redirect("/auth/login");
  }

  next(); 
};

export default redirectIfNotLoggedIn;
>>>>>>> f61a4df34a05b5eba5a1b00384f5ef04a148a00c
