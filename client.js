const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const settings = require('./Supervisor/src/configs/settings.json');
const children = require("child_process");
const Discord = require('discord.js')
const mongoose = require("mongoose");
class Rainha extends Client {
constructor(options) {
super({
options,
rest: { rejectOnRateLimit: false },
fetchAllMembers: true,
intents: Object.values(GatewayIntentBits),
partials: Object.values(Partials),
shard: "auto",
});
process.on("uncaughtException", (err) => {  
console.error(err) 
});
process.on("unhandledRejection", (err) => {   
console.error(err) 
});
process.on("beforeExit", () => { 
console.log("Sistem Kapanıyor!") 
});
this.on("rateLimit", (rate) => { 
console.log("Client Rate Limit'e Uğradı; " + rate) 
});
this.on(Events.Error, (err) => {     
console.error(err) 
});
}
static BotLogin(client, token) {
client.login(token).then(() => console.log("[BOT] "+client.user.tag+" İsimli Bot Başarıyla Bağlandı!")).catch(() => console.log("[HATA] Bot Bağlanamadı!"));   
client.on(Discord.Events.ClientReady, async() => {
setInterval(() => {
const oynuyor = settings.botDurum
const index = Math.floor(Math.random() * (oynuyor.length));
client.user.setPresence({
activities: [{
name: `${oynuyor[index]}`, 
type: Discord.ActivityType.Playing
}],
status: 'dnd'
});
}, 10000);
}) 
}
static SelfLogin(client, token) {
client.login(token).then(() => console.log("[SELF BOT] "+client.user.tag+" İsimli Self Bot Başarıyla Bağlandı!")).catch(() => console.log("[HATA] Self Bot Bağlanamadı!"));   
}
static MongoLogin(mongoURL) {
mongoose.set('strictQuery', true);
mongoose.connect(mongoURL,  { useUnifiedTopology: true, useNewUrlParser: true})

mongoose.connection.on("connected", () => {
console.log("[BAŞARILI] Database bağlandı!");
});
mongoose.connection.on("error", () => {
console.error("[HATA] Database bağlanamadı!");
});
mongoose.connection.on('disconnected', () => {
console.warn('[UYARI] Mongoose bağlanamıyor');
});    
}
}

module.exports = { Rainha };