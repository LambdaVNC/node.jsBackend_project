const managementPanel = (req, res, next) => {
    res.render("index", {layout : "./layout/management_layout.ejs"})
};



module.exports = {
    managementPanel,
}