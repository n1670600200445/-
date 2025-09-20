const controller = {};
const { validationResult } = require('express-validator');

//-------------------------------------------------------------------------------Admin-------------------------------------------------------------------------------
controller.login = (req, res) => {
    res.render('./main/main', { session: req.session });
};


controller.loginadmin = (req, res) => {
    res.render('./login', { session: req.session });
};

controller.loginHome = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        setTimeout(() => {
            res.redirect('/');
        }, 1000)
    } else {
        const username = req.body.username;
        const password = req.body.password;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM admins WHERE username= ? AND password= ?', [username, password], (err, data) => {
                if (err) {
                    console.log(err);
                }
                if (data.length > 0) {
                    req.session.idadmins = data[0].idadmins;
                    req.session.adminlogin = data[0].username;
                    req.session.adminps = data[0].password;
                    req.session.nameadminf = data[0].fname_ad;
                    req.session.nameadminl = data[0].lname_ad;
                    res.redirect('/index');
                } else {
                    req.session.success = false;
                    req.session.login = 'บัญชีผู้ใช้หรือรหัสผ่านผิด!!!';
                    res.redirect('/loginadmin');
                }
            });
        });
    }
};

controller.dashboard = function (req, res) {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT COUNT(*) as formsCount FROM forms', (err, forms) => {
                conn.query('SELECT COUNT(*) as menuSubsCount FROM menu_sub', (err, menu_subs) => {
                    conn.query('SELECT COUNT(*) as menuMainsCount FROM menu_main', (err, menu_mains) => {
                        conn.query('SELECT COUNT(*) as usersCount FROM users', (err, users) => {
                            conn.query('SELECT COUNT(*) as personnelsCount FROM personnel', (err, personnels) => {
                                conn.query('SELECT COUNT(*) as adminsCount FROM admins', (err, admins) => {
                                    conn.query('SELECT MAX(count_res) as value_resCount FROM value_res', (err, value_res) => {
                                        if (err) {
                                            res.json(err);
                                        } else {
                                            const num_menu = (menu_mains[0] ? menu_mains[0].menuMainsCount : 0) + (menu_subs[0] ? menu_subs[0].menuSubsCount : 0);
                                            const num_user = (users[0] ? users[0].usersCount : 0) + (personnels[0] ? personnels[0].personnelsCount : 0) + (admins[0] ? admins[0].adminsCount : 0);
                                            const num_form = (forms[0] ? forms[0].formsCount : 0)
                                            const num_value_res = (value_res[0].value_resCount !== null  ? value_res[0].value_resCount : 0)
                                            console.log(num_value_res);
                                            res.render('dashboard/dashboard', { num_form, num_menu, num_user,num_value_res, session: req.session });
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/');
    }
};


controller.logout = function (req, res) {
    req.session.destroy();
    // res.clearCookie('admin');
    // res.clearCookie('user');
    // res.clearCookie('userType');
    res.redirect('/');
};


module.exports = controller;