"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminAuditLog, AdminAuditLogFilters, AdminAuditLogParams, SortField, SortOrder, ACTION_TYPES, ACTION_METHODS } from "@/app/types/adminAuditLog";
import adminAuditLogService from "@/app/components/service/adminAuditLog.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);
  
  // Check if user is super admin (you may need to adjust this based on your auth system)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Filters and search
  const [filters, setFilters] = useState<AdminAuditLogFilters>({
    searchTerm: "",
    actionFilter: "all",
    actionTypeFilter: "all"
  });
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Check user permissions on component mount
  useEffect(() => {
    // TODO: Replace this with your actual super admin check
    // This could come from your auth context, user profile, or token
    const checkSuperAdminStatus = () => {
      // Example: Check from localStorage, context, or API call
      const userRole = localStorage.getItem("userRole");
      const isSuperAdminUser = userRole === "SUPER_ADMIN" || userRole === "super_admin";
      setIsSuperAdmin(isSuperAdminUser);
      
      if (!isSuperAdminUser) {
        setIsLoading(false);
        setError("Access denied. Super admin privileges required.");
      }
    };

    checkSuperAdminStatus();
  }, []);

  const fetchAuditLogs = async () => {
    if (!isSuperAdmin) return;
    
    setIsLoading(true);
    setError("");
    try {
      console.log("Fetching admin audit logs...");
      const params: AdminAuditLogParams = {
        page: currentPage,
        limit: itemsPerPage,
        sortOrder: sortOrder === "desc" ? -1 : 1,
      };

      // Add filters to params if they are set
      if (filters.actionFilter !== "all") {
        params.action = filters.actionFilter as any;
      }
      if (filters.actionTypeFilter !== "all") {
        params.actionType = filters.actionTypeFilter as any;
      }

      const response = await adminAuditLogService.getAdminAuditLogs(params);
      console.log("Admin audit logs fetched:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        console.log("Setting audit logs from response.data:", response.data.length, "items");
        setAuditLogs(response.data);
        setFilteredLogs(response.data);
        setTotalCount(response.totalCount || response.data.length);
        setTotalPages(response.totalPages || Math.ceil((response.totalCount || response.data.length) / itemsPerPage));
      } else if (Array.isArray(response)) {
        console.log("Setting audit logs from direct array:", response.length, "items");
        setAuditLogs(response);
        setFilteredLogs(response);
        setTotalCount(response.length);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } else {
        console.log("Unexpected response format:", response);
        setAuditLogs([]);
        setFilteredLogs([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err: any) {
      console.error("Error fetching admin audit logs:", err);
      setError(err.response?.data?.message || err.message || "Error fetching admin audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAuditLogs();
    }
  }, [isSuperAdmin, currentPage, sortField, sortOrder]);

  // Filter and sort audit logs (client-side filtering for search term)
  useEffect(() => {
    let filtered = [...auditLogs];

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((log) =>
        (log.userName && log.userName.toLowerCase().includes(searchTerm)) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm)) ||
        log.action.toLowerCase().includes(searchTerm) ||
        log.actionType.toLowerCase().includes(searchTerm) ||
        (log.targetId && log.targetId.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredLogs(filtered);
  }, [auditLogs, filters.searchTerm]);

  const handleViewDetails = (log: AdminAuditLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const getActionBadgeColor = (actionType: string) => {
    return adminAuditLogService.getActionBadgeColor(actionType);
  };

  const getEntityBadgeColor = (action: string) => {
    return adminAuditLogService.getEntityBadgeColor(action);
  };

  const formatDate = (dateString: string) => {
    return adminAuditLogService.formatDate(dateString);
  };

  const formatActionType = (actionType: string) => {
    return adminAuditLogService.formatActionType(actionType);
  };

  const renderFilters = () => (
    <div className="bg-[var(--input-bg)] rounded-[var(--radius-lg)] p-4 mb-6 border border-[var(--border)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by user, action, target..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Action Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Entity
          </label>
          <select
            value={filters.actionFilter}
            onChange={(e) => setFilters({ ...filters, actionFilter: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Entities</option>
            {Object.entries(ACTION_TYPES).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
        </div>

        {/* Action Type Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Action Type
          </label>
          <select
            value={filters.actionTypeFilter}
            onChange={(e) => setFilters({ ...filters, actionTypeFilter: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Actions</option>
            {Object.entries(ACTION_METHODS).map(([key, value]) => (
              <option key={key} value={value}>{formatActionType(value)}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ searchTerm: "", actionFilter: "all", actionTypeFilter: "all" })}
            className="w-full px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="bg-[var(--input-bg)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--background)] border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("timestamp")}>
                Timestamp
                {sortField === "timestamp" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("userName")}>
                User
                {sortField === "userName" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("action")}>
                Entity
                {sortField === "action" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("actionType")}>
                Action
                {sortField === "actionType" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--background)] divide-y divide-[var(--border)]">
            {filteredLogs.map((log) => (
              <tr key={log._id} className="hover:bg-[var(--input-bg)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--foreground)]">
                    <div className="font-medium">{log.userName || 'Unknown User'}</div>
                    <div className="text-[var(--foreground-muted)]">{log.userEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(log.actionType)}`}>
                    {formatActionType(log.actionType)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <div>
                    <div className="font-mono text-xs">{log.targetId}</div>
                    {log.targetType && <div className="text-[var(--foreground-muted)]">{log.targetType}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)] font-mono">
                  {log.ipAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(log)}
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-[var(--foreground-muted)]">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--input-bg)]"
        >
          Previous
        </button>
        <span className="px-3 py-2 text-sm text-[var(--foreground)]">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--input-bg)]"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderDetailsModal = () => (
    <>
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDetailsModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-[var(--background)] rounded-[var(--radius-lg)] p-6 max-w-4xl w-full mx-4 shadow-[var(--shadow-lg)] transform transition-all max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[var(--foreground)]">
                Admin Audit Log Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Timestamp</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{formatDate(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">User</label>
                  <div className="bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">
                    <p className="text-sm text-[var(--foreground)] font-medium">{selectedLog.userName || 'Unknown User'}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{selectedLog.userEmail}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Entity</label>
                  <div className="bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntityBadgeColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Action Type</label>
                  <div className="bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionBadgeColor(selectedLog.actionType)}`}>
                      {formatActionType(selectedLog.actionType)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Target ID</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.targetId || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Target Type</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.targetType || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">IP Address</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">User Agent</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)] break-all">{selectedLog.userAgent || 'N/A'}</p>
                </div>
              </div>

              {selectedLog.details && (
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">Details</label>
                  <div className="bg-[var(--input-bg)] p-4 rounded-[var(--radius-md)]">
                    <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Access Denied</div>
          <p className="text-[var(--foreground-muted)]">
            Super admin privileges are required to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Admin Audit Logs</h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Monitor all administrative actions and system changes
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchAuditLogs()}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[var(--radius-md)]">
          {error}
        </div>
      )}

      {/* Filters */}
      {renderFilters()}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--foreground-muted)]">
          {totalCount} audit log{totalCount !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Table */}
      {filteredLogs.length > 0 ? (
        <>
          {renderTable()}
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-[var(--foreground-muted)] text-lg">No audit logs found</div>
          <p className="text-[var(--foreground-muted)] mt-2">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Details Modal */}
      {renderDetailsModal()}
    </div>
  );
} 