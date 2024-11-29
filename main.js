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
    client.sendMessage(message.from, msg(num)).then(async (ans) => {
      while (true) { // Loop infinito controlado
        num++;
        await ans.edit(msg(num)); // Aguarda a edição da mensagem ser concluída
        
        if (num >= 10) {
          num = 0;
        }

        // Adiciona um atraso para evitar sobrecarregar o sistema
        await new Promise(resolve => setTimeout(resolve, 100)); // 1 segundo de pausa
      }
    });
  }
});

client.initialize();
