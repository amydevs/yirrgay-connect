import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import { api } from '~/utils/api';
import ThemeProvider from '~/components/theme-provider';
import NavBar from '~/components/navbar';
import '~/styles/globals.css';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
