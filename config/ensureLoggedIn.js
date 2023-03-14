module.exports = (req, res, next) => {
    if(!req.user) return res.status(401).json({ msg: "You shall not pass, unauthorized"})
    next()
}