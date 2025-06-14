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
}

export default function SessionDetailsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    // Simulate fetching session data
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        // Mock data based on the screenshot
        const mockSessions: Session[] = [
          {
            id: '1',
            type: 'google-drive',
            title: 'Google Drive - Recordings',
            url: 'https://drive.google.com/drive/folders/1owoX_VndjZyTChwVlsM_aehjVjEy-nAE?usp=drive_link',
            status: 'active',
            date: '2024-01-15',
            time: '10:00 AM',
            duration: '2 hours'
          },
          {
            id: '2',
            type: 'google-drive',
            title: 'Google Drive - Recordings',
            url: 'https://drive.google.com/drive/folders/1owoX_VndjZyTChwVlsM_aehjVjEy-nAE?usp=drive_link',
            status: 'active',
            date: '2024-01-16',
            time: '2:00 PM',
            duration: '1.5 hours'
          },
          {
            id: '3',
            type: 'zoom-meeting',
            title: 'Zoom Meeting Link',
            url: 'https://us06web.zoom.us/meeting/register/UtfX55psTFS8lVl4Ue6N8A',
            status: 'upcoming',
            date: '2024-01-20',
            time: '11:00 AM',
            duration: '3 hours',
            instructor: 'John Smith'
          },
          {
            id: '4',
            type: 'zoom-meeting',
            title: 'Zoom Meeting Link',
            url: 'https://us06web.zoom.us/meeting/register/UtfX55psTFS8lVl4Ue6N8A',
            status: 'upcoming',
            date: '2024-01-22',
            time: '9:00 AM',
            duration: '2.5 hours',
            instructor: 'Jane Doe'
          },
          {
            id: '5',
            type: 'self-paced',
            title: 'PMP Self-Paced Course Access',
            url: 'https://drive.google.com/drive/folders/1DpCThspdrZs1-Fkf6kKhPnsJ3pzwjwqd?usp=sharing',
            status: 'active',
            description: 'Access to all course materials and resources'
          }
        ];

        setSessions(mockSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Session Details</h1>
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
                    {(session.date || session.time || session.duration || session.instructor) && (
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