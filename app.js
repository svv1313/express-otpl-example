const express = require("express");
const opentelemetry = require("@opentelemetry/api");
const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();

const recordCustomMetric = (
  apiName,
  event
) => {
  try {
    // TODO: come up with a better way to provide value
    const rand = Math.floor(Math.random() * 10);
    const meter = opentelemetry.metrics.getMeter("Service");
    const counter = meter.createCounter("Service-custom-metrics");
    counter.add(rand, {
      apiName,
      project: "access-codes-partner-gateway",
      application: "access-codes-partner-gateway",
      teamEmail: "shield@dazn.com",
      ...event,
    });
  } catch (err) {
    console.log({
      message: "failed to send custom event to Coralogix",
      private: { event },
      err,
    });
  }
};



const PORT = parseInt(process.env.PORT || "8080");
const app = express();
const tracer = opentelemetry.trace.getTracer();

const getCountryList = () => {
  const countryList = [];

  for (const regionCode of phoneUtil.getSupportedRegions()) {
    const countryCode = phoneUtil.getCountryCodeForRegion(regionCode).toString();

    countryList.push({ countryCode, regionCode });
  }

  return countryList;
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.get("/rolldice", (req, res) => {
  res.send(getRandomNumber(1, 6).toString());
});

app.get("/test", (req, res) => {
  const country = getCountryList()
    // const span1 = tracer.startSpan("work-1");
    // span1.end();
  recordCustomMetric('api-name', { lol: 'kek' });
  res.send(JSON.stringify(country));
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
