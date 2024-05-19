# Upload Android Applications Screenshots to the Play Store

This action will help you upload the localised screenshots of Android applications to the Google Play Console using the Google Play Developer API v3.
It DOES NOT upload the application release files (.apk or .aab).

To upload the app itself, you can use [this action](https://github.com/marketplace/actions/upload-android-release-to-play-store).  
To upload the app localised title and description, you can use [this other action](https://github.com/marketplace/actions/upload-android-listings).

## Inputs

| Input | Description | Value | Required |
| --- | --- | --- | --- |
| serviceAccountJson | The service account json private key file to authorize the upload request. Can be used instead of `serviceAccountJsonPlainText` to specify a file rather than provide a secret | A path to a valid `service-account.json` file | `true` (or serviceAccountJsonPlainText) |
| serviceAccountJsonPlainText | The service account json in plain text, provided via a secret, etc | The contents of your `service-account.json` | `true` (or serviceAccountJson) |
| packageName | The package name, or Application Id, of the app you are uploading | A valid package name, e.g. `com.example.myapp`. The packageName must already exist in the play console account, so make sure you upload a manual apk or aab first through the console | `true` |
| language | The language localization code (BCP-47 language tag) of the image | A valid localization code managed by the Google Play Console. Check the available codes [here](https://support.google.com/googleplay/android-developer/answer/9844778?hl=en#zippy=%2Cview-list-of-available-languages) | `true` |
| imageType | The type of image to upload | `phoneScreenshots`, `sevenInchScreenshots`, `tenInchScreenshots`, `tvScreenshots`, `wearScreenshots`, `icon`, `featureGraphic` or `tvBanner`. List from [Google API documentation](https://developers.google.com/android-publisher/api-ref/rest/v3/AppImageType) | `true` |
| imageFiles | The list of images to upload | A `glob` string matching the images to upload | `true` |
| changesNotSentForReview | Indicates that the changes in this edit will not be reviewed until they are explicitly sent for review from the Google Play Console. Defaults to `false` | `true` or `false` | `false` |

## Example usage

The below example publishes the screenhots in italian of `MyApp` to Google Play.

```yaml
uses: gregoirekourdouli/upload-google-play-screenshot-image@v1.0.0
with:
  serviceAccountJsonPlainText: ${{ SERVICE_ACCOUNT_JSON }}
  packageName: com.example.MyApp
  language: it-IT
  imageType: sevenInchScreenshots
  imageFiles: 'screenshots/*it-IT*.png'
```

