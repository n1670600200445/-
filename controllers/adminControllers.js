const controller = {};
const { validationResult } = require('express-validator');

//-------------------------------------------------------------------------------Admin-------------------------------------------------------------------------------
controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM admins', (err, admin) => {

                let idadmins1 = []
                let fname_ad1 = []
                let lname_ad1 = []
                let phone_ad1 = []
                let username1 = []
                let password1 = []

                for (i in admin) {
                    idadmins1.push(admin[i].idadmins)
                    fname_ad1.push(admin[i].fname_ad)
                    lname_ad1.push(admin[i].lname_ad)
                    phone_ad1.push(admin[i].phone_ad)
                    username1.push(admin[i].username)
                    password1.push(admin[i].password)
                }
                if (err) {
                    res.json(err);
                }
                res.render('admins/list', { admin: admin, idadmins1, fname_ad1, lname_ad1, phone_ad1, username1, password1, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.save = (req, res) => {
    if (req.session.idadmins) {
        const data = req.body;
        console.log(req.body);
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO admins set fname_ad = ? , lname_ad = ? , phone_ad = ? , username = ? , password = ?'
                , [data.fname_ad, data.lname_ad, data.phone_ad, data.username, data.password], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        req.session.success = true;
                        req.session.topic = "เพิ่มข้อมูลสำเร็จ";
                        setTimeout(() => {
                            res.redirect('/admin',);
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
};

controller.update = (req, res) => {
    console.log(req.body);
    if (req.session.idadmins) {
        const errors = validationResult(req);
        req.session.success = true;
        req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
        req.getConnection((err, conn) => {
            conn.query('UPDATE admins set fname_ad = ? , lname_ad = ? , phone_ad = ? , username = ? , password = ? where idadmins = ?',
                [req.body.fname_ad,req.body.lname_ad,req.body.phone_ad,req.body.username,req.body.password,req.body.idadmins], (err, result) => {
                    if (err) {
                        res.json(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/admin');
                        }, 1000)
                    }
                });
        });
    } else {
        res.redirect('/');
    }
}


controller.delete = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM admins WHERE idadmins = ?', [req.body.idadmins], (err, admins) => {
                if (err) {
                    res.render('delete_err');
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลการติดต่อเรียบร้อยแล้ว";
                    setTimeout(() => {
                        res.redirect('/admin');
                    }, 1000)
                }
            });
        });
    } else {
        res.redirect('/');
    }
};

module.exports = controller;