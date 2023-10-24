import type { GetServerSideProps } from 'next';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '~/components/ui/button';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import PostCard from '~/components/post/card';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const Home = () => {
  const postsQuery = api.posts.getAll.useQuery({});

  const posts = postsQuery.data;

  return (
    <div className="w-full mt-16">
      <div className="max-w-3xl mx-auto p-6 space-y-3">
        {posts?.map((post, i) => <PostCard post={post} key={i} />)}
      </div>
      <Button className="sm:hidden fixed bottom-6 right-6 rounded-full w-16 h-16">
        <Pencil1Icon className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Home;
