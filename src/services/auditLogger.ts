import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import type { AuditLogEntry } from '../types/product';

export async function recordAuditLog(params: {
  action: 'create' | 'update' | 'delete' | 'status_toggle' | 'seed';
  admin_email: string;
  admin_uid?: string;
  target_id: string;
  target_title: string;
  details?: Record<string, any>;
}): Promise<AuditLogEntry> {
  const timestamp = new Date().toISOString();
  const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const logEntry: AuditLogEntry = {
    id,
    action: params.action,
    admin_email: params.admin_email || 'unknown_admin@navidhapearls.com',
    admin_uid: params.admin_uid || '',
    target_id: params.target_id,
    target_title: params.target_title || 'Untitled Product',
    details: params.details || {},
    timestamp,
  };

  try {
    await setDoc(doc(db, 'audit_logs', id), logEntry);
    console.log(`[AuditLog] Logged ${params.action.toUpperCase()} for ${params.target_id} by ${params.admin_email}`);
  } catch (err) {
    console.warn('[AuditLog] Firestore logging failed, recording in local log:', err);
    try {
      handleFirestoreError(err, OperationType.CREATE, `audit_logs/${id}`);
    } catch {}
  }

  return logEntry;
}

export async function fetchAuditLogs(maxCount = 50): Promise<AuditLogEntry[]> {
  try {
    const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(maxCount));
    const snap = await getDocs(q);
    const logs: AuditLogEntry[] = [];
    snap.forEach((d) => {
      logs.push(d.data() as AuditLogEntry);
    });
    if (logs.length > 0) {
      return logs;
    }
  } catch (err) {
    console.warn('[AuditLog] Failed to fetch audit logs directly from Firestore:', err);
  }

  // Fallback to server REST API /api/audit-logs
  try {
    const res = await fetch('/api/audit-logs', {
      headers: {
        'x-admin-email': 'navidha.pearls@gmail.com',
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.logs) && data.logs.length > 0) {
        return data.logs;
      }
    }
  } catch (apiErr) {
    console.warn('[AuditLog] Failed to fetch from /api/audit-logs:', apiErr);
  }

  return [];
}
