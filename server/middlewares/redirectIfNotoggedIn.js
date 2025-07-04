const redirectIfNotLoggedIn = (req, res, next) => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (!req.session || !req.session.user) {
        return res.redirect("/auth/login");
    }

    next(); 
};

export default redirectIfNotLoggedIn;
=======
=======
>>>>>>> 48ae31e7306ea241479f40ae6361320fd7120d09
  if (!req.session || !req.session.user) {
    return res.redirect("/auth/login");
  }

  next(); 
};

export default redirectIfNotLoggedIn;
<<<<<<< HEAD
>>>>>>> f61a4df34a05b5eba5a1b00384f5ef04a148a00c
=======
>>>>>>> 48ae31e7306ea241479f40ae6361320fd7120d09
