/* global process */
/* global __dirname */
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');

var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var Grid = require('gridfs-stream');
var fs = require('fs');
var server = http.createServer(app)
var configDB = require('./dbconfig.js');
var mongoose = require('mongoose');

var session = require('express-session')
var passport = require('passport');
require('./passport')(passport);

mongoose.connect(configDB.url);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'master')));
app.set('/views', express.static(__dirname + '/public'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/interface',  express.static(__dirname + '/interface'));
app.use('/uploads', express.static(__dirname + "/uploads"));

app.engine('html', require('ejs').renderFile);
app.use(session({
    secret: configDB.secret,
    name: configDB.name,
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (request, response) {
    response.render('index.html');
});

app.post('/api/upload'
    , auth
    , multer({ dest: './uploads/', inMemory: true }).single('file')
    , function (req, res) {
        Grid.mongo = mongoose.mongo;
        var conn = mongoose.connection;
        var gfs = Grid(conn.db, mongoose.mongo);

        var filename = req.file.filename;
        var path = req.file.path;
        var type = req.file.mimetype;

        var read_stream = fs.createReadStream(__dirname + '/' + path);

        var writestream = gfs.createWriteStream({
            filename: filename
            , type: type
        });
        read_stream.pipe(writestream);

        writestream.on('close', function (file) {
            fs.unlink('./uploads/' + file.filename);
            res.status(200).send({ fileId: file._id });
        });
        writestream.on('error', function (e) {
            res.status(500).send("Could not upload file");
        });
    });

app.get('/api/upload', function (req, res) {

    Grid.mongo = mongoose.mongo;
    var conn = mongoose.connection;
    var gfs = Grid(conn.db, mongoose.mongo);
    var perPage = Math.max(0, (req.param('max'))),
        page = Math.max(0, (req.param('page') - 1));

    var TotalPaginas = 0;
    var TotalItens = 0;
    var PaginaAtual = page;

    if (PaginaAtual < 1)
        PaginaAtual = 1;

    var PaginaAnterior = page - 1;

    if (PaginaAnterior < 1)
        PaginaAnterior = 1;

    var PaginaSeguinte = page + 1;

    if (PaginaSeguinte < 2)
        PaginaSeguinte = 2;
    var totalFiles = gfs.files.find().toArray(function (err, files) {
        var pageItens = pagination(files.length);
        return ;
    });
    function pagination(length) {
        var files = gfs.files.find()
            .limit(perPage)
            .skip(perPage * page)
            .sort({
                uploadDate: -1
            })
            .toArray(function (err, files) {
                if (err) {
                    res.json(err);
                }
                var pageItens = Fillpages(length);
                pageItens.Itens = files;
                return res.json(pageItens);
            });
    }
    function Fillpages(length) {
        return {
            PaginaAtual: PaginaAtual,
            PaginaAnterior: PaginaAnterior,
            PaginaSeguinte: PaginaSeguinte,
            TotalPaginas: Math.ceil((length/perPage)),
            TotalItens: length,
            Itens: null
        };
    };


});
app.get('/api/getimage/:id', function (req, res) {
    var pic_id = req.param('id');
    Grid.mongo = mongoose.mongo;
    var conn = mongoose.connection;
    var gfs = Grid(conn.db, mongoose.mongo);

    gfs.files.find({ filename: pic_id }).toArray(function (err, files) {

        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = 'image/jpeg';
            res.set('Content-Type', mime);
            var read_stream = gfs.createReadStream({ filename: pic_id });
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
    });
});

require('./api/conta/user-routes.js')(app, server, passport);
require('./api/conta/map-routes.js')(app, server, passport);

function auth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

server.listen(server_port, server_ip_address);
console.log('rodando na porta: ' + server_port);