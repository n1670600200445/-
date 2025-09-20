const controller = {};
const fs = require('fs');

//! ---------------------------------------------------เข้าสู่ระบบประชาชนในหมู่บ้าน-----------------------------------------------------
controller.login = (req, res) => {
    fs.readFile('./public/name/name.txt', 'utf8', (err, name) => {
        res.render('loginusers', { session: req.session, name: name });
    });
};

controller.loginusers = (req, res) => {
    const idcard_us = req.body.idcard_us;
    const new_phone_us = req.body.new_phone_us;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE idcard_us = ? AND status_id = 1', [idcard_us], (err, data) => {
            if (new_phone_us) {
                conn.query('UPDATE users SET phone_us = ? WHERE idcard_us = ?', [req.body.new_phone_us, idcard_us], (err, updatephone) => { });
            }

            if (data.length > 0) {
                res.cookie('login_status', 1);
                res.cookie('idusers', data[0].idusers);
                res.cookie('idcard_us', idcard_us);
                res.redirect('/indexusers');
            } else {
                setTimeout(() => {
                    req.session.topicpersonnel = false;
                    res.redirect('/loginusers');
                }, 1000)
            }
        });
    });
};

controller.loginusers_nm = (req, res) => {
    const phone_us_nm = req.body.phone_us;
    req.getConnection((err, conn) => {
        res.cookie('login_status', 2);
        res.cookie('phone_us', phone_us_nm);
        res.redirect('/alertsnormal');
    });
};

//! ---------------------------------------------------เข้าสู่ระบบเจ้าหน้าที่-----------------------------------------------------
controller.loginps = (req, res) => {
    fs.readFile('./public/name/name.txt', 'utf8', (err, name) => {
        res.render('loginpersonnel', { session: req.session, name: name });
    });
};

controller.loginpersonnel = (req, res) => {
    const idcard_ps = req.body.idcard_ps;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personnel WHERE idcard_ps = ? AND status_id = 1', [idcard_ps], (err, data) => {
            conn.query('SELECT * FROM personnel WHERE idcard_ps = ?', [idcard_ps], (err, data2) => {
                if (err) {
                    console.log(err);
                }
                if (data.length > 0) {
                    res.cookie('idpersonnel', data[0].idpersonnel);
                    res.cookie('idpersonneltype', data[0].personnel_type);
                    res.cookie('fname_ps', data[0].fname_ps);
                    res.cookie('lname_ps', data[0].lname_ps);
                    res.redirect('/personnelAlerts');
                } else if (data2.length > 0) {
                    req.session.topicpersonnel = true
                    res.redirect('/loginpersonnel')
                } else {
                    setTimeout(() => {
                        req.session.topicpersonnel = false;
                        res.redirect('/loginpersonnel');
                    }, 1000)
                }
            });
        });
    });
};


controller.logout = function (req, res) {
    req.session.destroy();
    res.clearCookie('idusers');
    res.clearCookie('idcard_us');
    res.clearCookie('idpersonnel');
    res.clearCookie('phone_us');
    req.session.destroy(function (error) {
        res.redirect('/loginusers');
    });
};

controller.logoutps = function (req, res) {
    req.session.destroy();
    res.clearCookie('idpersonnel');
    res.clearCookie('fname_ps');
    res.clearCookie('lname_ps');
    req.session.destroy(function (error) {
        res.redirect('/loginpersonnel');
    });
};

module.exports = controller;
