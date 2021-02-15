import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import GDrive from 'react-native-google-drive-api-wrapper';

type UploadButtonProps = { uploadData: () => string };
const UploadButton = ({ uploadData }: UploadButtonProps) => {

  useEffect(() => {

  });

  const onPress = () => {
    alert(uploadData());
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <AntDesign name="upload" size={24} color="black" />
    </TouchableOpacity>
  );
}

export default UploadButton;
