import '@/styles/global.css';
import { Layout, LoadingModal } from '@/components';
import type { AppProps } from 'next/app';
import { AppProvider } from '@/components';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <LoadingModal />
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
