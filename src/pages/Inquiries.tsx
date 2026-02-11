import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CustomerHeader } from '@/components/CustomerHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Inquiries() {
  const { user, isLoading } = useAuth();
  const { inquiries, createInquiry } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const userInquiries = inquiries.filter(i => i.customerId === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    createInquiry({
      customerId: user.id,
      customerName: user.username,
      subject: subject.trim(),
      message: message.trim(),
    });

    toast({
      title: 'Inquiry submitted!',
      description: 'We will respond to your query soon.',
    });

    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1 py-8 bg-muted/30">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Inquiries & Support
            </h1>
            <p className="text-muted-foreground">
              Have a question? Submit an inquiry and our team will get back to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Submit Inquiry */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  New Inquiry
                </CardTitle>
                <CardDescription>
                  Fill out the form below to submit your question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What's your inquiry about?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your question or concern in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Previous Inquiries */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Your Inquiries</h2>
              
              {userInquiries.length === 0 ? (
                <Card className="shadow-soft">
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No inquiries yet</p>
                    <p className="text-sm text-muted-foreground">
                      Submit your first inquiry using the form
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {userInquiries
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((inquiry) => (
                      <Card key={inquiry.id} className="shadow-soft">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-foreground">{inquiry.subject}</h4>
                            <Badge variant={inquiry.reply ? 'default' : 'secondary'}>
                              {inquiry.reply ? 'Replied' : 'Pending'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{inquiry.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>

                          {inquiry.reply && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs font-medium text-primary mb-1">Admin Reply:</p>
                              <p className="text-sm text-foreground bg-primary/5 p-3 rounded-lg">
                                {inquiry.reply}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {inquiry.repliedAt && new Date(inquiry.repliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
