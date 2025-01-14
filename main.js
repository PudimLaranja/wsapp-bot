const { Client, LocalAuth } = require("whatsapp-web.js");
//const { msg, config } = require("./bot-style.js");
const { TextAnim,Frame,f } = require("./animation-handler.js");

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

client.on("message_create",(message) => {
  if (message.body === "!animation") {
    message.reply('message received').then(ans=>{
      const anim = new TextAnim(ans,'generic','10f',true);
      anim.build({
        "1f": f("0_0"),
        "2f": f("-_-"),
        "3f": f("0_0")
      });
      anim.play();
    });
    //await message.edit('message received');
    
  }
});

client.initialize();

