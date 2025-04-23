const express = require("express");
const { SerialPort, ReadlineParser } = require("serialport");
const WebSocket = require("ws");

const app = express();
const PORT = 3000;

app.use(express.static("dist"));

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

const port = new SerialPort({ path: "/dev/tty.usbmodem11201", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.on("data", (line) => {
  console.log("Serial:", line);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(line);
    }
  });
});

// Arduino joystick: reads two streams of data from joystick
