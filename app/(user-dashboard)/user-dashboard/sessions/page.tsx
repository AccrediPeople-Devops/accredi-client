"use client";

import React, { useState, useEffect } from "react";
import { 
  HiOutlineVideoCamera, 
  HiOutlineFolder, 
  HiOutlineLink,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineExternalLink
} from "react-icons/hi";
import userProfileService, { UserLink } from "@/app/components/user-dashboard/services/userProfile.service";

interface Session {
  id: string;
  type: 'google-drive' | 'zoom-meeting' | 'self-paced' | 'live-session';
  title: string;
  description?: string;
  url: string;
  status: 'active' | 'upcoming' | 'completed';
  date?: string;
  time?: string;
  duration?: string;
  instructor?: string;
  courseId?: string;
  scheduleId?: string;
  name?: string;
}

export default function SessionDetailsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  // Transform UserLink to Session
  const transformLinkToSession = (link: UserLink): Session => {
    // Determine session type based on link name or URL
    let type: Session['type'] = 'live-session';
    if (link.name.toLowerCase().includes('drive') || link.link.includes('drive.google.com')) {
      type = 'google-drive';
    } else if (link.name.toLowerCase().includes('zoom') || link.link.includes('zoom.us')) {
      type = 'zoom-meeting';
    } else if (link.name.toLowerCase().includes('self') || link.name.toLowerCase().includes('paced')) {
      type = 'self-paced';
    } else if (link.link.includes('meet.google.com')) {
      type = 'zoom-meeting'; // Treat Google Meet as similar to Zoom
    }

    // Determine status based on isActive and other factors
    let status: Session['status'] = link.isActive ? 'active' : 'completed';
    
    // Format title based on name and type
    let title = link.name || 'Session Link';
    if (type === 'google-drive') {
      title = title.includes('Drive') ? title : `${title} - Google Drive`;
    } else if (type === 'zoom-meeting') {
      if (link.link.includes('meet.google.com')) {
        title = title.includes('Meet') ? title : `${title} - Google Meet`;
      } else {
        title = title.includes('Zoom') ? title : `${title} - Zoom Meeting`;
      }
    }
    
    return {
      id: link._id,
      type,
      title: title,
      url: link.link,
      status,
      courseId: link.courseId,
      scheduleId: link.scheduleId,
      name: link.name,
      date: new Date(link.createdAt).toISOString().split('T')[0],
      description: `Created on ${new Date(link.createdAt).toLocaleDateString()}`,
    };
  };

  // Fetch sessions function
  const fetchSessions = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Fetching user session links...");
      const response = await userProfileService.getUserLinks();
      
      if (response.status && response.links) {
        console.log("Received links:", response.links);
        
        // Transform API data to Session format
        const transformedSessions = response.links
          .filter(link => !link.isDeleted) // Filter out deleted links
          .map(transformLinkToSession);
        
        setSessions(transformedSessions);
        console.log("Transformed sessions:", transformedSessions);
      } else {
        console.warn("Unexpected response format:", response);
        setSessions([]);
      }
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      setError(error.response?.data?.message || error.message || "Failed to load sessions");
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getSessionIcon = (type: Session['type']) => {
    switch (type) {
      case 'google-drive':
        return <HiOutlineFolder className="w-5 h-5" />;
      case 'zoom-meeting':
        return <HiOutlineVideoCamera className="w-5 h-5" />;
      case 'self-paced':
        return <HiOutlineLink className="w-5 h-5" />;
      default:
        return <HiOutlineCalendar className="w-5 h-5" />;
    }
  };

  const getSessionTypeColor = (type: Session['type']) => {
    switch (type) {
      case 'google-drive':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'zoom-meeting':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'self-paced':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'upcoming':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
      case 'completed':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleJoinSession = (session: Session) => {
    // Open the session URL in a new tab
    window.open(session.url, '_blank', 'noopener,noreferrer');
  };

  const filteredSessions = sessions.filter(session => 
    filter === 'all' || session.status === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Session Details</h1>
          <p className="text-[var(--foreground-muted)]">Access your course sessions, recordings, and meeting links</p>
        </div>
        
        <div className="bg-[var(--card-bg)] border border-red-200 rounded-[var(--radius-lg)] shadow-sm p-6">
          <div className="text-center py-12">
            <HiOutlineCalendar className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">Error Loading Sessions</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Session Details</h1>
          <button
            onClick={fetchSessions}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--input-bg)] hover:bg-[var(--border)] text-[var(--foreground)] border border-[var(--border)] rounded-[var(--radius-md)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <p className="text-[var(--foreground-muted)]">Access your course sessions, recordings, and meeting links</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Sessions' },
            { key: 'active', label: 'Active' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-[var(--radius-md)] font-medium transition-colors duration-200 ${
                filter === tab.key
                  ? 'bg-[var(--primary)] text-[var(--primary-text)]'
                  : 'bg-[var(--input-bg)] text-[var(--foreground)] hover:bg-[var(--border)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineCalendar className="w-12 h-12 text-[var(--foreground-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">No sessions found</h3>
              <p className="text-[var(--foreground-muted)]">
                {filter === 'all' ? 'No sessions available at the moment.' : `No ${filter} sessions found.`}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 hover:bg-[var(--border)] transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${getSessionTypeColor(session.type)}`}>
                        {getSessionIcon(session.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {session.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Session Details */}
                    {(session.date || session.time || session.duration || session.instructor || session.courseId || session.scheduleId) && (
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[var(--foreground-muted)]">
                        {session.date && (
                          <div className="flex items-center gap-1">
                            <HiOutlineCalendar className="w-4 h-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {session.time && (
                          <div className="flex items-center gap-1">
                            <HiOutlineClock className="w-4 h-4" />
                            <span>{session.time}</span>
                          </div>
                        )}
                        {session.duration && (
                          <div className="flex items-center gap-1">
                            <HiOutlineClock className="w-4 h-4" />
                            <span>{session.duration}</span>
                          </div>
                        )}
                        {session.instructor && (
                          <div className="flex items-center gap-1">
                            <HiOutlineUsers className="w-4 h-4" />
                            <span>{session.instructor}</span>
                          </div>
                        )}
                        {session.courseId && (
                          <div className="flex items-center gap-1">
                            <HiOutlineFolder className="w-4 h-4" />
                            <span>Course: {session.courseId.slice(-8)}</span>
                          </div>
                        )}
                        {session.scheduleId && (
                          <div className="flex items-center gap-1">
                            <HiOutlineCalendar className="w-4 h-4" />
                            <span>Schedule: {session.scheduleId.slice(-8)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {session.description && (
                      <p className="text-sm text-[var(--foreground-muted)] mb-4">
                        {session.description}
                      </p>
                    )}

                    {/* Session URL */}
                    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-md)] p-3 mb-4">
                      <p className="text-xs text-[var(--foreground-muted)] mb-1">Session Link:</p>
                      <p className="text-sm text-[var(--primary)] font-mono break-all">
                        {session.url}
                      </p>
                    </div>
                  </div>

                  {/* Join Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleJoinSession(session)}
                      className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-text)] font-medium rounded-[var(--radius-md)] transition-colors duration-200"
                    >
                      <span>Join Session</span>
                      <HiOutlineExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {sessions.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Active Sessions</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {sessions.filter(s => s.status === 'upcoming').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Upcoming Sessions</div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-sm p-6 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)] mb-2">
            {sessions.filter(s => s.status === 'completed').length}
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">Completed Sessions</div>
        </div>
      </div>
    </div>
  );
} 