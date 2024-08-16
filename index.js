// CHEQUE
import chalk from "chalk"; // styling
import axios from "axios"; // web requests
import readlineSync from "readline-sync"; // ask for token
import gradient from "gradient-string"; // logo gradient
import figlet from "figlet"; // makes logo
import clipboard from "copy-paste"; // copy funny code to clipboard
const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); // sleep
const FLAG_DEFINITIONS = {
  1: "STAFF (Discord Employee)",
  2: "PARTNER (Partnered Server Owner)",
  4: "HYPESQUAD (HypeSquad Events Member)",
  8: "BUG_HUNTER_LEVEL_1 (Bug Hunter Level 1)",
  64: "HYPESQUAD_ONLINE_HOUSE_1 (House Bravery Member)",
  128: "HYPESQUAD_ONLINE_HOUSE_2 (House Brilliance Member)",
  256: "HYPESQUAD_ONLINE_HOUSE_3 (House Balance Member)",
  512: "PREMIUM_EARLY_SUPPORTER (Early Nitro Supporter)",
  1024: "TEAM_PSEUDO_USER (User is a team)",
  16384: "BUG_HUNTER_LEVEL_2 (Bug Hunter Level 2)",
  65536: "VERIFIED_BOT (Verified Bot)",
  131072: "VERIFIED_DEVELOPER (Early Verified Bot Developer)",
  262144: "CERTIFIED_MODERATOR (Moderator Programs Alumni)",
  524288:
    "BOT_HTTP_INTERACTIONS (idek how u got this)",
  4194304: "ACTIVE_DEVELOPER (User is an Active Developer)",
};

function decodeFlags(flags) {
  let decodedFlags = [];
  for (const [flag, description] of Object.entries(FLAG_DEFINITIONS)) {
    if (flags & flag) {
      decodedFlags.push(description);
    }
  }
  return decodedFlags.length > 0 ? decodedFlags : ["UNKNOWN_FLAG"];
}
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

await sleep(50);
console.log(chalk.hex("#ff6f3b")("A simple Discord token checker by Slash "));
let token = readlineSync.question(chalk.hex("#f28c66").bold("Token: "));

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
`;

async function getUserData() {
  try {
    // Get user data
    const response = await axios.get("https://discord.com/api/v9/users/@me", {
      headers: {
        Authorization: token,
      },
    });

    const {
      email,
      id,
      username,
      global_name,
      phone,
      mfa_enabled,
      clan,
      premium_type,
      nsfw_allowed,
      bio,
      flags,
      linked_users,
    } = response.data;

    console.clear();
    console.log(gradient.morning("Public Info"));
    console.log(chalk.hex("#f28c66")("| User ID ") + id);
    console.log(chalk.hex("#f28c66")("| Username ") + username);
    console.log(chalk.hex("#f28c66")("| Display Name ") + global_name);
    console.log(
      chalk.hex("#f28c66")("| Nitro ") +
        (premium_type === 0
          ? "No"
          : premium_type === 1
          ? "Yes (Nitro Classic)"
          : premium_type === 2
          ? "Yes (Normal Nitro)"
          : premium_type === 3
          ? "Yes (Nitro Basic)"
          : "???")
    );
    console.log(
      chalk.hex("#f28c66")("| Clan ") +
        (clan !== null ? clan : chalk.gray("Nope"))
    );
    const decodedFlags = decodeFlags(flags);
    console.log(chalk.hex("#f28c66")("| Flags ") + decodedFlags.join(", "));
    console.log("");
    console.log(gradient.morning("Personal Info"));
    console.log(chalk.hex("#f28c66")("| Email ") + email);
    console.log(
      chalk.hex("#f28c66")("| Phone ") +
        (phone !== null ? phone : chalk.gray("Not set"))
    );
    console.log(chalk.hex("#f28c66")("| 2FA ") + mfa_enabled);
    console.log(
      chalk.hex("#f28c66")("| NSFW content allowed? ") + nsfw_allowed
    );
    console.log("");
    console.log(gradient.morning("Family (non formatted)"));
    console.log(linked_users);
    console.log("");

    // billing
    const billingResponse = await axios.get(
      "https://ptb.discord.com/api/v9/users/@me/billing/payment-sources",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log(gradient.morning("Billing Info"));

    billingResponse.data.forEach((source, index) => {
      console.log(chalk.hex("#f28c66")(`Payment Source #${index + 1}`));
      console.log(
        chalk.hex("#f28c66")("| Invalid ") +
          (source.invalid ? chalk.red("Yes") : chalk.green("No"))
      );
      console.log(chalk.hex("#f28c66")("| Brand ") + (source.brand || "N/A"));
      console.log(
        chalk.hex("#f28c66")("| Last 4 digits ") + (source.last_4 || "N/A")
      );
      console.log(
        chalk.hex("#f28c66")("| Expires ") +
          `${source.expires_month}/${source.expires_year}`
      );
      console.log(chalk.hex("#f28c66")("| Country ") + source.country);
      console.log(
        chalk.hex("#f28c66")("| Billing Address ") +
          `${source.billing_address.name}, ${source.billing_address.line_1}, ` +
          `${source.billing_address.city}, ${source.billing_address.state}, ` +
          `${source.billing_address.country}, ${source.billing_address.postal_code}`
      );
      console.log("");
    });

    clipboard.copy(tokenLoginScript, (err) => {
      if (err) {
        console.error("Something went wrong! ", err);
      } else {
        console.log(
          chalk.hex("#f28c66")(
            "Code to login with the token has been copied to your clipboard"
          )
        );
      }
    });
  } catch (error) {
    if (error.message.includes("401")) {
      console.error(chalk.red("Invalid token!"));
    } else {
      console.error("Something went wrong!", error.message);
    }
  }
}

getUserData();
