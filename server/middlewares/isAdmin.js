export default function isAdmin(req, res, next) {
    const user = req.session.user;

    if (!user || user.userType !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
}