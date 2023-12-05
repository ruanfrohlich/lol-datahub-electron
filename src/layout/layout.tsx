import TheHeader from '@/components/structure/TheHeader';
import { useEffect, useRef, useState } from 'react';

export default function Layout({ children }) {
  const headerRef = useRef<HTMLElement>(null);
  const [compensation, setCompensation] = useState<number>(0);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.getBoundingClientRect().height;
      setCompensation(window.innerHeight - headerHeight);
    }
  }, []);

  return (
    <>
      <TheHeader ref={headerRef} />
      <main
        className='py-7'
        style={{
          minHeight: `${compensation}px`,
        }}
      >
        {children}
      </main>
    </>
  );
}
