import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

// Projeto do Firebase usado pelo app. O Firestore encontra o banco pelo projectId.
// Para a configuração completa, copie apiKey, messagingSenderId e appId em
// Firebase Console > Configurações do projeto > Seus apps e acrescente aqui.
const firebaseConfig = {
  authDomain: "silkpets-1f7d6.firebaseapp.com",
  projectId: "silkpets-1f7d6",
  storageBucket: "silkpets-1f7d6.firebasestorage.app"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// No celular o long polling é necessário; no navegador a conexão padrão é mais rápida.
const opcoes = Platform.OS === 'web' ? {} : { experimentalForceLongPolling: true };

let banco;
try {
  banco = initializeFirestore(app, opcoes);
} catch (erro) {
  banco = getFirestore(app);
}

export const db = banco;
