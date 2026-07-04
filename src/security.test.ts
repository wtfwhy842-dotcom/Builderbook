import { describe, it, expect, beforeEach } from 'vitest';
import { encryptData, decryptData, addAuditLog, getAuditLogs } from './security';

describe('Security & Encryption', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should encrypt and decrypt data correctly', () => {
    const originalData = { secret: 'this is a test', value: 42 };
    const encrypted = encryptData(originalData);
    
    expect(encrypted).not.toEqual(JSON.stringify(originalData));
    expect(typeof encrypted).toBe('string');

    const decrypted = decryptData(encrypted);
    expect(decrypted).toEqual(originalData);
  });

  it('should handle invalid decryption gracefully', () => {
    const result = decryptData('invalid_ciphertext');
    expect(result).toBeNull();
  });

  it('should add and retrieve audit logs', () => {
    addAuditLog('TEST_ACTION', 'This is a test log');
    const logs = getAuditLogs();
    
    expect(logs).toHaveLength(1);
    expect(logs[0].action).toBe('TEST_ACTION');
    expect(logs[0].details).toBe('This is a test log');
    expect(logs[0].user).toBe('Admin');
  });

  it('should limit audit logs to 100 entries', () => {
    for (let i = 0; i < 105; i++) {
      addAuditLog('TEST_ACTION', `Log ${i}`);
    }
    const logs = getAuditLogs();
    expect(logs).toHaveLength(100);
    // The most recent should be at index 0 (Log 104)
    expect(logs[0].details).toBe('Log 104');
    expect(logs[99].details).toBe('Log 5');
  });
});
