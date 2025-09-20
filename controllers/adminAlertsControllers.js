const controller = {};
const uuidv4 = require('uuid').v4;
const request = require('request')
//-------------------------------------------------------------------------------Admin-------------------------------------------------------------------------------
controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM personneltype', (err, personneltype) => {
                conn.query('SELECT * FROM alertstype alty JOIN personneltype psty ON alty.personnel_type_alty = psty.idpersonneltype', (err, alertstype) => {
                    if (err) {
                        res.json(err);
                    }
                    res.render('alertsType/list', { alertstype: alertstype, personneltype: personneltype, session: req.session });
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        if (req.files) {
            var file = req.files.filename;
            if (!Array.isArray(file)) {
                var filename = uuidv4() + "." + file.name.split(".")[1];
                file.mv("./public/icon/" + filename, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO alertstype SET name_alty = ? , icon = ? , personnel_type_alty = ? , token_notify = ? , claim = ? , enable_alty = ?'
                , [data.name_alty, filename, data.personnel_type_alty, data.token_notify, data.claim, data.enable_alty], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    setTimeout(() => {
                        res.redirect('/admin/alerts',);
                    }, 1000)

                });
        });

    } else {
        res.redirect('/');
    }
};

controller.edit = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM alertstype WHERE idalertstype = ?;', [id], (err, alertstype) => {
                conn.query('SELECT * FROM personneltype;', (err, personneltype) => {
                    res.render('alertsType/edit', {
                        editalertstype: alertstype[0], personneltype: personneltype, session: req.session
                    });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};

controller.update = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        const { id } = req.params;
        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE alertstype SET name_alty = ? , personnel_type_alty = ? , token_notify = ?,claim = ? , enable_alty = ? WHERE idalertstype = ?',
                [data.name_alty, data.personnel_type_alty, data.token_notify, data.claim, data.enable_alty, id], (err, result) => {
                    if (err) {
                        res.json(err);
                    }
                    setTimeout(() => {
                        res.redirect('/admin/alerts');
                    }, 1000)
                });
        });
    } else {
        res.redirect('/');
    }
}

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM alertstype WHERE idalertstype = ?', [id], (err, admins) => {
                if (err) {
                    res.render('delete_err');
                } else {
                    setTimeout(() => {
                        res.redirect('/admin/alerts');
                    }, 1000)
                }

            });
        });
    } else {
        res.redirect('/');
    }
};

module.exports = controller;