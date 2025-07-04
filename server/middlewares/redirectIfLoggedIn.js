const redirectIfLoggedIn = (req, res, next) => {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 48ae31e7306ea241479f40ae6361320fd7120d09
    if (req.session.user) {
        // Check if the logged-in user is admin or customer
        const redirectPath = req.session.user.userType === "admin"
        ? "/admin/users"      // Admins go to admin panel
        : "/home";            // Regular users/customers go to home

        return res.redirect(redirectPath);
    }

    next(); 
<<<<<<< HEAD
};
=======
  if (req.session.user) {
    // Check if the logged-in user is admin or customer
    const redirectPath = req.session.user.userType === "admin"
      ? "/admin/users"      // Admins go to admin panel
      : "/home";            // Regular users/customers go to home

    return res.redirect(redirectPath);
  }

  next(); 
};
>>>>>>> f61a4df34a05b5eba5a1b00384f5ef04a148a00c
=======
};
>>>>>>> 48ae31e7306ea241479f40ae6361320fd7120d09
