const { Schema, model } = require("mongoose");

const schema = Schema({
guildID: { type: String, default: ""},
/////Guild///////  
serverTag: {type: Array, default: []},
defaultTag: {type: String, default: ""},
nameTag: {type: String, default: ""},
unregName: {type: String, default: ""},  
botFooter: {type: String, default: ""},
voiceChannel: {type: String, default: ""},
/////Role////////
manRoles: {type: Array, default: []}, 
womanRoles: {type: Array, default: []},  
unregRoles: {type: Array, default: []},  
staffRoles: {type: Array, default: []},  
staffStartRoles: {type: Array, default: []},    
registerRoles: {type: Array, default: []},  
registerPerms: {type: String, default: ""},  
katildiPerms: {type: String, default: ""},  
katilmadiPerms: {type: String, default: ""}, 
mazeretPerms: {type: String, default: ""},  
tagRoles: {type: String, default: ""},  
ownerRoles: {type: Array, default: []},  
boosterRoles: {type: String, default: ""},   
warnHammer: {type: Array, default: []},  
banHammer: {type: Array, default: []},  
jailHammer: {type: Array, default: []},  
muteHammer: {type: Array, default: []},  
jailRoles: {type: Array, default: []},  
reklamRoles: {type: Array, default: []},  
muteRoles: {type: Array, default: []},  
vmuteRoles: {type: Array, default: []},  
fakeAccRoles: {type: Array, default: []},  
bannedTagRoles: {type: Array, default: []},  
warnOneRoles: {type: String, default: ""},  
warnTwoRoles: {type: String, default: ""},  
warnThreeRoles: {type: String, default: ""},  
roleAddRoles: {type: Array, default: []},  
vipRoles: {type: String, default: ""},  
///////////Kanallar & Kategoriler///////
chatChannel: {type: String, default: ""},  
welcomeChannel: {type: String, default: ""},  
inviteChannel: {type: String, default: ""},  
rulesChannel: {type: String, default: ""},  
publicParents: {type: Array, default: []},  
registerParents: {type: Array, default: []},  
solvingParents: {type: Array, default: []},  
privateParents: {type: Array, default: []},  
aloneParents: {type: Array, default: []},  
funParents: {type: Array, default: []},  
//////////Rol Alma & Level Rolleri///////
chatBronzeRoles: {type: String, default: ""},  
chatSilverRoles: {type: String, default: ""},  
chatGoldRoles: {type: String, default: ""},  
chatDiamondRoles: {type: String, default: ""},  
chatEmeraldRoles: {type: String, default: ""},  
voiceBronzeRoles: {type: String, default: ""},  
voiceSilverRoles: {type: String, default: ""},  
voiceGoldRoles: {type: String, default: ""},  
voiceDiamondRoles: {type: String, default: ""},  
voiceEmeraldRoles: {type: String, default: ""},  
oneMonthRoles: {type: String, default: ""},  
threeMonthRoles: {type: String, default: ""},  
sixMonthRoles: {type: String, default: ""},  
nineMonthRoles: {type: String, default: ""},  
oneYearRoles: {type: String, default: ""},  
blackRoles: {type: String, default: ""},  
blueRoles: {type: String, default: ""},  
whiteRoles: {type: String, default: ""},  
redRoles: {type: String, default: ""},  
yellowRoles: {type: String, default: ""},  
pinkRoles: {type: String, default: ""},
purpleRoles: {type: String, default: ""},  
orangeRoles: {type: String, default: ""}, 
greenRoles: {type: String, default: ""},  
brownRoles: {type: String, default: ""},  
burgundyRoles: {type: String, default: ""},  
turquoiseRoles: {type: String, default: ""},   
beigeRoles: {type: String, default: ""},  
navyblueRoles: {type: String, default: ""},  
lightblueRoles: {type: String, default: ""},
pistachiogreenRoles: {type: String, default: ""},
cekilisRoles: {type: String, default: ""},  
etkinlikRoles: {type: String, default: ""},  
coupleRoles: {type: String, default: ""},  
aloneRoles: {type: String, default: ""},  
syRoles: {type: String, default: ""},  
minecraftRoles: {type: String, default: ""},  
fortniteRoles: {type: String, default: ""},  
mlbbRoles: {type: String, default: ""},  
csRoles: {type: String, default: ""},  
pubgRoles: {type: String, default: ""},  
amongusRoles: {type: String, default: ""},  
lolRoles: {type: String, default: ""},  
gtavRoles: {type: String, default: ""},  
valorantRoles: {type: String, default: ""},  
fbRoles: {type: String, default: ""},  
gsRoles: {type: String, default: ""},  
bjkRoles: {type: String, default: ""},  
tsRoles: {type: String, default: ""},  
akrepRoles: {type: String, default: ""},  
yengecRoles: {type: String, default: ""},  
ikizlerRoles: {type: String, default: ""},  
yayRoles: {type: String, default: ""},  
aslanRoles: {type: String, default: ""},  
teraziRoles: {type: String, default: ""},  
basakRoles: {type: String, default: ""},  
kovaRoles: {type: String, default: ""},  
balikRoles: {type: String, default: ""},  
oglakRoles: {type: String, default: ""},  
bogaRoles: {type: String, default: ""},  
kocRoles: {type: String, default: ""}                                                    
});
module.exports = model("kurulum", schema);