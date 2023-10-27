import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import { Button } from '~/components/ui/button';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/utils/api';
import PostCard from '~/components/post/card';

export function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ id: string }>) {
  const id = params?.id;
  return {
    props: {
      id,
    },
  };
}

const User = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const getUser = api.users.getById.useQuery({ id });

  return (
    <div className="w-full mt-16">
      <div className="max-w-3xl mx-auto p-6 space-y-3">
        {getUser.data?.posts?.map((post, i) =>
          getUser.data != null ? (
            <PostCard post={{ ...post, user: getUser.data }} key={i} />
          ) : (
            <></>
          ),
        )}
      </div>
      <Button className="sm:hidden fixed bottom-6 right-6 rounded-full w-16 h-16">
        <Pencil1Icon className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default User;
