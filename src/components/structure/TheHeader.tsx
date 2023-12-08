import type { TChampion } from '@/interfaces';
import Link from 'next/link';
import { LegacyRef, createRef, forwardRef, useEffect, useState } from 'react';
import championList from '@/data/champions.json';
import { useRouter } from 'next/router';
import { useAppProvider } from '../common/AppProvider';

const TheHeader = forwardRef(function TheHeader(
  props,
  ref: LegacyRef<HTMLElement>
) {
  const [selectedChampion, setSelectedChampion] = useState<TChampion>(null);
  const [champions, setChampions] = useState<TChampion>(null);
  const [focus, setFocus] = useState<boolean>(false);
  const [name, setName] = useState<string>(null);
  const router = useRouter();
  const { setGlobalState } = useAppProvider();
  const wrapperRef = createRef<HTMLInputElement>();

  const handleInput = (championName: string): void => {
    if (!championName) {
      setFocus(false);
      setChampions(null);
      setName(null);
      setSelectedChampion(null);
      return;
    }

    setFocus(true);
    setName(championName);

    const list = championList.filter((champ) =>
      champ.name.toUpperCase().includes(championName.toUpperCase())
    );

    setChampions(list);
  };

  const handleChampion = async (champion: TChampion): Promise<void> => {
    setFocus(false);
    setSelectedChampion(champion);
    setName(champion.name);
    setGlobalState((prevState) => {
      return {
        ...prevState,
        modalContent: `Aguarde enquanto buscamos os dados de ${champion.name}`,
        openModal: true,
      };
    });

    router
      .push({
        pathname: '/champion/[id]',
        query: {
          id: champion.id,
        },
      })
      .then(() => {
        setGlobalState((prevState) => {
          return {
            ...prevState,
            openModal: false,
          };
        });
      });
  };

  useEffect(() => {
    function handleClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFocus(false);
      }
    }
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [wrapperRef]);

  return (
    <header className='relative px-2 pt-2 pb-0 z-[999]' ref={ref}>
      <div className='container flex justify-between items-center py-3 mx-auto'>
        <Link
          href='/'
          className='text-white text-xl font-bold bg-gradient-to-t to-0% from-secondary from-50% px-1'
        >
          LoL DataHub
        </Link>
        <div
          className={`relative w-[400px] transition-[width] duration-300 ease-in-out focus-within:w-[60%] ${
            focus ? 'w-[60%]' : ''
          }`}
          ref={wrapperRef}
        >
          <div className='relative rounded-md'>
            <input
              onChange={(el) => handleInput(el.currentTarget.value)}
              type='text'
              name='champ-name'
              id='champ-name'
              className={
                'block bg-primary w-[100%] rounded-md border border-secondary py-1.5 pl-3 pr-20 min-w-[340px] text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6'
              }
              placeholder='Jax, Aatrox, Lucian...'
              value={name ? name : ''}
              autoComplete='off'
            />
            <button
              onClick={() => handleChampion(selectedChampion)}
              className='absolute inset-y-0 right-0 flex items-center rounded-r bg-secondary h-[100%] px-2 text-white'
            >
              Buscar
            </button>
          </div>
          <ul
            id='champ-list'
            className={`absolute flex p-2 flex-wrap border border-secondary w-[100%] top-[calc(100%+6px)] max-h-[500px] overflow-x-hidden overflow-scroll left-0 bg-primary rounded transition-opacity duration-300 ${
              champions && champions.length > 0 && focus
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
          >
            {champions &&
              champions.map((champ, index) => (
                <li
                  key={`champ-${index}`}
                  className='flex flex-col items-center justify-start gap-2 p-4 cursor-pointer hover:bg-secondary transition-all duration-200 text-center w-[calc(100%/6)]'
                  onClick={() => handleChampion(champ)}
                >
                  <div className='flex items-center justify-center border border-secondary]'>
                    <img
                      className='h-[100%] w-[100%] object-cover'
                      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}champion-icons/${champ.key}.png`}
                      alt={champ.name}
                    ></img>
                  </div>
                  {champ.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </header>
  );
});

export default TheHeader;
