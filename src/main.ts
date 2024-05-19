import * as core from '@actions/core'
import * as fs from "fs"
import { runUpload } from "./edits"
import { unlink, writeFile, readFile } from 'fs/promises'
import pTimeout from 'p-timeout'

export async function run() {
    try {
        const serviceAccountJson = core.getInput('serviceAccountJson', { required: false });
        const serviceAccountJsonRaw = core.getInput('serviceAccountJsonPlainText', { required: false});
        const packageName = core.getInput('packageName', { required: true });
		    const language = core.getInput('language', { required: true });
	      const imageType = core.getInput('imageType', { required: true });
	      const imageFiles = core.getInput('imageFiles', { required: true });
        const changesNotSentForReview = core.getInput('changesNotSentForReview', { required: false }) == 'true';

        await validateServiceAccountJson(serviceAccountJsonRaw, serviceAccountJson)
		
        await pTimeout(
            runUpload(
            packageName,
				    language, 
				    imageType,
				    imageFiles,
            changesNotSentForReview,
          ),
          {
              milliseconds: 3.6e+6
          }
        )
    } catch (error: unknown) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        } else {
            core.setFailed('Unknown error occurred.')
        }
    } finally {
        if (core.getInput('serviceAccountJsonPlainText', { required: false})) {
            // Cleanup our auth file that we created.
            core.debug('Cleaning up service account json file');
            await unlink('./serviceAccountJson.json');
        }
    }
}

async function validateServiceAccountJson(serviceAccountJsonRaw: string | undefined, serviceAccountJson: string | undefined): Promise<string | undefined> {
    if (serviceAccountJson && serviceAccountJsonRaw) {
        // If the user provided both, print a warning one will be ignored
        core.warning('Both \'serviceAccountJsonPlainText\' and \'serviceAccountJson\' were provided! \'serviceAccountJson\' will be ignored.')
    }

    if (serviceAccountJsonRaw) {
        // If the user has provided the raw plain text, then write to file and set appropriate env variable
        const serviceAccountFile = "./serviceAccountJson.json";
        await writeFile(serviceAccountFile, serviceAccountJsonRaw, {
            encoding: 'utf8'
        });
        core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountFile)
    } else if (serviceAccountJson) {
        // If the user has provided the json path, then set appropriate env variable
        core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountJson)
    } else {
        // If the user provided neither, fail and exit
        return Promise.reject("You must provide one of 'serviceAccountJsonPlainText' or 'serviceAccountJson' to use this action")
    }
}

void run();
