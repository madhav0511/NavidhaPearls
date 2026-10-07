import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Filter,
  FileText
} from 'lucide-react';
import type { AuditLogEntry } from '../../types/product';
import { fetchAuditLogs } from '../../services/auditLogger';

interface AuditLogTableProps {
  adminEmail: string;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ adminEmail }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAuditLogs(100);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.target_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider rounded-xs">
            CREATE
          </span>
        );
      case 'update':
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold uppercase tracking-wider rounded-xs">
            UPDATE
          </span>
        );
      case 'delete':
        return (
          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-bold uppercase tracking-wider rounded-xs">
            DELETE
          </span>
        );
      case 'status_toggle':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider rounded-xs">
            STATUS TOGGLE
          </span>
        );
      case 'seed':
        return (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold uppercase tracking-wider rounded-xs">
            SEED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[9px] font-bold uppercase tracking-wider rounded-xs">
            {action.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#14202e]/10 rounded-[2px] shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#14202e]/10">
        <div>
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#9a7a3e]" />
            <h3 className="font-serif text-lg text-[#14202e] font-medium">
              Administrator Security Audit Trail
            </h3>
          </div>
          <p className="text-xs text-[#667383] mt-0.5">
            Cryptographically timestamped record of every create, update, and delete action in Firestore.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#14202e]/20 text-[#14202e] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#fbf9f5] cursor-pointer"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by admin email, title, or ID..."
            className="w-full pl-9 pr-3 py-2 bg-[#fbf9f5] border border-[#14202e]/15 rounded-xs text-[#14202e] focus:outline-none focus:border-[#9a7a3e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[#77808a] uppercase text-[10px] font-semibold">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#fbf9f5] border border-[#14202e]/15 rounded-xs text-[#14202e] focus:outline-none"
          >
            <option value="all">All Actions ({logs.length})</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="status_toggle">Status Toggle</option>
            <option value="seed">Seed</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-[#14202e]/10 rounded-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#fbf9f5] border-b border-[#14202e]/10 text-[10px] uppercase tracking-[0.16em] text-[#77808a]">
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Administrator</th>
              <th className="py-3 px-4">Target Product</th>
              <th className="py-3 px-4">Details / Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#14202e]/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#14202e]/30 border-t-[#14202e] rounded-full animate-spin" />
                    <span>Loading Firestore Audit Trail...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  <p className="font-serif text-sm text-[#14202e]">No audit log entries recorded yet</p>
                  <p className="text-[11px] text-[#888888] mt-1">
                    Every create, update, and delete operation performed will be immutably recorded here.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#fbf9f5]/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#555555] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}{' '}
                    IST
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{getActionBadge(log.action)}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-[#14202e] font-medium block">
                      {log.admin_email}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#14202e] block leading-snug">
                      {log.target_title}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400 block">{log.target_id}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-gray-600 max-w-xs truncate">
                    {log.details && Object.keys(log.details).length > 0 ? (
                      <span title={JSON.stringify(log.details)}>
                        {JSON.stringify(log.details).slice(0, 60)}...
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
