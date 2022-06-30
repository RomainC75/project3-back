const puppeteer = require("puppeteer");
const fs = require("fs");
const dataJSON = require("./data-new.json");

const scrape = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        slowMo: 300,
        devtools: true,
        headless: false,
      });

      const page = await browser.newPage();
      await page.setViewport({
        width: 1000,
        height: 1500,
      });
      await page.goto(url, { waitUntil: "networkidle2" });

      console.log("click cookies button");
      const [button] = await page.$x("//button[contains(., 'Alrighty!')]");
      if (button) {
        await button.click();
      }

      console.log("getting data...");
      const data = await page.evaluate(() => {
        let price = document
          .querySelector(".price-wrapper div.price")
          .textContent.match(/\d+/)[0];
        price = parseInt(price);

        const name = document.querySelector("h1").textContent;

        const pictures = Array.from(
          document.querySelectorAll(".navigator__item-image")
        ).map((el) => el.getAttribute("src"));

        const obj = Array.from(document.querySelectorAll(".keyfeature"))
          .map((el) => {
            const span = Array.from(el.querySelectorAll("span")).map(
              (elem) => elem.textContent
            );
            return {
              [span[0]]: span[1],
            };
          })
          .filter((detailObject) => {
            const detailsToFilter = [
              "Soundboard",
              "Fretboard",
              "Colour",
              "Neck",
              "Frets",
            ];
            console.log("insideFilter", detailObject);
            return detailsToFilter.includes(Object.keys(detailObject)[0]);
          });
        let objToSend = {};
        obj.forEach(
          (objToSpread) => (objToSend = { ...objToSend, ...objToSpread })
        );

        objToSend = {
          ...objToSend,
          price,
          name,
          pictures,
        };
        objToSend.Frets = parseInt(objToSend.Frets);
        return objToSend;
      });
      console.log("got data ! : ", data);
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

scrape("https://www.thomannmusic.com/fender_sq_40th_p_bass_lpb.htm").then(
  (result) => {
    dataJSON.push(result);
    fs.writeFile(
      "data-new.json",
      JSON.stringify(dataJSON),
      "utf8",
      function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
  }
);
