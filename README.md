# twilio-wyzant-puppeteer
Using Puppeteer to scrape Wyzant, and then sending an SMS for relevant jobs using Twilio

## Installation
```
npm install dotenv
npm install twilio
npm install puppeteer
npm install opn
```
**or just**
```
npm install
```

You'll also need to make sure you have Chrome installed. If you're in Ubuntu/Linux, you can try the Chrome parts of these instructions: [https://tecadmin.net/setup-selenium-chromedriver-on-ubuntu/](https://tecadmin.net/setup-selenium-chromedriver-on-ubuntu/)

You have to have accounts on both [Twilio](https://twilio.com) and [Wyzant](https://www.wyzant.com/tutorsignupstart) to use this app. Once you do, create a .env file and include the following variables:

```
WYZANT_USERNAME=
WYZANT_PASSWORD=
TWILIO_ACCT_SID=
TWILIO_AUTH_TOKEN=
MY_PHONE=

```

(This .env file is ignored by git, so if for any reason you contribute to the project, .env should not be included in modified files for commit and push.)


## Usage

Just run this command and let it go as long as you want to monitor. (Ctrl+C to cancel at any time.)
```
node go.js
```
