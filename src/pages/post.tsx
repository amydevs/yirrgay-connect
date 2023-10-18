import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Post = () => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/');
        }
    }, [session]);

    return (
        <div className="w-full mt-16">
            <div className="max-w-3xl mx-auto p-6">
                
            </div>
        </div>
    );
}

export default Post;