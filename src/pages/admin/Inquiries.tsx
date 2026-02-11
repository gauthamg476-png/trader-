import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Inquiry } from '@/types';

export default function AdminInquiries() {
  const { user, isLoading, isAdmin } = useAuth();
  const { inquiries, replyToInquiry } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isLoading, isAdmin, navigate]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pendingInquiries = inquiries.filter(i => !i.reply);
  const repliedInquiries = inquiries.filter(i => i.reply);

  const handleReplyClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setReply('');
    setIsDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedInquiry || !reply.trim()) {
      toast({
        title: 'Please enter a reply',
        variant: 'destructive',
      });
      return;
    }

    replyToInquiry(selectedInquiry.id, reply.trim());
    
    toast({
      title: 'Reply sent!',
      description: 'Your reply has been sent to the customer.',
    });

    setIsDialogOpen(false);
  };

  const sortedInquiries = [...inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Customer Inquiries
          </h1>
          <p className="text-muted-foreground">
            View and respond to customer questions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inquiries.length}</p>
                  <p className="text-xs text-muted-foreground">Total Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingInquiries.length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{repliedInquiries.length}</p>
                  <p className="text-xs text-muted-foreground">Replied</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiries List */}
        <Card>
          <CardHeader>
            <CardTitle>All Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedInquiries.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No inquiries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-4 rounded-lg border ${
                      !inquiry.reply ? 'bg-warning/5 border-warning/20' : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{inquiry.subject}</h4>
                          <Badge variant={inquiry.reply ? 'default' : 'secondary'}>
                            {inquiry.reply ? 'Replied' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          From: {inquiry.customerName} • {new Date(inquiry.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!inquiry.reply && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReplyClick(inquiry)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      )}
                    </div>

                    <div className="bg-card p-3 rounded-lg mb-3">
                      <p className="text-sm text-foreground">{inquiry.message}</p>
                    </div>

                    {inquiry.reply && (
                      <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                        <p className="text-xs font-medium text-primary mb-1">Your Reply:</p>
                        <p className="text-sm text-foreground">{inquiry.reply}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Replied: {inquiry.repliedAt && new Date(inquiry.repliedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Inquiry</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">{selectedInquiry.subject}</p>
                <p className="text-sm text-muted-foreground">
                  From: {selectedInquiry.customerName}
                </p>
                <p className="text-sm mt-2">{selectedInquiry.message}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Reply</label>
                <Textarea
                  placeholder="Type your response here..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
