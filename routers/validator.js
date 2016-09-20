/**
 * Created by boot on 9/19/16.
 */
var router = require('express').Router();
var validatePharmacy = function(req, res) {
    var cuit = req.params.cuit;
    return res.send({valid: true, name: 'pharmacy'});
};

router.get('/pharmacy/:cuit', validatePharmacy);

module.exports = router;