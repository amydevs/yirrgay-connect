import { Button } from "~/components/ui/button";
import { Pencil1Icon } from '@radix-ui/react-icons';

const Home = () => {
    return (
        <>
            <div className="mt-16">
            
            </div>
            <Button className="sm:hidden fixed bottom-6 right-6 rounded-full w-16 h-16">
                <Pencil1Icon width={25} height={25} />
            </Button>
        </>
    )
};

export default Home;