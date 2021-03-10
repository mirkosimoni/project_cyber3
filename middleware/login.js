function isLoggedIn (req, res, next) {
    if(req.session.loggedin) {
        next();
    } else res.redirect("/login");
}

module.exports = isLoggedIn;