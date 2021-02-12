require('dotenv').config();

const WAITINT = 60000;
const wyzantUsername = env.WYZANT_USERNAME;
const wyzantPassword = env.WYZANT_PASSWORD;

const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myPhone = process.env.MY_PHONE;

const puppeteer = require('puppeteer');
const fs = require("fs");
const opn = require('opn');
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

let sendSMS = (phone, message) => {
    client.messages.create({
        body: message,
        to: phone,
        from: '+19362531975'
    })
    .then((message) => {
//        console.log(message.sid))
    })
    .catch();
}


let scrape = async () => {
    console.log("running at " + new Date());
	var browser = await puppeteer.launch({headless: true, args: ["--no-sandbox"]});	// <--- set to true for scraping
	var page = await browser.newPage();
	await page.goto("https://wyzant.com/login");
//	await page.waitFor(10000);
    await page.waitForSelector("#Username", { visible: true });
    var data = await page.evaluate((envariables) => {
        var inputs = document.getElementsByTagName("input");
        for (var i=0;i<inputs.length;i++) {
            if (inputs[i].id=="Username") { inputs[i].value = envariables.WYZANTUSERNAME; }
            if (inputs[i].id=="Password") { inputs[i].value = envariables.WYZANTPASSWORD; }
        }
    }, {WYZANTUSERNAME:process.env.WYZANTUSERNAME, WYZANTPASSWORD:process.env.WYZANTPASSWORD});
    await page.click('#sso_login-landing > form > button');
	await page.waitFor(5000);
    await page.click('#my-business-nav-item > div.text-small.show-inline-block');
	await page.waitFor(1000);
    await page.click('#my-business-nav-item > div.ui-menu-submenu > div:nth-child(8) > a');

    /*
    Instead:
    Scrape page for new job listings. 
    Try to identify a most recent ID / timestamp or something and store it.
    For newer ones that were posted within the last 30m or so, send me a text with a link.
    IFF they have the words "[B]oot[ ][C]amp" in them and pay between about $20 and $80 per hour.
    */
	await page.waitFor(10000);

    var data = await page.evaluate(() => {
        var items = [];
        console.clear();
        var cards = $(".academy-card");
        cards.each((c, card) => {
            var age = card.getElementsByClassName("pull-right")[0].innerText;
            var ageRegex = /([0-9]m)/;
            var a = age.match(ageRegex);
            if (a != null) {
                var keywordRegex = /boot ?camp/i;
                var k = card.innerHTML.match(keywordRegex);
                if (k!=null) {
                    var priceRegex = /Recommended rate: \$([\.0-9]+)/;
                    var p = card.innerHTML.match(priceRegex);
                    if (p!=null) {
                        var rate = parseInt(p[1]);
                        var urlRegex = /<a class="job-details-link" href="(\/tutor\/jobs\/.*?)">/;
                        var u = card.innerHTML.match(urlRegex);
                        var url = "https://wyzant.com" + u[1];
                        var x = {rate:rate, url:url};
                        items.push(x);
                    }
                }
            }
        });
//        console.log(items);
        return items;
    });
    for (var d in data) {
        console.log(data[d]);
        opn(data[d].url);
//        sendSMS(myPhone, "Wyzant 'Boot Camp' Opportunity: " + data[d].url);
    }

	browser.close();
	return {};
}

scrape();
setInterval(scrape, 600000); // <-- run once every 11 minutes or so










/*
<div class="academy-card">

      <!-- Hidden on mobile -->
      <div class="pull-right small-hide">
        <span class="text-semibold text-light">
          2h
        </span>
      </div>

      <!-- Hidden on desktop -->
      <div class="medium-hide">
        <div class="pull-right">
          <span class="text-semibold text-light">
            2h
          </span>
        </div>
      </div>
      <p class="text-semibold spc-zero-n spc-tiny-s">Phuoc</p>
      <h3 class="spc-sm-s">
          <a class="job-details-link" href="/tutor/jobs/5958429">JavaScript</a>
      </h3>

      <!-- Tooltips -->
      <div vue=""><span vue=""><div data-v-114be1d2="" class="ui-tooltip-trigger"><div data-v-114be1d2=""><span data-v-114be1d2="" class="text-semibold text-underscore"><i data-v-114be1d2="" class="wc-usd" style="position: relative; top: 1px;"></i>
          Recommended rate: $89/hr
      </span></div> <div data-v-114be1d2="" class="ui-tooltip" style="width: 300px; left: -51.5px; display: none;"><span data-v-114be1d2="" class="ui-tooltip-arrow"></span> 
        This student has contacted tutors at or below this hourly rate.
        You are more likely to hear back from them if the hourly rate for your job
        application is within $10 of this recommended rate.
        You can update your hourly rate for this job when applying.
    </div></div></span></div>
      <p class="spc-zero-s job-description">Looking for a tutor who is available to help me with a project</p>
        <div vue="" class="spc-sm-n"><div data-v-c95686bc=""><div data-v-c95686bc="" tabindex="0" class="collapsable-label"><p data-v-c95686bc="" class="text-blue spc-zero-s"><i data-v-c95686bc="" class="wc-plus-square-o wc-center"></i> Show details</p></div> <!----> <!----></div></div>
    </div>
*/
