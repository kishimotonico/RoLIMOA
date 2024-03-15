import path from "path";
import process from "process";
import fs from "fs";
import { google, sheets_v4 } from "googleapis";

// Google APIの認証情報を読み込む
const keyfile = path.join(process.env.ROLIMOR_SERVER_ROOT, "credentials.json");
const keys = JSON.parse(fs.readFileSync(keyfile).toString());
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);
// Generate the url that will be used for authorization
const authorizeUrl = client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

export function submitMatchResult(auth, payload: any) {
  const sheets = google.sheets("v4");
  const appendParams: sheets_v4.Params$Resource$Spreadsheets$Values$Append = {
    auth: auth,
    spreadsheetId: process.env.ROLIMOR_SPREADSHEET_ID,
    range: "結果一覧!A1:AF100",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      majorDimension: "ROWS",
      values: [
        [
          new Date(payload.confirmedAt).toLocaleTimeString("ja-JP", {
            timeZone: "Asia/Tokyo",
          }),
          payload.match.name,
          payload.match.teams.red.id,
          payload.match.teams.red.name,
          payload.match.teams.red.school,
          payload.finalScore.fields.red.tasks.rule_A,
          payload.finalScore.fields.red.tasks.rule_B,
          payload.finalScore.fields.red.tasks.rule_C,
          payload.finalScore.fields.red.tasks.rule_D,
          payload.finalScore.fields.red.tasks.rule_E,
          payload.finalScore.fields.red.tasks.rule_F,
          payload.finalScore.fields.red.tasks.rule_G,
          payload.finalScore.fields.red.tasks.rule_H,
          payload.finalScore.fields.red.enable,
          payload.finalScore.fields.red.winner,
          payload.confirmedScore.red,
          payload.finalScore.fields.red.vgoal ?? "",
          payload.match.teams.blue.id,
          payload.match.teams.blue.name,
          payload.match.teams.blue.school,
          payload.finalScore.fields.blue.tasks.rule_A,
          payload.finalScore.fields.blue.tasks.rule_B,
          payload.finalScore.fields.blue.tasks.rule_C,
          payload.finalScore.fields.blue.tasks.rule_D,
          payload.finalScore.fields.blue.tasks.rule_E,
          payload.finalScore.fields.blue.tasks.rule_F,
          payload.finalScore.fields.blue.tasks.rule_G,
          payload.finalScore.fields.blue.tasks.rule_H,
          payload.finalScore.fields.blue.enable,
          payload.finalScore.fields.blue.winner,
          payload.confirmedScore.blue,
          payload.finalScore.fields.blue.vgoal ?? "",
          payload.comment,
        ],
      ],
    },
  };
  sheets.spreadsheets.values.append(appendParams, (err, res) => {
    if (err) {
      console.error("The API returned an error.");
      throw err;
    } else {
      console.log(JSON.stringify(res, null, 2));
    }
  });
}

export { client, authorizeUrl };
