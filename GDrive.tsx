const uploadFile = async (filename: string, data: string, accessToken: string) => {
  const boundary = "foo_bar";
  const metadata = {
    name: filename
  };
  const body = `
--${boundary}
Content-Type: application/json

${JSON.stringify(metadata)}
--${boundary}
Content-Type: text/csv

${data}
--${boundary}--
`;

  return await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': `${body.length}`
    },
    body
  });
}

export { uploadFile };
