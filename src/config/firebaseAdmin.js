const firebaseAdmin = require('firebase-admin');
const config = require('./index');

const firebaseConfig = {
  type: 'service_account',
  project_id: 'medre-9f7f5',
  private_key_id: config.firebaseAdmin.privateKeyId,
  private_key: config.firebaseAdmin.privateKey,
  client_email: 'firebase-adminsdk-wf3nk@medre-9f7f5.iam.gserviceaccount.com',
  client_id: '107274786800091213275',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wf3nk%40medre-9f7f5.iam.gserviceaccount.com',
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  projectId: 'medre-9f7f5',
  storageBucket: config.firebaseAdmin.storageBucket,
});

module.exports = firebaseAdmin;
