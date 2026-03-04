# Guide: Pushing Updates to Your Verbatim APK

Since we've moved the PDF API to Vercel and added security keys, you need to create a new APK so your app knows how to talk to the live server.

## Step 1: Upload your Secret Key to EAS
EAS (Expo Application Services) builds your app in the cloud. It doesn't see your local `.env` file automatically, so you must add the secret key to your project settings.

### Option A: Via the Website (Recommended)
1. Go to [expo.dev](https://expo.dev) and select your **verbatim** project.
2. Go to **Project Settings** -> **Environment Variables**.
3. Click **Create** and add:
   - **Name:** `EXPO_PUBLIC_PDF_API_KEY`
   - **Value:** `q35hBBVcJZQeSHD2pjIyCTs9`
4. Select the **Preview** environment (and Development/Production if you like).
5. Click **Save**.

### Option B: Via the Terminal
Run this command:
```bash
eas secret:create --name EXPO_PUBLIC_PDF_API_KEY --value q35hBBVcJZQeSHD2pjIyCTs9 --scope project
```

## Step 2: (Optional) Update Version Number
If you want to keep track of your versions, open `app.json` and increase the version number:
```json
"version": "1.0.1",
"android": {
  "versionCode": 2,
  ...
}
```

## Step 3: Run the Build Command
To generate a new APK (like you did before), run your preview build command:

```bash
eas build -p android --profile preview
```

## Step 4: Download and Install
1. Once the build finishes, EAS will give you a **URL** or a **QR Code**.
2. Open that URL on your Android device.
3. Download the new `.apk` file.
4. **Important:** You may need to uninstall the old version of Verbatim before installing this new one to avoid "App not installed" errors.

---

### Verification Checklist
After installing the new APK, test the PDF upload:
- [ ] Ensure you have an active internet connection.
- [ ] Try uploading a PDF.
- [ ] It should now extract text using your live Vercel API!
