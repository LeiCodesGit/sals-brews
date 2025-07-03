const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.user) {
        // Check if the logged-in user is admin or customer
        const redirectPath = req.session.user.userType === "admin"
            ? "/admin/users"      // Admins go to admin panel
            : "/home";            // Regular users/customers go to home

        return res.redirect(redirectPath);
    }

    next(); 
};
