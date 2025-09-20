const controller = {};
const path = require("path");
const fs = require("fs");
const uuidv4 = require('uuid').v4;

controller.list = (req, res) => {
    if (req.session.idadmins) {
        const { id } = req.params;
        // let dirfile = fs.readdir(path.resolve(),)
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms f JOIN forms_type ft ON ft.idforms_type = f.forms_type WHERE f.idforms = ?;', [id], (err, forms) => {
                conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0 ORDER BY position_field ;', [id], (err, forms_field) => {
                    if (err) {
                        res.json(err);
                    }
                    res.render('formsfield/list', { forms, forms_field, session: req.session });
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.addfield = (req, res) => {
    if (req.session.idadmins) {
        const form_id = req.body.formsid;
        const field_type = req.body.field_type;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms_field WHERE forms_id = ? and status_del = 0;', [form_id], (err, fetch_length_ff) => {
                const position_field = fetch_length_ff.length + 1;
                conn.query('INSERT INTO forms_field SET field_type = ? ,forms_id = ?, position_field = ?', [field_type, form_id, position_field], (err, ff) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({
                        message: 'เพิ่ม' + field_type + 'สำเร็จ',
                    })
                })
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.field_fetch = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.setfield_idforms;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms_field ff where forms_id = ? and status_del = 0 ORDER BY position_field;', [id], (err, forms_field) => {
                if (err) {
                    res.json(err);
                }
                res.json({ forms_field });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.fetch_editfield = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.id;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms_field ff where idfield = ?', [id], (err, single_field) => {
                if (err) {
                    res.json(err);
                }
                res.json({ single_field });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.getchoice_dropdown_list = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.idfield;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms_field ff where idfield = ?', [id], (err, single_field) => {
                if (err) {
                    res.json(err);
                }
                res.json({ single_field });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.getchoice_checkbox_list = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.idfield;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms_field ff where idfield = ?', [id], (err, single_field) => {
                if (err) {
                    res.json(err);
                }
                res.json({ single_field });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.getchoice_radio_list = (req, res) => {
    if (req.session.idadmins) {
        const id = req.body.idfield;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM forms_field ff where idfield = ?', [id], (err, single_field) => {
                if (err) {
                    res.json(err);
                }
                res.json({ single_field });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.image_default = (req, res) => {
    fs.readdir('./public/image_fields', function (err, image_default) {
        if (err) {
            console.log("err");
        }
        res.json({ image_default })
    })
};

controller.updateposition = (req, res) => {
    if (req.session.idadmins) {
        const setpositions = req.body.positions;
        const fl = req.body.field_length;
        req.getConnection((err, conn) => {
            for (var i = 0; i < fl; i++) {
                conn.query('UPDATE forms_field SET position_field = ? WHERE idfield = ?', [setpositions[i][1], setpositions[i][0]], (err, data) => { })
            }
            if (err) {
                res.json(err);
            }
            res.json({ message: "success" });
        })
    } else {
        res.redirect('/');
    }
};

controller.deletefield = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET status_del = 1 WHERE idfield = ?', [idfield], (err, del_field) => { })
            conn.query('SELECT * FROM forms_field  WHERE idfield = ?', [idfield], (err, data) => {
                conn.query('SELECT * FROM forms_field WHERE forms_id = ? ORDER BY position_field', [data[0].forms_id], (err, select_allfield) => {
                    for (var i = data[0].position_field; i < select_allfield.length; i++) {
                        conn.query('UPDATE forms_field SET position_field = ? WHERE idfield = ?', [select_allfield[i].position_field - 1, select_allfield[i].idfield], (err, updateofter_del) => { })
                    }
                })
            })
            if (err) {
                res.json(err);
            }
            res.json({ message: "success" });
        })
    } else {
        res.redirect('/');
    }
};

// controller.update_editfield = (req, res) => {
//     if (req.session.idadmins) {
//         console.log(req.body);
//         const idfield = req.body.idfield;
//         const name_fieldtype = req.body.name_fieldtype;
//         const name_link = req.body.name_link;
//         const link = req.body.link;
//         const imagefile = req.body.image_file;
//         const image_default = req.body.image_default;
//         // if (req.files) {
//         //     var file = req.files.filename;
//         //     console.log(file);
//         //     if (!Array.isArray(file)) {
//         //         var filename = uuidv4() + "." + file.name.split(".")[1];
//         //         console.log(filename);
//         //         file.mv("./public/img_alerts/" + filename, function (err) {
//         //             if (err) {
//         //                 console.log(err);
//         //             }
//         //         })
//         //     } else {
//         //         for (var i = 0; i < file.length; i++) {
//         //             var filename = uuidv4() + "." + file[i].name.split(".")[1];
//         //             console.log(filename);
//         //             file[i].mv("./public/img_alerts/" + filename, function (err) {
//         //                 if (err) {
//         //                     console.log(err);
//         //                 }
//         //             })
//         //         }
//         //     }
//         // }

//         req.getConnection((err, conn) => {

//             if (name_fieldtype == "Headerfield_show") {
//                 const labelname_show = req.body.labelname_show;
//                 conn.query('UPDATE forms_field SET tt_name = ?,WHERE idfield = ?', [labelname_show, idfield], (err, update_link) => {
//                     if (err) {
//                         res.json(err);
//                     }
//                     res.json({ message: "success" });
//                 })
//             }

//             if (name_fieldtype == "Linkfield") {
//                 const name_link = req.body.name_link;
//                 const link = req.body.link;
//                 conn.query('UPDATE forms_field SET name_link = ?,link = ? WHERE idfield = ?', [name_link, link, idfield], (err, update_link) => {
//                     if (err) {
//                         res.json(err);
//                     }
//                     res.json({ message: "success" });
//                 })
//             }
//             if (name_fieldtype == "Vdofield_show") {
//                 const youtube_link = req.body.youtube_link;
//                 console.log(youtube_link);
//                 conn.query('UPDATE forms_field SET youtube_link = ? WHERE idfield = ?', [youtube_link, idfield], (err, update_youtube) => {
//                     if (err) {
//                         res.json(err);
//                     }
//                     res.json({ message: "success" });
//                 })
//             }
//             if (name_fieldtype == "Imagefield") {
//                 if (imagefile) {
//                     //         var filename = uuidv4() + "." + file.name.split(".")[1];
//                     //         console.log(filename);
//                     //         file.mv("./public/image_default/" + filename, function (err) {
//                     //             if (err) {
//                     //                 console.log(err);
//                     //             }
//                     //         })
//                 }
//                 if (image_default) {
//                     conn.query('UPDATE forms_field SET image_file = ? WHERE idfield = ?', [image_default, idfield], (err, update_youtube) => {
//                         if (err) {
//                             res.json(err);
//                         }
//                         res.json({ message: "success" });
//                     })
//                 }

//             }
//         })
//     } else {
//         res.redirect('/');
//     }
// };

controller.update_Headerfield_show = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const labelname_show = req.body.labelname_show;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET tt_name = ? WHERE idfield = ?', [labelname_show, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Linkfield_show = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const name_link_show = req.body.name_link_show;
        const link_show = req.body.link_show;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET name_link = ?,link = ? WHERE idfield = ?', [name_link_show, link_show, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Vdofield_show = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const youtube_link = req.body.youtube_link_show;
        console.log("yt:", idfield);
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET youtube_link = ? WHERE idfield = ?', [youtube_link, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Imagefield_show = (req, res) => {
    if (req.session.idadmins) {
        const file = req.file;
        const idfield = req.body.idfield;
        if (file) {
            req.getConnection((err, conn) => {
                conn.query('UPDATE forms_field SET image_file = ? WHERE idfield = ?', [file.filename, idfield], (err, data) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ message: "success" });
                })
            })
            console.log('File uploaded successfully');
        } else {
            console.log('Error uploading file');
            res.json({ message: "err" });
        }
        // const image_default = req.file ? req.file.filename : null; // Get the uploaded file's filename
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Imagedefault_show = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const name_img = req.body.image_check;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET image_file = ? WHERE idfield = ?', [name_img, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
        // const image_default = req.file ? req.file.filename : null; // Get the uploaded file's filename
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Imageandlinkfield_show = (req, res) => {
    if (req.session.idadmins) {
        const file = req.file;
        const idfield = req.body.idfield;
        const name_link = req.body.name_link;
        const link = req.body.link;
        console.log(idfield, name_link, link);
        if (file) {
            req.getConnection((err, conn) => {
                conn.query('UPDATE forms_field SET image_file = ?,name_link = ?,link = ? WHERE idfield = ?', [file.filename, name_link, link, idfield], (err, data) => {
                    if (err) {
                        res.json(err);
                    }
                    res.json({ message: "success" });
                })
            })
            console.log('File uploaded successfully');
        } else {
            console.log('Error uploading file');
            res.json({ message: "err" });
        }
        // const image_default = req.file ? req.file.filename : null; // Get the uploaded file's filename
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Imagedefaultandlinkfield_show = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const name_img = req.body.image_check;
        const name_link = req.body.name_link_show;
        const link = req.body.link_show;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET image_file = ?,name_link = ?,link = ? WHERE idfield = ?', [name_img, name_link, link, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
        // const image_default = req.file ? req.file.filename : null; // Get the uploaded file's filename
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Shorttextfield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_inputname = req.body.label_inputname;
        const placeholder_field = req.body.placeholder_field;
        const validateOption = req.body.validateOption;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_inputname = ?,placeholder_field = ?,validate = ? WHERE idfield = ?', [label_inputname, placeholder_field, validateOption, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
        // const image_default = req.file ? req.file.filename : null; // Get the uploaded file's filename
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Longtextfield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_longtext = req.body.label_longtext;
        const placeholder_longtext = req.body.placeholder_longtext;
        const validateOption = req.body.validateOption;

        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_longtext = ?,placeholder_longtext = ?,validate = ? WHERE idfield = ?', [label_longtext, placeholder_longtext, validateOption, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
        // const image_default = req.file ? req.file.filename : null; // Get the uploaded file's filename
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Linkfield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const link_q = req.body.link_q;
        const linktext_q = req.body.linktext_q;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET link_q = ?,linktext_q = ? WHERE idfield = ?', [link_q, linktext_q, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        console.log('else');
        res.redirect('/');
    }
};

controller.update_Dropdownfield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_dropdown = req.body.label_dropdown;
        let option_dropdown = req.body.option_dropdown;
        const validateOption = req.body.validateOption;
        if (option_dropdown == 0) {
            option_dropdown = ""
        } else {
            option_dropdown = option_dropdown.toString()
        }
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_dropdown = ?,choice_dropdown = ?,validate = ? WHERE idfield = ?', [label_dropdown, option_dropdown, validateOption, idfield], (err, data2) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Imagefield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_inputimage = req.body.label_inputimage;
        const validate = req.body.validateOption;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_inputimage = ?,validate = ? WHERE idfield = ?', [label_inputimage, validate, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Datetimefield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_datetime = req.body.label_datetime;
        const validate = req.body.validateOption;
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_datetime = ?,validate = ? WHERE idfield = ?', [label_datetime, validate, idfield], (err, data) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Checkboxfield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_checkbox = req.body.label_checkbox;
        let choice_checkbox = req.body.choice_checkbox;
        const validateOption = req.body.validateOption;
        if (choice_checkbox == 0) {
            choice_checkbox = ""
        } else {
            choice_checkbox = choice_checkbox.toString()
        }
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_checkbox = ?,choice_checkbox = ?,validate = ? WHERE idfield = ?', [label_checkbox, choice_checkbox, validateOption, idfield], (err, data2) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};

controller.update_Radiofield_q = (req, res) => {
    if (req.session.idadmins) {
        const idfield = req.body.idfield;
        const label_radio = req.body.label_radio;
        let choice_radio = req.body.choice_radio;
        const validateOption = req.body.validateOption;
        if (choice_radio == 0) {
            choice_radio = ""
        } else {
            choice_radio = choice_radio.toString()
        }
        req.getConnection((err, conn) => {
            conn.query('UPDATE forms_field SET label_radio = ?,choice_radio = ?,validate = ? WHERE idfield = ?', [label_radio, choice_radio, validateOption, idfield], (err, data2) => {
                if (err) {
                    res.json(err);
                }
                res.json({ message: "success" });
            })
        })
    } else {
        res.redirect('/');
    }
};
module.exports = controller;