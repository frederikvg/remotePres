var ngMonster = require('./model/monster');

module.exports = function (app) {

    app.get('/monsters', function (req, res) {
        ngMonster.find(function (err, monsters) {
            if (err) res.send(err);
            else res.json(monsters);
        });
    });

    app.post('/monster', function (req, res) {
        var newMonster = new UserDetail({ 
            heroClass: req.body.heroclass, 
            monsterClass: req.body.monsterclass, 
            blabla: req.body.blabla, 
            yyy: req.body.yyy 
        });

        newMonster.save(function (err) {
            if (err)res.send(err);
            res.status(200).end();
        });
    });

    app.delete('/monster/:id', function (req, res) {
        ngMonster.remove({
            _id: req.params.id
        }, function (err, todo) {
            if (err)
                res.send(err);
                res.status(200).end();
        });
    });

};