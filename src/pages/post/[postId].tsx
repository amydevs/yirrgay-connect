import { useRouter } from "next/router";

const PostContent = () => {
    const router = useRouter();
    const postId = router.query.postId;
    return (
        <>{postId}</>
    );
};

export default PostContent;