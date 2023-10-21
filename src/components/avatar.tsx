import React, { useEffect } from "react";
import { useState } from "react";
import { cn } from "~/utils/cn";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface UserAvatarProps {
    user: {
        name?: string | null | undefined;
        image?: string | null | undefined;
    }
    createdAt: Date;
};

const UserAvatar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & UserAvatarProps
>(({
    className,
    user,
    createdAt,
    ...props
}, ref) => {
    const [createdAtState, setCreatedAtState] = useState(createdAt.toISOString());

    useEffect(() => {
        setCreatedAtState(createdAt.toDateString());
    }, [createdAt]);

    return (
        <div ref={ref} className={cn("flex flex-1 items-start", className)} {...props}>
            <Avatar>
                <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="pl-3 flex-1">
                {user.name}
                <p className="text-xs">
                    Posted on {createdAtState}
                </p>
            </div>
        </div>
    );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;