import React, { useState } from 'react';
import Dialog from 'react-native-dialog';

type SubmitState = "idle" | "confirming" | "submitting" | "completed";

type SubmitButtonProps = {
  ButtonView: React.FC<{ onPress: () => void}>,
  submit: (name: string) => Promise<string>
  confirmTitle: string,
  confirmYes: string,
  placeholder: string,
};
const SubmitButton = ({
  ButtonView, submit, confirmTitle, confirmYes, placeholder
}: SubmitButtonProps) => {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitStatus, setSubmitStatus] = useState("");
  const [name, setName] = useState("");

  const openConfirmationModal = () => {
    setSubmitState("confirming");
  }

  const cancel = () => {
    setSubmitState("idle");
    setSubmitStatus("");
  }

  const submitAction = async () => {
    setSubmitState("submitting");
    setSubmitStatus(await submit(name));
    setSubmitState("completed");
  }

  const closeDialog = () => {
    setSubmitState("idle");
    setSubmitStatus("");
  }

  const renderDialog = () => {
    if (submitState === "confirming") {
      return (
        <Dialog.Container visible={true}>
          <Dialog.Title>{confirmTitle}</Dialog.Title>
          <Dialog.Description>
            Do you want to Score That Shit?
          </Dialog.Description>
          <Dialog.Input placeholder={placeholder} onChangeText={setName}/>
          <Dialog.Button label="Cancel" onPress={cancel}/>
          <Dialog.Button label={confirmYes} onPress={submitAction}/>
        </Dialog.Container>
      );
    } else if (submitState === "completed" || submitState === "submitting") {
      return (
        <Dialog.Container visible={true}>
          <Dialog.Title>{submitState}</Dialog.Title>
          <Dialog.Description>{submitStatus}</Dialog.Description>
          <Dialog.Button label="Close" onPress={closeDialog}/>
        </Dialog.Container>
      );
    }
  }

  return (
    <>
      <ButtonView onPress={openConfirmationModal} />
      {renderDialog()}
    </>
  );
}

export default SubmitButton;
