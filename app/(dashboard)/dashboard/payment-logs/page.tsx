"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PaymentLog, PaymentLogDisplay, PaymentLogFilters, SortField, SortOrder } from "@/app/types/paymentLog";
import paymentLogService from "@/app/components/service/paymentLog.service";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function PaymentLogsPage() {
  const router = useRouter();
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<PaymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<PaymentLog | null>(null);
  
  // Filters and search
  const [filters, setFilters] = useState<PaymentLogFilters>({
    searchTerm: "",
    statusFilter: "all",
    currencyFilter: "all"
  });
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchPaymentLogs = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Fetching payment logs...");
      console.log("Current token:", typeof window !== "undefined" ? localStorage.getItem("token") : "Server side");
      
      const response = await paymentLogService.getAllPaymentLogs();
      console.log("Payment logs fetched:", response);
      
      if (response?.data && Array.isArray(response.data)) {
        console.log("Setting payment logs from response.data:", response.data.length, "items");
        setPaymentLogs(response.data);
        setFilteredLogs(response.data);
      } else if (Array.isArray(response)) {
        console.log("Setting payment logs from direct array:", response.length, "items");
        setPaymentLogs(response);
        setFilteredLogs(response);
      } else if (response?.status === "success" && Array.isArray(response.data)) {
        console.log("Setting payment logs from success response:", response.data.length, "items");
        setPaymentLogs(response.data);
        setFilteredLogs(response.data);
      } else {
        console.log("Unexpected response format:", response);
        console.log("Response type:", typeof response);
        console.log("Response keys:", response ? Object.keys(response) : "null/undefined");
        setPaymentLogs([]);
        setFilteredLogs([]);
      }
    } catch (err: any) {
      console.error("Error fetching payment logs:", err);
      console.error("Error type:", typeof err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        console.error("Response headers:", err.response.headers);
      }
      
      setError(err.response?.data?.message || err.message || "Error fetching payment logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentLogs();
  }, []);

  // Filter and sort payment logs
  useEffect(() => {
    let filtered = [...paymentLogs];

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((log) =>
        log.customerName.toLowerCase().includes(searchTerm) ||
        log.customerEmail.toLowerCase().includes(searchTerm) ||
        log.sessionId.toLowerCase().includes(searchTerm) ||
        log.paymentIntentId.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.statusFilter !== "all") {
      filtered = filtered.filter((log) => 
        log.paymentStatus.toLowerCase() === filters.statusFilter.toLowerCase()
      );
    }

    // Apply currency filter
    if (filters.currencyFilter !== "all") {
      filtered = filtered.filter((log) => 
        log.currency.toLowerCase() === filters.currencyFilter.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === "amountTotal") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [paymentLogs, filters, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const handleViewDetails = (log: PaymentLog) => {
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
  };

  const getStatusBadgeColor = (status: string) => {
    return paymentLogService.getStatusBadgeColor(status);
  };

  const formatAmount = (amount: number, currency: string) => {
    return paymentLogService.formatAmount(amount, currency);
  };

  const formatDate = (dateString: string) => {
    return paymentLogService.formatDate(dateString);
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
            placeholder="Search by name, email, session ID..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Status
          </label>
          <select
            value={filters.statusFilter}
            onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="paid">Paid</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        {/* Currency Filter */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Currency
          </label>
          <select
            value={filters.currencyFilter}
            onChange={(e) => setFilters({ ...filters, currencyFilter: e.target.value })}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Currencies</option>
            <option value="usd">USD</option>
            <option value="cad">CAD</option>
            <option value="eur">EUR</option>
            <option value="gbp">GBP</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ searchTerm: "", statusFilter: "all", currencyFilter: "all" })}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("sessionId")}>
                Session ID
                {sortField === "sessionId" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("customerName")}>
                Customer
                {sortField === "customerName" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("amountTotal")}>
                Amount
                {sortField === "amountTotal" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("paymentStatus")}>
                Status
                {sortField === "paymentStatus" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)]" onClick={() => handleSort("createdAt")}>
                Date
                {sortField === "createdAt" && (
                  <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {currentLogs.map((log) => (
              <tr key={log._id} className="hover:bg-[var(--background)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <div className="font-mono text-xs">{log.sessionId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    {log.customerName}
                  </div>
                  <div className="text-sm text-[var(--foreground-muted)]">
                    {log.customerEmail}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  <div className="font-medium">{formatAmount(log.amountTotal, log.currency)}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    {log.currency.toUpperCase()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(log.paymentStatus)}`}>
                    {log.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                  {formatDate(log.createdAt)}
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
        Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} results
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
                Payment Log Details
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
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Session ID</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.sessionId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Payment Intent ID</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.paymentIntentId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Customer Name</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Customer Email</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.customerEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Customer Phone</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.customerPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Amount Total</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)] font-semibold">{formatAmount(selectedLog.amountTotal, selectedLog.currency)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Amount Subtotal</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{formatAmount(selectedLog.amountSubtotal, selectedLog.currency)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Currency</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.currency.toUpperCase()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Status</label>
                  <div className="bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedLog.paymentStatus)}`}>
                      {selectedLog.paymentStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">User ID</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.userId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Course ID</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.courseId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Schedule ID</label>
                  <p className="text-sm text-[var(--foreground)] font-mono bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{selectedLog.scheduleId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">Created At</label>
                  <p className="text-sm text-[var(--foreground)] bg-[var(--input-bg)] p-2 rounded-[var(--radius-md)]">{formatDate(selectedLog.createdAt)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-2">Billing Address</label>
                <div className="bg-[var(--input-bg)] p-4 rounded-[var(--radius-md)] text-sm text-[var(--foreground)] space-y-1">
                  <p className="font-medium">{selectedLog.billingAddress.line1}</p>
                  {selectedLog.billingAddress.line2 && <p>{selectedLog.billingAddress.line2}</p>}
                  <p>{selectedLog.billingAddress.city}, {selectedLog.billingAddress.state} {selectedLog.billingAddress.postal_code}</p>
                  <p>{selectedLog.billingAddress.country}</p>
                </div>
              </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Payment Logs</h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Manage and view all payment transactions
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchPaymentLogs()}
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
          {filteredLogs.length} payment log{filteredLogs.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Table */}
      {currentLogs.length > 0 ? (
        <>
          {renderTable()}
          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-[var(--foreground-muted)] text-lg">No payment logs found</div>
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