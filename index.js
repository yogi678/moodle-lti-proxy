const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const app = express();
const port = process.env.PORT || 3000;

const LTI_KEY = process.env.LTI_KEY;
const LTI_SECRET = process.env.LTI_SECRET;

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("LTI Proxy is live ✨");
});

app.get("/launch", (req, res) => {
  const { user_id, name, email } = req.query;

  const launchUrl = "https://your-moodle-site/enrol/lti/launch.php";

  const params = {
    user_id,
    roles: "Learner",
    lis_person_name_full: name,
    lis_person_contact_email_primary: email,
    resource_link_id: "course-launch",
    lti_version: "LTI-1p0",
    lti_message_type: "basic-lti-launch-request",
    tool_consumer_key: LTI_KEY,
    custom_id: "12345"
  };

  // Normally you’d sign the request, but let’s skip OAuth1 for now.

  const formHtml = `
    <form id="ltiform" action="${launchUrl}" method="POST" target="ltiiframe">
      ${Object.entries(params).map(
        ([key, val]) =>
          `<input type="hidden" name="${key}" value="${val}" />`
      ).join("")}
      <button type="submit">Launch</button>
    </form>
    <script>document.getElementById("ltiform").submit();</script>
  `;

  res.send(formHtml);
});

app.listen(port, () => {
  console.log(`LTI Proxy running on port ${port}`);
});
