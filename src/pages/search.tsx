import { Pencil1Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import { Button } from '~/components/ui/button';
import { api } from '~/utils/api';
import PostCard from '~/components/post/card';

const Search = () => {
  const router = useRouter();
  const postsQuery = api.posts.getAll.useQuery({
    search: typeof router.query.q === 'string' ? router.query.q : '',
  });

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

export default Search;
