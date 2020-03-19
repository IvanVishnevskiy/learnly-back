process.env.NODE_APP_INSTANCE === '1' ? require('./chat/xmpp') : ''
// we require this file to start websocket server on port 2999.