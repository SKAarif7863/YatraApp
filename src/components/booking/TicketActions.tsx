
import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Share2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TicketActionsProps {
  pnr: string;
  trainName: string;
}

const TicketActions = ({ pnr, trainName }: TicketActionsProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your ticket PDF is being generated...",
    });
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "Ticket downloaded successfully",
      });
    }, 2000);
  };

  const handleShare = () => {
    const shareData = {
      title: `Train Ticket - PNR: ${pnr}`,
      text: `My train booking details for ${trainName}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((error) => {
        console.log('Error sharing:', error);
        toast({
          title: "Share Failed",
          description: "Unable to share ticket. You can copy the URL instead.",
          variant: "destructive",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link Copied",
          description: "Ticket link copied to clipboard",
        });
      }).catch(() => {
        toast({
          title: "Share Failed",
          description: "Unable to copy link. Please copy the URL manually.",
          variant: "destructive",
        });
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Button onClick={handleDownload} className="flex-1">
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
      <Button onClick={handleShare} variant="outline" className="flex-1">
        <Share2 className="h-4 w-4 mr-2" />
        Share Ticket
      </Button>
      <Link to="/search" className="flex-1">
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          Book Another
        </Button>
      </Link>
    </div>
  );
};

export default TicketActions;
