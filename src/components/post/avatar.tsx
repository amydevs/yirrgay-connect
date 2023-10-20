import React, { useEffect } from "react";
import { useState } from "react";
import { type Prisma } from "@prisma/client";
import { cn } from "~/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface PostAvatarProps {
    post?: Prisma.PostGetPayload<{
        include: {
            user: true;
        }
    }>
};

const PostAvatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & PostAvatarProps
>(({
    className,
    post,
    ...props
}, ref) => {
    const [createdAt, setCreatedAt] = useState(post?.createdAt.toISOString());

    useEffect(() => {
        if (post == null) {
            return;
        }
        setCreatedAt(post.createdAt.toDateString());
    }, [post]);

    return (
        <div ref={ref} className={cn("flex flex-1 items-start", className)} {...props}>
            <Avatar>
                <AvatarImage src={post?.user.image ?? ''} alt={post?.user.name ?? ''} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="pl-3 flex-1">
                {post?.user.name}
                <p className="text-xs">
                    Posted on {createdAt}
                </p>
            </div>
        </div>
    );
});

PostAvatar.displayName = 'PostAvatar';

export default PostAvatar;