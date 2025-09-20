const controller = {};

controller.list = (req, res) => {
    if (req.session.idadmins) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM FORMS_TYPE', (err, forms_type) => {
                if (err) {
                    res.json(err);
                }
                res.render('forms_type/list', { forms_type, session: req.session });
            })
        })
    } else {
        res.redirect('/');
    }
};


controller.save = (req, res) => {
    if (req.session.idadmins) {
        const name_ft = req.body.name_forms_type;
        req.getConnection((err, conn) => {
            conn.query('INSERT INTO FORMS_TYPE SET name_forms_type = ?', [name_ft], (err, forms_type) => {
                if (err) {
                    console.log(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "เพิ่มข้อมูลสำเร็จ";
                    setTimeout(() => {
                        res.redirect('/formstype',);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};



controller.edit = (req, res) => {
    if (req.session.idadmins) {
        const idforms_type = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM FORMS_TYPE WHERE IDFORMS_TYPE = ?', [idforms_type], (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        data,
                    })
                }
            })
        })
    }
};

controller.update = (req, res) => {
    if (req.session.idadmins) {
        const name_ft = req.body.name_forms_type;
        const id_ft = req.body.idforms_type
        req.getConnection((err, conn) => {
            conn.query('UPDATE FORMS_TYPE SET name_forms_type = ? WHERE idforms_type = ?', [name_ft,id_ft], (err, forms_type) => {
                if (err) {
                    console.log(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "แก้ไขข้อมูลสำเร็จ";
                    setTimeout(() => {
                        res.redirect('/formstype',);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.check = (req, res) => {
    if (req.session.idadmins) {
        const idforms_type = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM FORMS_TYPE WHERE IDFORMS_TYPE = ?', [idforms_type], (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.json({
                        data,
                    })
                }
            })
        })
    }
};

controller.delete = (req, res) => {
    if (req.session.idadmins) {
        const id_ft = req.body.idforms_type
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM FORMS_TYPE WHERE IDFORMS_TYPE = ?', [id_ft], (err, forms_type) => {
                if (err) {
                    console.log(err);
                } else {
                    req.session.success = true;
                    req.session.topic = "ลบข้อมูลสำเร็จ";
                    setTimeout(() => {
                        res.redirect('/formstype',);
                    }, 1000)
                }
            })
        })
    } else {
        res.redirect('/');
    }
};

module.exports = controller;