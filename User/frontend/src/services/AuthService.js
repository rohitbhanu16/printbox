/*import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: "404871806992-g8o3cu6pvuht9bro52krg9amvg6vl6bl.apps.googleusercontent.com",
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return null;
  }
}

export const signInWithGitHub = async (githubToken) => {
  try {
    const githubCredential = auth.GithubAuthProvider.credential(githubToken);
    return auth().signInWithCredential(githubCredential);
  } catch (error) {
    console.error('GitHub Sign-In Error:', error);
    return null;
  }
};*/