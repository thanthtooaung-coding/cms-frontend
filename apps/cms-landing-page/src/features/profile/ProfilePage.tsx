import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../api/authApi';
import { useAuthDataStore } from '../../store/auth-store';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '@cms/ui/components/button';
import { ArrowLeft, ExternalLink, Clock, CheckCircle, XCircle, Mail, MapPin, Phone, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@cms/ui/components/card';
import { Badge } from '@cms/ui/components/badge';
import { Alert, AlertDescription } from '@cms/ui/components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@cms/ui/components/avatar';
import Loading from '../../components/Loading';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Approved':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'Pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 'Rejected':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'Your page request has been approved! You can now access your page.';
    case 'Pending':
      return 'Your page request is currently under review. Please wait for admin approval.';
    case 'Rejected':
      return 'Your page request has been rejected. Please contact support for more information.';
    default:
      return '';
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthDataStore();
  const [copiedUrlId, setCopiedUrlId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: isAuthenticated(),
  });

  const copyToClipboard = async (url: string, id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const formatUrl = (url: string, maxLength: number = 50) => {
    try {
      const urlObj = new URL(url);
      const display = urlObj.hostname + urlObj.pathname;
      
      if (display.length <= maxLength) {
        return {
          display: display,
          full: url
        };
      }
      
      // Truncate and add ellipsis
      const truncated = display.substring(0, maxLength - 3) + '...';
      return {
        display: truncated,
        full: url
      };
    } catch {
      // If URL parsing fails, just truncate the original string
      if (url.length <= maxLength) {
        return {
          display: url,
          full: url
        };
      }
      return {
        display: url.substring(0, maxLength - 3) + '...',
        full: url
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error ? error.message : 'An error occurred'}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')} className="mt-4 w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const handlePageClick = (pageRequest: typeof profile.pageRequests[0]) => {
    if (pageRequest.status === 'Approved') {
      window.open(pageRequest.pageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-transparent py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={profile.user.name || profile.user.username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl">
                  {(profile.user.name || profile.user.username)?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">
                  {profile.user.name || profile.user.username}
                </CardTitle>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.user.email}</span>
                  </div>
                  {profile.user.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.user.address}</span>
                    </div>
                  )}
                  {profile.user.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{profile.user.phone_number}</span>
                    </div>
                  )}
                  {profile.user.role && (
                    <Badge variant="secondary" className="mt-2">
                      {profile.user.role.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.stats.totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{profile.stats.approvedRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{profile.stats.pendingRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{profile.stats.rejectedRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Page Requests */}
        <Card>
          <CardHeader>
            <CardTitle>My Page Requests</CardTitle>
            <CardDescription>Manage and access your requested pages</CardDescription>
          </CardHeader>
          <CardContent>
            {!profile.pageRequests || profile.pageRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">You haven't submitted any page requests yet.</p>
                <Button onClick={() => navigate('/page-request')}>
                  Submit Your First Request
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.pageRequests.map((pageRequest) => (
                  <Card
                    key={pageRequest.id}
                    className={`transition-all duration-200 ${
                      pageRequest.status === 'Approved'
                        ? 'hover:shadow-lg cursor-pointer border-green-200'
                        : pageRequest.status === 'Pending'
                        ? 'border-yellow-200'
                        : 'border-red-200'
                    }`}
                    onClick={() => handlePageClick(pageRequest)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {pageRequest.logoUrl && (
                              <img
                                src={pageRequest.logoUrl}
                                alt={pageRequest.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                {pageRequest.title}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {pageRequest.requestType}
                              </p>
                            </div>
                            {getStatusBadge(pageRequest.status)}
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0 flex items-center gap-2">
                                {pageRequest.status === 'Approved' ? (
                                  <a
                                    href={pageRequest.pageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-blue-600 hover:text-blue-800 hover:underline truncate flex-1"
                                    title={pageRequest.pageUrl}
                                  >
                                    {formatUrl(pageRequest.pageUrl, 60).display}
                                  </a>
                                ) : (
                                  <span 
                                    className="text-slate-600 truncate flex-1" 
                                    title={pageRequest.pageUrl}
                                  >
                                    {formatUrl(pageRequest.pageUrl, 60).display}
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 flex-shrink-0"
                                  onClick={(e) => copyToClipboard(pageRequest.pageUrl, pageRequest.id, e)}
                                  title="Copy URL"
                                >
                                  {copiedUrlId === pageRequest.id ? (
                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">
                              Created: {new Date(pageRequest.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          {pageRequest.status !== 'Approved' && (
                            <Alert className="mt-4">
                              <AlertDescription>
                                {getStatusMessage(pageRequest.status)}
                              </AlertDescription>
                            </Alert>
                          )}

                          {pageRequest.status === 'Approved' && (
                            <Alert className="mt-4 border-green-200 bg-green-50">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <AlertDescription className="text-green-800">
                                Click to access your page
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

