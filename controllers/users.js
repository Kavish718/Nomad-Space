const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to NomadSpace!");
            res.redirect("/places");
        });

    } catch (e) {
        if (e.code === 11000) {
            req.flash("error", "Email already exists!");
        } else {
            req.flash("error", e.message);
        }
        res.redirect("/register");
    }

}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to NomadSpace!");
    const redirectUrl = req.session.returnTo || "/places";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/places");
}