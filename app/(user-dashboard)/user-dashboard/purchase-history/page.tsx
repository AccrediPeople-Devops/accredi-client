"use client";

import React, { useState, useEffect } from "react";
import { 
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineEye,
  HiOutlineDownload,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineRefresh
} from "react-icons/hi";
import UserProfileService, { NewPurchaseHistoryResponse, PurchaseHistoryItem } from "@/app/components/user-dashboard/services/userProfile.service";
import { Transaction, SortField, SortOrder } from "@/app/types/purchaseHistory";

export default function PurchaseHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('paymentDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const fetchPurchaseHistory = async () => {
    console.log("🔍 PURCHASE HISTORY: Fetching purchase history from API...");
    setIsLoading(true);
    setError('');
    
    try {
      const response = await UserProfileService.getPurchaseHistory();
      console.log("📡 PURCHASE HISTORY: API Response:", response);
      
      if (response.status && response.history) {
        // Transform backend data to match frontend interface
        const transformedTransactions: Transaction[] = response.history.map((item) => ({
          id: item._id,
          transactionId: item.paymentIntentId || item.sessionId,
          amountPaid: item.amountTotal,
          currency: item.currency.toUpperCase(),
          paymentStatus: item.paymentStatus === 'paid' ? 'completed' : 
                        item.status === 'complete' ? 'completed' : 
                        item.paymentStatus as Transaction['paymentStatus'],
          paymentDate: item.createdAt,
          orderDetails: {
            courseName: `Course - ${item.courseId}`, // This would need course name lookup
            courseType: item.scheduleType === 'online' ? 'Instructor-Led Live Online' : 'Classroom Training',
            quantity: 1,
            courseId: item.courseId,
            scheduleId: item.scheduleId
          },
          paymentMethod: 'Card Payment', // Default as not provided in response
          customerInfo: {
            name: item.customerName,
            email: item.customerEmail,
            phone: item.customerPhone
          },
          billingAddress: {
            line1: item.billingAddress.line1,
            line2: item.billingAddress.line2,
            city: item.billingAddress.city,
            state: item.billingAddress.state,
            country: item.billingAddress.country,
            postalCode: item.billingAddress.postal_code
          }
        }));

        console.log("✅ PURCHASE HISTORY: Transformed data:", transformedTransactions);
        setTransactions(transformedTransactions);
        setFilteredTransactions(transformedTransactions);
      } else {
        console.log("⚠️ PURCHASE HISTORY: No history data found");
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (error: any) {
      console.error("❌ PURCHASE HISTORY: Error fetching data:", error);
      setError(error.response?.data?.message || error.message || "Failed to load purchase history");
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = transactions.filter(transaction =>
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderDetails.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, transactions]);

  // Sorting functionality
  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sorted = [...filteredTransactions].sort((a, b) => {
      let aValue: any = a[field];
      let bValue: any = b[field];

      if (field === 'paymentDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (field === 'amountPaid') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (newOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTransactions(sorted);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusIcon = (status: Transaction['paymentStatus']) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'complete':
        return <HiOutlineCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'pending':
        return <HiOutlineClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'failed':
        return <HiOutlineXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'refunded':
        return <HiOutlineXCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <HiOutlineClock className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: Transaction['paymentStatus']) => {
    switch (status) {
      case 'completed':
      case 'paid':
      case 'complete':
        return 'text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/20';
      case 'refunded':
        return 'text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    // Handle different currency formats
    const currencyCode = currency.toUpperCase();
    
    if (currencyCode === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <HiOutlineChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' 
      ? <HiOutlineChevronUp className="w-4 h-4 text-[var(--primary)]" />
      : <HiOutlineChevronDown className="w-4 h-4 text-[var(--primary)]" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading purchase history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Payments History</h1>
          <p className="text-[var(--foreground-muted)]">View your transaction history and download invoices</p>
        </div>
        
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="text-center py-12">
            <HiOutlineXCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">Failed to Load Purchase History</h3>
            <p className="text-[var(--foreground-muted)] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary)]/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Payments History</h1>
            <p className="text-[var(--foreground-muted)]">View your transaction history and download invoices</p>
          </div>
          <button
            onClick={fetchPurchaseHistory}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Show entries */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground)]">Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-[var(--foreground)]">entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground)]">Search:</span>
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th 
                  className="text-left py-3 px-4 font-medium text-[var(--foreground)] cursor-pointer hover:bg-[var(--border)] transition-colors"
                  onClick={() => handleSort('transactionId')}
                >
                  <div className="flex items-center gap-2">
                    Transaction Id
                    {getSortIcon('transactionId')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-[var(--foreground)] cursor-pointer hover:bg-[var(--border)] transition-colors"
                  onClick={() => handleSort('amountPaid')}
                >
                  <div className="flex items-center gap-2">
                    Amount Paid
                    {getSortIcon('amountPaid')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-[var(--foreground)] cursor-pointer hover:bg-[var(--border)] transition-colors"
                  onClick={() => handleSort('paymentStatus')}
                >
                  <div className="flex items-center gap-2">
                    Payment Status
                    {getSortIcon('paymentStatus')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-[var(--foreground)] cursor-pointer hover:bg-[var(--border)] transition-colors"
                  onClick={() => handleSort('paymentDate')}
                >
                  <div className="flex items-center gap-2">
                    Payment Date
                    {getSortIcon('paymentDate')}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">
                  Order Details
                </th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">
                  Customer Info
                </th>
                <th className="text-left py-3 px-4 font-medium text-[var(--foreground)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="text-center">
                      <HiOutlineXCircle className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                        {error ? 'Unable to load purchase history' : 'No transactions found'}
                      </h3>
                      <p className="text-[var(--foreground-muted)] mb-4">
                        {error 
                          ? 'There was an error loading your purchase history. Please try refreshing the page.'
                          : searchTerm 
                            ? 'No transactions found matching your search criteria. Try adjusting your search terms.'
                            : 'You have not made any purchases yet. Browse our courses to get started!'
                        }
                      </p>
                      {!error && !searchTerm && (
                        <button
                          onClick={() => window.location.href = '/courses'}
                          className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-text)] rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors duration-200"
                        >
                          Browse Courses
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[var(--border)] hover:bg-[var(--border)] transition-colors">
                    <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                      <div className="font-mono text-xs">
                        {transaction.transactionId}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--foreground)] font-medium">
                      {formatAmount(transaction.amountPaid, transaction.currency)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.paymentStatus)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.paymentStatus)}`}>
                          {transaction.paymentStatus === 'paid' ? 'completed' : transaction.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--foreground)]">
                      {formatDate(transaction.paymentDate)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div>
                        <div className="font-medium text-[var(--foreground)]">
                          {transaction.orderDetails.courseName}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-xs">
                          {transaction.orderDetails.courseType} • Qty: {transaction.orderDetails.quantity}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-xs">
                          {transaction.paymentMethod}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-xs mt-1 pt-1 border-t border-[var(--border)]">
                          <div>Course ID: {transaction.orderDetails.courseId}</div>
                          <div>Schedule ID: {transaction.orderDetails.scheduleId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div>
                        <div className="font-medium text-[var(--foreground)]">
                          {transaction.customerInfo.name}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-xs">
                          {transaction.customerInfo.email}
                        </div>
                        <div className="text-[var(--foreground-muted)] text-xs">
                          {transaction.customerInfo.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                          title="View Details"
                          onClick={() => {
                            // You can implement a modal or detailed view here
                            console.log('View transaction details:', transaction);
                          }}
                        >
                          <HiOutlineEye className="w-4 h-4" />
                        </button>
                        {transaction.invoiceUrl && (
                          <button
                            className="p-1 text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                            title="Download Invoice"
                            onClick={() => {
                              // Implement invoice download
                              console.log('Download invoice for:', transaction.transactionId);
                            }}
                          >
                            <HiOutlineDownload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-[var(--foreground-muted)]">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] text-sm hover:bg-[var(--border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm rounded-[var(--radius-md)] transition-colors ${
                      currentPage === pageNum
                        ? 'bg-[var(--primary)] text-[var(--primary-text)]'
                        : 'bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-[var(--border)]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--input-bg)] text-[var(--foreground)] text-sm hover:bg-[var(--border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 