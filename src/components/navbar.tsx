import Link from "next/link";
// import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "./ui/navigation-menu";
import React from "react";
import { BellIcon } from '@radix-ui/react-icons';
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { cn } from "~/utils/cn";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const routes: Array<{
    name: string,
    href: string,
    current?: boolean
}> = [
    {
        name: "Home",
        href: "/",
    }
];

const NavBar = () => {
    const router = useRouter();
    const session = useSession();
    const theme = useTheme();

    const isDark = theme.resolvedTheme === 'dark';

    const toggleTheme = () => {
        theme.setTheme(isDark ? 'light' : 'dark');
    }
    
    return (
        <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
          <div className="flex h-16 items-center px-8">
            <Link href='/'>
                <div className="text-center bg-secondary dark:bg-primary-foreground rounded h-9 w-9 mr-6">
                    <span className="leading-9">YC</span>
                </div>
            </Link>
            <nav
                className="flex items-center space-x-4 lg:space-x-6 mx-6"
            >
                {
                    routes.map((route, i) => (
                        <Link
                            key={i}
                            href={route.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                route.href !== router.pathname ? 'text-muted-foreground hover:text-primary' : 'text-primary'
                            )}
                        >
                            {route.name}
                        </Link>
                    ))
                }
                
            </nav>
            <div className="ml-auto flex items-center space-x-4">
                {
                    session.data == null ? (
                        <Button variant='secondary' onClick={() => signIn('auth0')}>
                            Login
                        </Button>
                    ) : (
                        <>
                            <Link href='/post' className={buttonVariants({ variant: 'outline' })}>
                                Create Post
                            </Link>
                            <Button variant='ghost' size='icon'>
                                <BellIcon />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.data.user.image as any} alt="@shadcn" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" sideOffset={12} align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            { session.data.user.name }
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                        { session.data.user.email }
                                        </p>
                                    </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleTheme()}>
                                        { isDark ? 'Light Mode' : 'Dark Mode' }
                                    </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )
                }
            </div>
          </div>
        </div>
    )
};

export default NavBar;