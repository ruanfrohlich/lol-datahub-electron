import '@/styles/global.css';
import { Layout, TheLoadingModal } from '@/components';
import type { AppProps } from 'next/app';
import { AppProvider } from '@/components';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <TheLoadingModal />
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
