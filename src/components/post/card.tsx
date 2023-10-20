import React, { useEffect, useState } from "react";
import { type Prisma } from "@prisma/client";
import { ChatBubbleIcon, Share1Icon, HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import PostAvatar from "./avatar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardFooter } from "../ui/card";

interface PostCardProps {
    post: Prisma.PostGetPayload<{
        include: {
            user: true;
            likes: true;
        }
    }>
};

const PostCard = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & PostCardProps
>(({
    className,
    post,
    ...props
}, ref) => {
    const session = useSession();
    
    const [isLiked, setIsLiked] = useState(false);

    const postsLike = api.posts.like.useMutation({
        onSuccess: () => {
            setIsLiked(true);
        }
    });
    const postsUnlike = api.posts.unlike.useMutation({
        onSuccess: () => {
            setIsLiked(false);
        }
    });

    useEffect(() => {
        if (session.data == null) {
            return;
        }
        setIsLiked(
            post.likes.findIndex((like) => like.userId === session.data.user.id) !== -1
        );
    }, [post.likes, session.data]);
    
    const toggleLike = () => {
        const desiredIsLiked = !isLiked;
        setIsLiked(desiredIsLiked);
        const input = { id: post.id };
        let prom: Promise<boolean>;
        if (desiredIsLiked) {
            prom = postsLike.mutateAsync(input).then(() => true);
        }
        else {
            prom = postsUnlike.mutateAsync(input).then(() => false);
        }
        return prom;
    };
    
    return (
        <Card ref={ref} className={className} {...props} >
            <CardHeader className="space-y-6">
                <PostAvatar post={post} />
                <Link href={`/post/${post.id}`}>
                    <CardTitle>
                        { post.title }
                    </CardTitle>
                </Link>
            </CardHeader>
            <CardFooter className="flex justify-between">
                {
                    session.data?.user.role !== "Viewer" &&
                    <Button className="rounded-full" size='icon' variant='ghost'>
                        <ChatBubbleIcon className="h-5 w-5" />
                    </Button>
                }
                <Button onClick={() => void toggleLike()} className="rounded-full" size='icon' variant='ghost'>
                    { !isLiked ?
                        <HeartIcon className="h-5 w-5" /> :
                        <HeartFilledIcon className="h-5 w-5 text-red-600" />
                    }
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="rounded-full" size='icon' variant='ghost'>
                            <Share1Icon className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuItem onClick={() => void navigator.clipboard.writeText(`${document.location.origin}/post/${post.id}`)}>
                            Copy Link
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
});

PostCard.displayName = 'PostCard';

export default PostCard;