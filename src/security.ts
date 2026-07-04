import CryptoJS from 'crypto-js';

// Standalone encryption key (in a production app, this would be derived from a user password)
const SECRET_KEY = 'builderbooks-local-secret';

export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error("Failed to decrypt data", e);
    return null;
  }
};

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
}

export const addAuditLog = (action: string, details: string) => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: Math.random().toString(36).substr(2, 9),
    action,
    timestamp: new Date().toISOString(),
    user: 'Admin',
    details
  };
  logs.unshift(newLog);
  if (logs.length > 100) logs.pop();
  localStorage.setItem('builderbooks_audit', JSON.stringify(logs));
};

export const getAuditLogs = (): AuditLog[] => {
  const saved = localStorage.getItem('builderbooks_audit');
  return saved ? JSON.parse(saved) : [];
};

export const generateBackup = (data: any) => {
  const encrypted = encryptData(data);
  const blob = new Blob([encrypted], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `builderbooks_secure_backup_${new Date().toISOString().split('T')[0]}.enc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addAuditLog('BACKUP_GENERATED', 'Manual encrypted backup generated');
};
