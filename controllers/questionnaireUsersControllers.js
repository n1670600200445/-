const controller = {};
const fs = require('fs');

controller.listQuestionnaireUsers = (req, res) => {
    if (req.cookies.idusers) {
        req.getConnection((err, conn) => {
            conn.query(`SELECT * FROM questionnaire WHERE enable_qtn = 0`, (err, questionnaire) => {
                fs.readFile('./public/name/name.txt', 'utf8', (errReadfile, name) => {
                    if (err) {
                        return res.json(err)
                    } if (errReadfile) {
                        return res.json(errReadfile)
                    }
                    return res.render('questionnaire/questionUserList/list', { cookies: req.cookies, questionnaire: questionnaire, name: name })
                })
            })
        })
}else {
    res.redirect('/loginusers')
}
};

controller.listQuestionUsers = (req, res) => {
    if (req.cookies.idusers) {
        const { idquestionnaire } = req.params;
        req.getConnection((err, conn) => {
            conn.query(`SELECT * FROM question qt JOIN questionnaire qtn ON qt.idquestionnaire_qt = qtn.idquestionnaire JOIN question_images_nonback qtimnb ON
            qt.idquestion = qtimnb.idquestion_qtimnb WHERE idquestionnaire_qt = ?`, [idquestionnaire], (err, question) => {
                if (err) {
                    return res.json(err)
                }
                return res.render('questionnaire/questionUserList/listQuestion', { cookies: req.cookies, question: question })
        })
    })
}else {
    res.redirect('/loginusers')
}
};


module.exports = controller