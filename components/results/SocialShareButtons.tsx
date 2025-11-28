"use client";

import { Button } from "@heroui/react";
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface SocialShareButtonsProps {
    title: string;
    url: string;
}

export default function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="flex gap-2">
            <Button
                isIconOnly
                variant="flat"
                className="bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')}
                title="Share on Twitter"
            >
                <Twitter size={20} />
            </Button>

            <Button
                isIconOnly
                variant="flat"
                className="bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/30"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
                title="Share on LinkedIn"
            >
                <Linkedin size={20} />
            </Button>

            <Button
                isIconOnly
                variant="flat"
                className="bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/30"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
                title="Share on Facebook"
            >
                <Facebook size={20} />
            </Button>

            <Button
                isIconOnly
                variant="flat"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={handleCopyLink}
                title="Copy Link"
            >
                <LinkIcon size={20} />
            </Button>
        </div>
    );
}
