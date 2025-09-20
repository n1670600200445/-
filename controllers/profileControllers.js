const controller = {};
const fs = require('fs');

controller.profile = (req, res) => {
    if (req.session.idadmins) {
        let ts = Date.now();

        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear() + 543;
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        req.getConnection((err, conn) => {
            fs.readFile('./public/name/name.txt', 'utf8', (err1, name) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('profile/profile', { session: req.session, name: name, date: date, year: year, month: month, hours: hours, minutes: minutes })
                }
            })
        })
    } else {
        res.redirect('/');
    }
}

controller.uploadlogo = (req, res) => {
    if (req.session.idadmins) {
        if (req.files) {
            var file = req.files.filename;

            if (!Array.isArray(file)) {
                var filename = "logo.png";
                file.mv("./public/logo/" + filename, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        setTimeout(() => {
                            res.redirect('/profile')
                        }, 2000)
                    }
                })
            }
        }
    } else {
        res.redirect('/');
    }
}

controller.updatename = (req, res) => {
    if (req.session.idadmins) {
        const name = req.body.name_pst;
        fs.writeFile('./public/name/name.txt', name, err => {
            if (err) {
                console.log(err)
            } else {
                setTimeout(() => {
                    res.redirect('/profile')
                }, 2000)
            }
        })
    } else {
        res.redirect('/');
    }
}

controller.user_profile = (req, res) => {
    const id = req.cookies.idusers;
    const phone_us_nm = req.cookies.phone_us;
    const login_status = req.cookies.login_status;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE idusers = ?', [id], (err, users) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ users,phone_us_nm,login_status, session: req.session })
            }
        });
    });
};

controller.personnel_profile = (req, res) => {
    const id = req.cookies.idpersonnel;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personnel WHERE idpersonnel = ?', [id], (err, personnels) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ personnels, session: req.session })
            }
        });
    });
};


controller.admin_profile = (req, res) => {
    const id = req.session.idadmins;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM admins WHERE idadmins = ?', [id], (err, admins) => {
            if (err) {
                console.log(err);
            } else {
                res.json({ admins, session: req.session })
            }
        });
    });
};

module.exports = controller;