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
