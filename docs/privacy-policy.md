# Garage Forge Privacy Policy

**Last updated:** 7 August 2026

This Privacy Policy describes how Garage Forge (“we”, “us”, or “the app”) handles information when you use the Garage Forge mobile application.

Contact: `[YOUR_PRIVACY_CONTACT_EMAIL]`

## 1. Who we are

Garage Forge is a personal vehicle garage, parts, and budget tracking app. It is not affiliated with any vehicle manufacturer.

## 2. What the app does

Garage Forge lets you:

- Save vehicles and tracked parts on your device
- Track estimated and actual costs against a monthly budget
- Look up vehicle and parts catalog data from our API
- Export a vehicle summary as a PDF (optional)

## 3. Information stored on your device

Garage Forge stores the following locally on your device (for example via on-device storage):

- Vehicles you add (year, make, model, trim, engine, and optional VIN)
- Tracked parts (names, part numbers, categories, status, priority, costs, notes, sources)
- App settings (currency, units, region, budget settings, spending alert threshold)
- Optional API configuration (base URL and bearer token, if you set them)

This information stays on your device unless you use features that send it to our servers (see below) or you share exported files yourself.

## 4. Information sent to our servers

When the app needs network features, it communicates with our API over HTTPS.

### Catalog and health checks

- Your selected **region** may be sent as a query parameter when loading vehicle makes
- Requests for models, years, categories, and parts are sent to load catalog data
- An optional health check may be sent to verify API connectivity
- If you configure a bearer token, it is sent in the `Authorization` header for authenticated requests

### PDF export (only when you choose Export)

If you export a vehicle, the app sends that vehicle, its tracked parts, and related budget settings to our server so a PDF can be generated. You will be asked to confirm before this happens.

You may then share the PDF using your device’s share sheet. Sharing is controlled by you and may send the file to apps or people you choose.

## 5. Retention

**Assumption (verify against your backend before publishing):** export payloads are used to generate a PDF for your request and are **not retained** after the request is processed. Catalog requests are processed to return catalog data.

If server or hosting logs temporarily include request metadata (for example timestamps or IP addresses), those logs are used only for operating and securing the service.

If this retention practice changes, we will update this policy.

## 6. What we do not do

With the current app:

- We do not show ads
- We do not sell your personal information
- We do not use your data for cross-app tracking or advertising
- We do not require an account

## 7. Third-party processors

Our API may be hosted by infrastructure providers (for example cloud hosting). Those providers process data only to provide hosting and related infrastructure, under their own terms and our configuration.

## 8. Security

- Network traffic to our production API uses HTTPS
- Local app data is stored using the platform’s standard on-device storage and is **not** described as encrypted at rest by the app itself
- API bearer tokens, if saved, are stored with your other app settings on the device

No method of transmission or storage is 100% secure.

## 9. Your choices

- Do not use Export if you do not want garage data sent to the server for PDF generation
- Use **Clear garage** in Settings to remove vehicles and tracked parts from the device (settings may be kept)
- Change or clear any API token you have saved
- Uninstall the app to remove local app data from the device (subject to platform behavior)

## 10. Children

Garage Forge is not directed at children under 13, and we do not knowingly collect personal information from children under 13.

## 11. US state privacy notices (including California)

Depending on how you use the app, categories of information that may be processed include:

- Identifiers or device-related technical data in ordinary server logs (if any)
- User content you enter (vehicles, parts, notes, optional VIN, budget-related settings)
- Product interaction data needed for catalog and export features (such as region)

We do **not** sell personal information. We do not share personal information for cross-context behavioral advertising.

To make a privacy request, contact `[YOUR_PRIVACY_CONTACT_EMAIL]`. Because the app does not use accounts, we may only be able to assist with information we actually retain on our servers (if any) and with guidance for clearing data on your device.

## 12. International users

Our servers may be located outside your country of residence. By using network features of the app, you understand that information may be processed in the location where our hosting provider operates.

## 13. Changes

We may update this Privacy Policy from time to time. The “Last updated” date at the top will change when we do. Continued use of the app after an update means you acknowledge the revised policy.

## 14. Contact

Questions about this Privacy Policy: `[YOUR_PRIVACY_CONTACT_EMAIL]`
