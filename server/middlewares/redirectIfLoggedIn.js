<<<<<<< HEAD
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
=======
export default function redirectIfLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        // Redirect based on user type
        if (req.session.user.userType === "admin") {
            return res.redirect("/admin/adminmenu");
        } else {
            return res.redirect("/home");
        }
    }
    next();
}
>>>>>>> 6e2c63a73426c1004803a55ea4426f903b1f389f
