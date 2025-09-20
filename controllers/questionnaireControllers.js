const controller = {};
const uuidv4 = require('uuid').v4;

controller.listQuestionnaire = (req, res) => {
    // if (req.session.idadmins) {
    req.getConnection((err, conn) => {
        conn.query(`SELECT * FROM questionnaire`, (err, questionnaire) => {
            if (err) {
                res.json(err)
            } else {
                res.render('questionnaire/questionnaireAdminList/list', { session: req.session, questionnaire: questionnaire })
            }
        })
    })
    // }else{
    //     res.redirect('/')
    // }
};

controller.saveQuestionnaire = (req, res) => {
    // if (req.session.idadmins) {
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
        } else {
            for (var i = 0; i < file.length; i++) {
                var filename = uuidv4() + "." + file[i].name.split(".")[1];
                file[i].mv("./public/icon/" + filename, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    }
    req.getConnection((err, conn) => {
        conn.query(`INSERT INTO questionnaire SET title_qtn = ? ,enable_qtn = ?, picture_qtn = ?`,
            [data.title_qtn, data.enable_qtn, filename], (err, result) => {
                if (err) {
                    res.json(err)
                } else {
                    setTimeout(() => {
                        res.redirect(`/questionnaire/question/${result.insertId}`)
                    }, 1000)
                }
            })
    })
    // }else{
    //     res.redirect('/')
    // }
};

controller.editQuestionnaire = (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestionnaire } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM questionnaire WHERE idquestionnaire = ?;', [idQuestionnaire], (err, questionnaire) => {
            if (err) {
                res.json(err)
            } else {
                res.render('questionnaire/questionnaireAdminList/edit', { session: req.session, questionnaire: questionnaire[0] });
            }
        });
    });
    // } else {
    //     res.redirect('/');
    // }
};

controller.updateQuestionnaire = (req, res) => {
    // if (req.session.idadmins) {
    const data = req.body;
    const { idQuestionnaire } = req.params;
    req.session.success = true;
    req.session.topic = "แก้ไขข้อมูลการติดต่อเสร็จเรียบร้อยแล้ว";
    req.getConnection((err, conn) => {
        conn.query('UPDATE questionnaire set title_qtn = ? , enable_qtn = ? WHERE idquestionnaire = ?',
            [data.title_qtn, data.enable_qtn, idQuestionnaire], (err, _) => {
                if (err) {
                    res.json(err);
                }
                setTimeout(() => {
                    res.redirect('/questionnaire');
                }, 1000)
            });
    });
    // } else {
    //     res.redirect('/');
    // }
}

controller.deleteQuestionnaire = (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestionnaire } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM questionnaire WHERE idquestionnaire = ?', [idQuestionnaire], (err, _) => {
            if (err) {
                res.render('delete_err');
            } else {
                setTimeout(() => {
                    res.redirect('/questionnaire');
                }, 3000)
            }

        });
    });
    // } else {
    //     res.redirect('/');
    // }
};


controller.listQuestion = (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestionnaire } = req.params;
    req.getConnection((err, conn) => {
        conn.query(`SELECT * FROM question qt JOIN question_type qtt ON qt.idquestionType_qt = qtt.idquestion_type WHERE idquestionnaire_qt = ?`, [idQuestionnaire], (err, question) => {
            conn.query(`SELECT * FROM questionnaire WHERE idquestionnaire = ?`, [idQuestionnaire], (err, questionnaire) => {
                conn.query(`SELECT * FROM question_type`, (err, questiontype) => {
                    if (err) {
                        res.json(err)
                    } else {
                        res.render('questionnaire/questionAdminList/list', {
                            session: req.session, question: question, questionnaire: questionnaire,
                            questiontype: questiontype
                        })
                    }
                })
            })
        })
    })
    // }else{
    //     res.redirect('/')
    // }
};

controller.saveQuestion = (req, res) => {
    // if (req.session.idadmins) {
    const data = req.body;
    const { idQuestionnaire } = req.params;

    req.getConnection((err, conn) => {
        conn.query(`INSERT INTO question SET namequestion_qt = ? ,idquestionnaire_qt = ?, idquestionType_qt = ?`,
            [data.namequestion_qt, idQuestionnaire, data.idquestionType_qt], (err, resultQuestion) => {
                if (err) {
                    res.json(err)
                } else {
                    if (req.files) {
                        var file = req.files.filename;
                        if (!Array.isArray(file)) {
                            var filename = uuidv4() + "." + file.name.split(".")[1];
                            file.mv("./public/img_alerts/" + filename, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    conn.query(`INSERT INTO question_images_nonback SET images_qtimnb = ? ,idquestion_qtimnb = ?`,
                                        [filename, resultQuestion.insertId], (err, resultQuestionImage) => {
                                            if (err) {
                                                res.json(err)
                                            }
                                        })
                                    console.log('uploads filename: ' + filename);
                                }
                            })
                        }
                    } else if (data.nameSelector) {
                        var dataSelect = data.nameSelector
                        for (const oneSelect in dataSelect) {
                            conn.query(`INSERT INTO question_selector SET nameselector_qtslt = ?`,
                                [dataSelect[oneSelect]], (err, resultSelector) => {
                                    if (err) {
                                        res.json(err)
                                    } else {
                                        conn.query(`INSERT INTO selector SET idquestion_slt = ?, idquestionSelector_slt = ?`,
                                            [resultQuestion.insertId, resultSelector.insertId], (err, _) => {
                                                if (err) {
                                                    res.json(err)
                                                }
                                            })
                                    }
                                })
                        }
                    } setTimeout(() => {
                        res.redirect(`/questionnaire/question/${idQuestionnaire}`)
                    }, 1000)
                }
            })
    })
    // }else{
    //     res.redirect('/')
    // }
};

controller.editQuestion = (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestion } = req.params;
    req.getConnection((err, conn) => {
        conn.query(`SELECT * FROM question qt JOIN question_type qtt ON qt.idquestionType_qt = qtt.idquestion_type
            WHERE idquestion = ?`, [idQuestion], (err, questions) => {
            if (err) {
                res.json(err)
            } else if (questions[0].idquestion_type == 2 || questions[0].idquestion_type == 3) {
                conn.query(`SELECT * FROM question qt JOIN question_type qtt ON qt.idquestionType_qt = qtt.idquestion_type 
                    JOIN selector slt ON qt.idquestion = slt.idquestion_slt
                    JOIN question_selector qtslt ON slt.idquestionSelector_slt = qtslt.idquestion_selector
                    WHERE idquestion = ?;`, [idQuestion], (err, question) => {
                    conn.query(`SELECT * FROM question_type`, (err, questiontype) => {
                        if (err) {
                            res.json(err)
                        } else {
                            res.render('questionnaire/questionAdminList/edit', { session: req.session, question: question, questiontype: questiontype, questions: questions[0] });
                        }
                    });
                });
            } else if (questions[0].idquestion_type == 7) {
                conn.query(`SELECT * FROM question qt JOIN question_type qtt ON qt.idquestionType_qt = qtt.idquestion_type JOIN question_images_nonback qtimnb ON qt.idquestion = qtimnb.idquestion_qtimnb
                    WHERE idquestion = ?;`, [idQuestion], (err, question) => {
                    conn.query(`SELECT * FROM question_type`, (err, questiontype) => {
                        if (err) {
                            res.json(err)
                        } else {
                            res.render('questionnaire/questionAdminList/edit', { session: req.session, question: question, questiontype: questiontype, questions: questions[0] });
                        }
                    });
                });
            } else {
                conn.query(`SELECT * FROM question qt JOIN question_type qtt ON qt.idquestionType_qt = qtt.idquestion_type
                    WHERE idquestion = ?`, [idQuestion], (err, questionData) => {
                    if (err) {
                        res.json(err)
                    } else {
                        conn.query(`SELECT * FROM question_type`, (err, questiontype) => {
                            if (err) {
                                res.json(err)
                            } else {
                                res.render('questionnaire/questionAdminList/edit', { session: req.session, question: questionData[0], questiontype: questiontype });
                            }
                        });
                    }
                })
            }
        })

    });
    // } else {
    //     res.redirect('/');
    // }
};

controller.updateQuestion = async (req, res) => {
    // if (req.session.idadmins) {
    const data = req.body
    const { idQuestion } = req.params
    console.log(idQuestion);
    req.getConnection(async (err, conn) => {
        if (req.files) {
            await conn.query(`UPDATE question set namequestion_qt = ?, idquestionType_qt = ?
                WHERE idquestion = ?`, [data.title_qtn, data.questiontype, idQuestion], (err, _) => {
                if (err) {
                    res.json(err)
                } else {
                    var file = req.files.filename;
                    if (!Array.isArray(file)) {
                        var filename = uuidv4() + "." + file.name.split(".")[1];
                        file.mv("./public/img_alerts/" + filename, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                conn.query(`UPDATE question_images_nonback set images_qtimnb = ?
                                WHERE idquestion_qtimnb = ?`, [filename, idQuestion], (err, _) => {
                                    if (err) {
                                        res.json(err)
                                    } else {
                                        setTimeout(()=>{
                                            res.redirect(`/questionnaire/question/edit/${idQuestion}`)
                                        },1000)
                                    }
                                })
                                console.log('uploads filename: ' + filename);
                            }
                        })
                    }
                }
            })
        } else {
            await conn.query(`UPDATE question set namequestion_qt = ?, idquestionType_qt = ?
        WHERE idquestion = ?`, [data.title_qtn, data.questiontype, idQuestion], (err, result) => {
                if (err) {
                    res.json(err)
                } else {
                    conn.query('SELECT * FROM question WHERE idquestion = ?', [idQuestion], (err, id) => {
                        if (err) {
                            res.json(err)
                        } else {
                            setTimeout(() => {
                                res.redirect(`/questionnaire/question/${id[0].idquestionnaire_qt}`)
                            }, 1000)
                        }
                    })
                }
            })
        }
    })
    // } else {
    //     res.redirect('/');
    // }
}

controller.deleteQuestion = async (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestion } = req.params;
    req.getConnection(async (err, conn) => {
        await conn.query('SELECT * FROM question WHERE idquestion = ?', [idQuestion], (err, result) => {
            if (err) {
                res.render('delete_err');
            } else {
                conn.query('DELETE FROM question WHERE idquestion = ?', [idQuestion], (err, _) => {
                    if (err) {
                        res.json(err)
                    } else {
                        setTimeout(() => {
                            res.redirect(`/questionnaire/question/${result[0].idquestionnaire_qt}`);
                        }, 3000)
                    }
                });
            }
        });
    });
    // } else {
    //     res.redirect('/');
    // }
};

//!--------------------------------------------------------------------------------API-------------------------------------------

controller.deleteQuestionAPI = async (req, res) => {
    // if (req.session.idadmins) {
    const { idSelector, idQuestionSelector } = req.params;
    req.getConnection(async (err, conn) => {
        await conn.query('DELETE FROM selector WHERE idselector = ?', [idSelector], (err, result) => {
            if (err) {
                res.render('delete_err');
            } else {
                conn.query('DELETE FROM question_selector WHERE idquestion_selector = ?', [idQuestionSelector], (err, _) => {
                    if (err) {
                        res.render('delete_err');
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    });
    // } else {
    //     res.redirect('/');
    // }
};

controller.updateQuestionAPI = async (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestionSelector, data } = req.params
    req.getConnection(async (err, conn) => {
        await conn.query(`UPDATE question_selector set nameSelector_qtslt = ?
            WHERE idquestion_selector = ?`, [data, idQuestionSelector], (err, result) => {
            if (err) {
                res.json(err)
            } else {
                res.send(result)
            }
        })
    })
    // } else {
    //     res.redirect('/');
    // }
}

controller.addQuestionAPI = async (req, res) => {
    // if (req.session.idadmins) {
    const { idQuestionSelector, data } = req.params
    console.log(idQuestionSelector);
    req.getConnection(async (err, conn) => {
        await conn.query(`INSERT INTO question_selector set nameSelector_qtslt = ?`
            , [data], (err, result) => {
                if (err) {
                    res.json(err)
                } else {
                    conn.query(`INSERT INTO selector set idquestion_slt = ?, idquestionSelector_slt = ?`
                        , [idQuestionSelector, result.insertId], (err, result) => {
                            if (err) {
                                res.json(err)
                            } else {
                                res.send(result)
                            }
                        })
                }
            })
    })
    // } else {
    //     res.redirect('/');
    // }
}

module.exports = controller;