const SHA256 = require("crypto-js/sha256");

const WebSocket = require("ws");
let socket = new WebSocket("ws://localhost:3000/websocket");

// listen to messages passed to this socket
socket.onmessage = function (e) {
  let response = JSON.parse(e.data);
  console.log("response: ", response);

  // you have to pong back if you need to keep the connection alive
  // each ping from server need a 'pong' back
  if (response.msg == "ping") {
    console.log("keeping connection alive");
    socket.send(JSON.stringify({ msg: "pong" }));
    return;
  }

  if (response.msg === "connected") {
    console.log("connected to server");
  }
	
	if (response.msg === "changed") {
		console.log(response.fields.args);
	}
};

//////////////////////////////////////////////

const connectObject = {
  msg: "connect",
  version: "1",
  support: ["1", "pre2", "pre1"],
};

setTimeout(() => {
  socket.send(JSON.stringify(connectObject));
}, 1000);


const loginObject = {
	msg: "method",	
	method: "login",
	id: generateHash(17),
	params: [
		{
			user: { username: "teste" },
			password: {
				digest: SHA256("teste123").toString(),
				algorithm: "sha-256"
			}
		}
	]
}

setTimeout(() => {
	console.log('sending login');
	socket.send(JSON.stringify(loginObject));
}, 2000);


const sendMessageObject = {
	msg: "method",
	method: "sendMessage",
	id: generateHash(17),
	params: [
		{
			_id: generateHash(17),
			rid: "GENERAL",
			msg: "Hello World",
			emoji: ":smirk:"
		}
	]
}

setTimeout(() => {
	console.log('sending message');
	socket.send(JSON.stringify(sendMessageObject));
}, 3000);


const notifyAllObject = {
    "msg":"sub",
    "id":"6NctZomXL3ZdtKNsn",
    "name":"stream-room-messages",
    "params":[
        "GENERAL",
        {
            "useCollection":false,
            "args":[
                {
                    "visitorToken":"jkGaw6duhiuh45"
                }
            ]
        }
    ]
};

setTimeout(() => {
	console.log('subscribing to stream-notify-room');
	socket.send(JSON.stringify(notifyAllObject));
}, 4000);


//////////////////////////////////////////////

function generateHash(targetLength) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < targetLength; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
