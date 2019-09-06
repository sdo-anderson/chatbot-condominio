/**
 * Indice geral das Rotas
 * @author Fábio R K Sartori
 * @copyright 02/2019
 */
const routes = require( 'express' ).Router();
const cors = require( 'cors' );
const customer = require( './customer' );
const lista = require( './lista' );
const customerLebes = require( './customerLebes' );
const { version } = require('../package.json');
const verifyVersion = require('../middleware/version');

/**
 * Operacoes referentes a Customer
 * @see https://gitlab.4all.com/lebes/lebes-mobile-bff/blob/rev-1.0.0/README.md
 */
routes.use( '/cstmr', cors(), verifyVersion, customer );

/**
 * Operacoes referentes a servicos de listas da Lebes
 */
routes.use( '/lst', cors(), verifyVersion, lista );

/**
 * Operacoes referentes a servicos de cadastro cliente da Lebes
 */
routes.use( '/cstmrlbs', cors(), verifyVersion, customerLebes );

routes.get( '/', ( req, res ) => {
    res.send( { status: 'Conectado ao Server', version } );
});

module.exports = routes;