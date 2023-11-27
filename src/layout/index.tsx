import Head from 'next/head';
import Favicon from '@/assets/images/favicon.ico';
import Script from 'next/script';

type defaultProps = {
  children: React.ReactNode;
};

export default function LayoutDefault({ children }: defaultProps) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Electron/Next LAB</title>
      </Head>
      {children}
    </>
  );
}
