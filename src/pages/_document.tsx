import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR" style={{ scrollBehavior: 'smooth' }}>
        <Head />
        <body className='bg-background dark:bg-woodsmoke-950'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
