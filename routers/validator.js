/**
 * Created by boot on 9/19/16.
 */
var router = require('express').Router();
var request = require('request');
var PHARMACY_ACTIVITY_CODE = 477310;
//TODO Usar https://soa.afip.gob.ar/av/v1/vencimientos/<cuit> que data no este vacio
function validateCodes(codes, activities) {
    return codes.every(code => activities.find(item => code == item));
};

function validateState(item) {
    return item.data.estadoClave == 'ACTIVO';
};

function validateisDead(item) {
    return item.data.tipoPersona != 'FISICA' || !item.data.fechaFallecimiento;
};

var validatePharmacy = function(req, res) {
    var cuit = req.params.cuit;
    request(config.afip_url + cuit, function(error, response, body) {
        var result = JSON.parse(body);
        if (error || !result.success) {
            res.status(400).send(error);
        } else {
            console.log(body);
            var isValid = result.data.actividades != null &&
                validateCodes([PHARMACY_ACTIVITY_CODE], result.data.actividades) &&
                validateState(result) && validateisDead(result);
            if (!isValid) {
                res.send({valid: isValid, name: result.data.nombre});
            } else {
                request(config.afip_expiration_url + cuit, function(error, response, body) {
                    var data = JSON.parse(body);
                    if (error || !data.success) {
                        res.status(400).send(error);
                    } else {
                        res.send({valid: data.data.length > 0, name: result.data.nombre});
                    }
                });
            }
        }
    });
};

router.get('/pharmacy/:cuit', validatePharmacy);

module.exports = router;