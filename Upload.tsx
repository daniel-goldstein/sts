import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { uploadFile } from './GDrive';
import retrieveAccessToken from './Auth';
import SubmitButton from './SubmissionButton';

type UploadButtonProps = { uploadData: () => string };
const UploadButton = ({ uploadData }: UploadButtonProps) => {

  const upload = async (filename: string): Promise<string> => {
    const accessToken = await retrieveAccessToken();
    if (accessToken !== "") {
      const resp = await uploadFile(filename, uploadData(), accessToken);
      if (resp.status === 200) {
        return 'Upload successful!';
      } else {
        return `Uh Oh! There was an error: ${resp.json()}`;
      }
    } else {
      return "Uh Oh! You weren't authenticated for some reason...";
    }
  }

  const ButtonView = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <AntDesign name="upload" size={24} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <SubmitButton
      confirmTitle={'Upload Trial'}
      confirmYes={'Upload'}
      ButtonView={ButtonView}
      submit={upload} />
  );
}

export default UploadButton;
