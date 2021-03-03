import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import { uploadFile } from './GDrive';
import retrieveAccessToken from './Auth';

type UploadState = "idle" | "uploading" | "sending" | "completed";

type UploadButtonProps = { uploadData: () => string };
const UploadButton = ({ uploadData }: UploadButtonProps) => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadStatus, setUploadStatus] = useState("");
  const [filename, setFilename] = useState("");

  const openConfirmationModal = () => {
    setUploadState("uploading");
  }

  const cancel = () => {
    setUploadState("idle");
    setUploadStatus("");
  }

  const upload = async () => {
    setUploadState("sending");

    const accessToken = await retrieveAccessToken();
    if (accessToken !== "") {
      const resp = await uploadFile(filename, uploadData(), accessToken);
      if (resp.status === 200) {
        setUploadStatus('Upload successful!');
      } else {
        setUploadStatus(`Uh Oh! There was an error: ${resp.json()}`);
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

      {uploadState === "uploading" ?
      <View>
        <Dialog.Container visible={true}>
          <Dialog.Title>Submit Data</Dialog.Title>
          <Dialog.Description>
            Do you want to Score That Shit?
          </Dialog.Description>
          <Dialog.Input placeholder="filename" onChangeText={setFilename}/>
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
