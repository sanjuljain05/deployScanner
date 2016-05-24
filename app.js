var serialport = require('serialport');// include the library
var WebSocketServer = require('ws').Server;
var portName;
   SerialPort = serialport.SerialPort; // make a local instance of it
   serialport.list(function (err, ports) {
  ports.forEach(function(port) {
      
      portName = port.comName;
    console.log(port.comName);
	
  });
});
   // get port name from the command line:
  // portName = process.argv[2];
   console.log("I am running")


var myPort = new SerialPort('COM5', {
   baudRate: 9600,
   // look for newline at the end of each data packet:
   //parser: serialport.parsers.readline("\n")
   parser: serialport.parsers.raw // buffer form data
   //parser: serialport.parsers.byteLength(13)
 });
 
 var SERVER_PORT = 8081;               // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;          // list of connections to the server
 
 wss.on('connection', handleConnection);
 
function handleConnection(client) {
 console.log("New Connection"); // you have a new client
 connections.push(client); // add this client to the connections array
 
 //client.on('message', sendToSerial); // when a client sends a message,
 
 client.on('close', function() { // when a client closes its connection
 console.log("connection closed"); // print it out
 var position = connections.indexOf(client); // get the client's position in the array
 connections.splice(position, 1); // and delete it from the array
 });
}


 myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function sendSerialData(data) {
	var hexdata = data.toString();
	//console.log('this part is working')
   console.log(hexdata);
   // if there are webSocket connections, send the serial data
   // to all of them:
   if (connections.length > 0) {
     broadcast(hexdata);
   }
}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

function sendToSerial(data) {
 console.log("sending to serial: " + data);
 myPort.write(data);
}


function broadcast(data) {
 for (myConnection in connections) {   // iterate over the array of connections
  connections[myConnection].send(data); // send the data to each connection
 }
}
