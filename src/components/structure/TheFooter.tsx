import { LegacyRef, forwardRef } from 'react';

const TheFooter = forwardRef(function TheFooter(
  props,
  ref: LegacyRef<HTMLElement>
) {
  const currentDate = new Date().getFullYear();

  return (
    <footer className='league-border-secondary bg-primary text-white' ref={ref}>
      <div className='container mx-auto pt-4 pb-5'>
        <div>&copy; LoL DataHub | {currentDate}</div>
      </div>
    </footer>
  );
});

export default TheFooter;
