import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as GoogleSignIn from 'expo-google-sign-in';
import GDrive from 'react-native-google-drive-api-wrapper';
import Dialog from 'react-native-dialog';

type UploadState = "idle" | "confirming" | "sending" | "completed";
type User = GoogleSignIn.GoogleUser;

type UploadButtonProps = { uploadData: () => string, user: User };
const UploadButton = ({ uploadData, user }: UploadButtonProps) => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadStatus, setUploadStatus] = useState("");

  // TODO Rename to submitting
  const openConfirmationModal = () => {
    setUploadState("confirming");
  }

  const cancel = () => {
    setUploadState("idle");
    setUploadStatus("");
  }

  const upload = async () => {
    setUploadState("sending");

    const filename = "foo.csv"
    if (user.auth) {
      GDrive.setAccessToken(user.auth.accessToken);
      GDrive.init();
      const resp = await GDrive.files.createFileMultipart(
        uploadData(),
        "text/csv", {
          parent: ["root"],
          name: filename
        },
        false
      );

      if (resp.status === 200) {
        setUploadStatus('Upload successful!');
      } else {
        setUploadStatus(`Uh Oh! There was an error: ${JSON.stringify(resp)}`);
      }
    } else {
      setUploadStatus("Uh Oh! You weren't authenticated for some reason...");
    }

    setUploadState("completed");
  }

  const closeDialog = () => {
    setUploadState("idle");
    setUploadStatus("");
  }

  return (
    <>
      <TouchableOpacity onPress={openConfirmationModal}>
        <AntDesign name="upload" size={24} color="black" />
      </TouchableOpacity>

      {uploadState === "confirming" ?
      <View>
        <Dialog.Container visible={true}>
          <Dialog.Title>Submit Data</Dialog.Title>
          <Dialog.Description>
            {user.auth.accessToken}
            {/* Do you want to Score That Shit? */}
          </Dialog.Description>
          <Dialog.Input placeholder="filename" />
          <Dialog.Button label="Cancel" onPress={cancel}/>
          <Dialog.Button label="Upload" onPress={upload}/>
        </Dialog.Container>
      </View>
      :
      <View>
        <Dialog.Container visible={uploadState === "completed" || uploadState === "sending"}>
          {/* Awful hack */}
          <Dialog.Title>{uploadState === "idle" ? "" : uploadState}</Dialog.Title>
          <Dialog.Description>
            {uploadStatus}
          </Dialog.Description>
          <Dialog.Button label="Close" onPress={closeDialog}/>
        </Dialog.Container>
      </View>
      }
    </>
  );
}

export default UploadButton;
