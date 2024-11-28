const config = {
  name: "bot da pudim :)",
};

module.exports = {
  msg: function (text) {
    return `[${config.name}]:${text}`;
    },
    
    config:config,
};
