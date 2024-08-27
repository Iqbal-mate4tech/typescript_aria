import AWS from 'aws-sdk';

// AWS configuration
AWS.config.update({
  s3BucketEndpoint: true,
  endpoint: 'https://aria-images.us-east-1.linodeobjects.com/',
  region: 'us-east-1',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
});

const S3_BUCKET = 'aria-images';

export const uploadFilesToS3 = (files: FileList): void => {
  Array.from(files).forEach((file) => {
    const fileParts = file.name.split('.');

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: S3_BUCKET,
        Key: `${fileParts[0]}.jpg`,
        Body: file,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
      },
    });

    upload.promise().then(
      (data) => {
        console.log('Upload successful:', data);
      },
      (err) => {
        console.error('Upload error:', err);
      }
    );
  });
};
