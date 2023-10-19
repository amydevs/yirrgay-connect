import type { GetServerSideProps } from "next";
import {
    ChatBubbleIcon,
    HeartIcon,
    Share1Icon,
    Pencil1Icon,
} from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const Home = () => {
    const session = useSession();
    return (
        <div className="w-full mt-16">
            <div className="max-w-3xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Post
                        </CardTitle>
                        <CardDescription>
                            Description
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        Content
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {
                            session.data?.user.role !== "Viewer" &&
                            <Button className="rounded-full" size='icon' variant='ghost'>
                                <ChatBubbleIcon className="h-5 w-5" />
                            </Button>
                        }
                        <Button className="rounded-full" size='icon' variant='ghost'>
                            <HeartIcon className="h-5 w-5" />
                        </Button>
                        <Button className="rounded-full" size='icon' variant='ghost'>
                            <Share1Icon className="h-5 w-5" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <Button className="sm:hidden fixed bottom-6 right-6 rounded-full w-16 h-16">
                <Pencil1Icon className="h-6 w-6" />
            </Button>
        </div>
    )
};

export default Home;