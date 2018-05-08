const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
const expressSession = require('express-session');
const app = express();
const createInitialSession = require('./middlewares/session');
const filter = require('./middlewares/filter');

require('dotenv').config();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../build` ) );
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000*10 
    }
}))

app.use( ( req, res, next ) => createInitialSession(req, res, next) );
// app.use( ( req, res, next ) => {
//     const { method } = req;
//     if( method ==="POST" || method === "PUT"){
//         filter( req, res, next );
//     } else{
//         next();
//     }
// })

app.post( "/api/messages", filter,  mc.create );
app.get( "/api/messages", mc.read );
app.put( "/api/messages", filter, mc.update );
app.delete( "/api/messages", mc.delete );
app.get( "/api/messages/history", mc.history);

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );