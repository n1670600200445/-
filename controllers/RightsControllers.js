const { validationResult } = require('express-validator');


const controller = {};
controller.show = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        conn.query('SELECT * FROM rights', (err, rights) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.render('./menus/Rights.ejs', {
                rights: rights,
                session: req.session
            });
        });
    });
};


// Function to handle the form submission for saving a new right
controller.save = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('/Rights/add'); // Redirect to add form with errors
    } else {
        req.session.success = true;
        req.session.topic = "เพิ่มข้อมูลกลุ่มสำเร็จ!";
        const data = req.body;
        req.getConnection((err, conn) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            conn.query('INSERT INTO rights SET ?', [data], (err, results) => {
                if (err) {
                    res.status(500).json(err);
                    return;
                }
                res.redirect('/Rights'); // Redirect after successful save
            });
        });
    }
};



controller.edit = (req, res) => {
    const id = req.body.id;
    console.log('Received ID in Request:', id); // Debugging log

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json(err);
        }

        conn.query('SELECT * FROM rights WHERE id = ?', [id], (err, rights) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (rights.length > 0) {
                res.json({ rights: rights[0], session: req.session });
            } else {
                res.status(404).json({ message: 'Right not found' });
            }
        });
    });
};







controller.update = (req, res) => {
    if (req.session.id) {
        console.log(req.body);
        req.getConnection((err, conn) => {
            if (err) {
                console.error('Database connection error:', err);
                return res.status(500).json(err);
            }

            conn.query('UPDATE rights SET name = ? WHERE id = ?', [req.body.name, req.body.id], (err, rights) => {
                if (err) {
                    console.error('Query error:', err);
                    return res.status(500).json(err);
                }

                setTimeout(() => {
                    res.redirect('/Rights');
                }, 1000);
            });
        });
    } else {
        res.redirect('/');
    }
};








controller.delete = (req, res) => {
    if (req.session.id) {
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM rights WHERE id= ?', [req.body.id], (err, rights) => {
                if (err) {
                    console.log(err);
                }
                setTimeout(() => {
                    res.redirect('/Rights');
                }, 1000)
            })
        })
    } else {
        res.redirect('/');
    }
};




// controller.checkdelete = (req, res) => {
//     if (req.session.id) {
//         req.getConnection((err, conn) => {
//             if (err) {
//                 return res.status(500).json(err);
//             }
//             conn.query('SELECT * FROM rights WHERE id=?', [req.body.id], (err, results) => {
//                 if (err) {
//                     return res.status(500).json(err);
//                 }
//                 if (results.length > 0) {
//                     res.json({ rights: results[0] });
//                 } else {
//                     res.status(404).json({ message: 'No data found' });
//                 }
//             });
//         });
//     } else {
//         res.redirect('/');
//     }
// };


controller.checkdelete = (req, res) => {
    const id = req.body.id;
    console.log('Received ID in Request:', id); // Debugging log

    req.getConnection((err, conn) => {
        if (err) {
            return res.status(500).json(err);
        }

        conn.query('SELECT * FROM rights WHERE id = ?', [id], (err, rights) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (rights.length > 0) {
                res.json({ rights: rights[0], session: req.session });
            } else {
                res.status(404).json({ message: 'Right not found' });
            }
        });
    });
};





module.exports = controller;
