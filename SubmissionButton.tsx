import React, { useState } from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';

type SubmitState = "idle" | "confirming" | "sending" | "completed";

type SubmitButtonProps = {
  ButtonView: React.FC<{ onPress: () => void}>,
  submit: (name: string) => Promise<string>
  confirmTitle: string,
  confirmYes: string,
};
const SubmitButton = ({ ButtonView, submit, confirmTitle, confirmYes }: SubmitButtonProps) => {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitStatus, setSubmitStatus] = useState("");
  const [filename, setFilename] = useState("");

  const openConfirmationModal = () => {
    setSubmitState("confirming");
  }

  const cancel = () => {
    setSubmitState("idle");
    setSubmitStatus("");
  }

  const submitAction = async () => {
    setSubmitState("sending");
    setSubmitStatus(await submit(filename));
    setSubmitState("completed");
  }

  const closeDialog = () => {
    setSubmitState("idle");
    setSubmitStatus("");
  }

  return (
    <>
      <ButtonView onPress={openConfirmationModal} />
      {submitState === "confirming" ?
      <View>
        <Dialog.Container visible={true}>
          <Dialog.Title>{confirmTitle}</Dialog.Title>
          <Dialog.Description>
            Do you want to Score That Shit?
          </Dialog.Description>
          <Dialog.Input placeholder="filename" onChangeText={setFilename}/>
          <Dialog.Button label="Cancel" onPress={cancel}/>
          <Dialog.Button label={confirmYes} onPress={submitAction}/>
        </Dialog.Container>
      </View>
      :
      <View>
        <Dialog.Container visible={submitState === "completed" || submitState === "sending"}>
          {/* Awful hack */}
          <Dialog.Title>{submitState === "idle" ? "" : submitState}</Dialog.Title>
          <Dialog.Description>
            {submitStatus}
          </Dialog.Description>
          <Dialog.Button label="Close" onPress={closeDialog}/>
        </Dialog.Container>
      </View>
      }
    </>
  );
}

export default SubmitButton;
