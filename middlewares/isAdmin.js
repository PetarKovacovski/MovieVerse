
export function isAdmin(req, res, next) {
    if (!req.user?.isAdmin) {
        return res.status(403).send("Access denied. Admins only.");
    }

    next();
}