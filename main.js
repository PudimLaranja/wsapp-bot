const { Client, LocalAuth } = require("whatsapp-web.js");
const { msg, config } = require("./bot-style.js");
//const { timer } = require("./bot-tools.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message_create", (message) => {
  if (message.body === "!ping") {
    var num = 0;
    // send back "pong" to the chat the message was sent in
    client.sendMessage(message.from, msg(num)).then((ans) => {
      var loop = setInterval(() => {
        num++;
        ans.edit(msg(num));
        if (num >= 1000) {
          clearInterval(loop);
        }
      }, 40);
    });
  }
});

client.initialize();
