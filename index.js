// CHEQUE
// by slash
import chalk from "chalk"; // styling
import axios from "axios"; // web requests
import readlineSync from "readline-sync" // ask for token
import gradient from "gradient-string"; // logo gradient
import figlet from "figlet"; // makes logo
import clipboard from "copy-paste" // copy funny code to clipboard
const sleep = ms => new Promise(r => setTimeout(r, ms)); // sleep
console.clear();
figlet.text(
  "CHEQUE",
  {
    font: "Slant",
    horizontalLayout: "fitted",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  },
  function (err, data) {
    if (err) {
      console.log(chalk.bgRed("Logo render failure!"));
      console.dir(err);
      return;
    }
    console.log(gradient.morning(data));
  }
);
await sleep(50)
console.log(chalk.hex('#ff6f3b')('A simple Discord token checker by Slash '));
let token = readlineSync.question(chalk.hex('#f28c66').bold("Token: "));
const tokenLoginScript = `
let token = "${token}";

function login(token) {
    setInterval(() => {
        document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = \`"${token}"\`;
    }, 50);
    setTimeout(() => {
        location.reload();
    }, 2500);
}

login(token); 
`; // https://gist.github.com/m-Phoenix852/b47fffb0fd579bc210420cedbda30b61
async function getUserData() {
  try {
    const response = await axios.get('https://discord.com/api/v9/users/@me', {
      headers: {
        'Authorization': token
      }
    });
    const { email, id, username, global_name, phone, mfa_enabled, clan, premium_type, nsfw_allowed, bio, flags, linked_users } = response.data;
    console.clear();
    console.log(gradient.morning('Public Info'));
    console.log(chalk.hex('#f28c66')('| User ID ') + id);
    console.log(chalk.hex('#f28c66')('| Username ') + username);
    console.log(chalk.hex('#f28c66')('| Display Name ') + global_name);
    console.log(chalk.hex('#f28c66')('| Nitro ') + (premium_type === 0 ? 'No' : premium_type === 1 ? 'Yes (Nitro Classic)' : premium_type === 2 ? 'Yes (Normal Nitro)' : premium_type === 3 ? 'Yes (Nitro Basic)' : '???'));
    console.log(chalk.hex('#f28c66')('| Clan ') + (clan !== null ? clan : chalk.gray('Nope')));
    //console.log(chalk.hex('#f28c66')('| About me ') + bio);
    console.log(chalk.hex('#f28c66')('| Flags (idk how to decode, sorry!!) ') + flags);
    console.log("")
    console.log(gradient.morning('Personal Info'));
    console.log(chalk.hex('#f28c66')('| Email ') + email);
    console.log(chalk.hex('#f28c66')('| Phone ') + (phone !== null ? phone : chalk.gray('Not set')));
    console.log(chalk.hex('#f28c66')('| 2FA ') + mfa_enabled);
    console.log(chalk.hex('#f28c66')('| NSFW content allowed? ') + nsfw_allowed);
    console.log("")
    console.log(gradient.morning('Family (non formatted)'));
    console.log(linked_users);
    console.log("")
    clipboard.copy(tokenLoginScript, (err) => {
      if (err) {
        console.error('Something went wrong! ', err);
      } else {
        console.log(chalk.hex('#f28c66')('Code to login with the token has been copied to your clipboard'));
      }
    });
  } catch (error) {
    if (error.message.includes("401")) {
      console.error(chalk.red('Invalid token!'))
    } else {
      console.error('Something went wrong!', error.message);
    }
  }
}

getUserData();