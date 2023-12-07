import '@/styles/global.css';
import { Layout, Loading } from '@/components';
import type { AppProps } from 'next/app';
import { AppProvider } from '@/components';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <Loading />
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
