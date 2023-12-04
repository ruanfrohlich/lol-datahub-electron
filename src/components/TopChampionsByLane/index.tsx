import { capitalized } from '@/utils/general';
import API from '@/lib/API/API.Constants';
//import { ChampionsRequest } from 'lib/API/API.Interfaces';
import { Champion } from '@/lib/LA/LA.DataTypes/LA.Interfaces';
import OrderChampions from '@/lib/LA/LA.Utils/LA.OrderChampions';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppProvider } from '../common/AppProvider';
import Tooltip from '../objects/Tooltip';

export default function TopChampionsByLane() {
  const [champions, setChampions] = useState<{
    tierS: Array<string>;
    tierA: Array<string>;
    tierB: Array<string>;
  }>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLane, setCurrentLane] = useState<string>(null);
  const [filter, setFilter] = useState<string>(null);
  const router = useRouter();
  const { setGlobalState } = useAppProvider();

  const Lanes = {
    0: 'top',
    1: 'jungle',
    2: 'mid',
    3: 'bot',
    4: 'support',
  };

  const orderBy = {
    0: 'rank',
    1: 'name',
    2: 'winrate',
    3: 'games',
  };

  const getChampions = async (lane: number, hasChampions: boolean) => {
    setLoading(true);

    if (hasChampions) {
      setCurrentLane(Lanes[lane]);
      setLoading(false);
      return;
    }

    setChampions(null);
    setError(null);
    setCurrentLane(Lanes[lane]);

    const data = Object.entries({
      tier: 'gold',
      lane: Lanes[lane],
    });

    let params = '?';

    data.forEach((element) => {
      params += params === '?' ? '' : '&';
      params += element[0].concat('=', element[1]);
    });

    const req = await fetch(API.hostname.concat(params));
    const reqData = await req.json();

    console.log(reqData);

    if (!reqData.error) {
      setChampions(reqData);
    } else {
      setChampions(null);
      setError(reqData.error.message);
      console.error(reqData.error);
    }

    setLoading(false);
  };

  const changeOrder = (filter: number) => {
    const newChampionsData: Champion[] = OrderChampions(champions, filter);
    setChampions(newChampionsData);
    setFilter(orderBy[filter]);
  };

  const handleChampion = async (champion: string): Promise<void> => {
    setGlobalState((prevState) => {
      return {
        ...prevState,
        modalContent: `Aguarde enquanto buscamos os dados de ${capitalized(
          champion
        )} na lane ${currentLane}`,
        openModal: true,
      };
    });

    router
      .push({
        pathname: `/champion/${champion
          .replace("'", '')
          .replace(' ', '')
          .toLowerCase()}`,
        query: {
          lane: currentLane,
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

  return (
    <section id="top-champions">
      <div className="container mx-auto">
        <div className="flex gap-[20px] mb-[50px]">
          {(() => {
            const roleButtons = [];

            for (let i = 0; i < Object.keys(Lanes).length; i++) {
              roleButtons.push(
                <button
                  key={Lanes[i]}
                  className="border border-secondary rounded hover:bg-secondary hover:text-white transition-all duration-200 w-[64px] h-[64px] text-[12px] bg-primary"
                  onClick={() => getChampions(i, champions ? true : false)}
                >
                  {capitalized(Lanes[i])}
                </button>
              );
            }

            return roleButtons;
          })()}
        </div>
        <h1 className="text-xl mb-[10px]">
          {currentLane && capitalized(currentLane)} Campeões por Elo
        </h1>
        <table className="text-[12px] w-[min(100%,600px)] mb-[50px]">
          <thead className="bg-secondary h-[40px]">
            <tr>
              {['Tier', 'Champions'].map((label, index) => (
                <th
                  key={label}
                  className="border border-secondary text-left px-[10px] cursor-pointer" /*onClick={() => champions && changeOrder(index)}*/
                >
                  <span className="flex gap-2 items-baseline">
                    {label}
                    <span
                      className={
                        filter === orderBy[index] ? 'rotate-90' : '-rotate-90'
                      }
                    >
                      {'>'}
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-primary">
            {loading || error || !champions ? (
              <tr>
                <td className="px-[10px] h-[34px]" colSpan={4}>
                  {error
                    ? error
                    : loading
                      ? 'Aguarde...'
                      : 'Selecione uma lane acima para buscar.'}
                </td>
              </tr>
            ) : (
              <>
                {champions &&
                  Object.keys(champions).map((lane) => {
                    const rows = [];

                    if (lane === currentLane) {
                      Object.keys(champions[lane]).map((tier) => {
                        rows.push(
                          <tr key={`champions_${tier}`}>
                            <td>Tier {tier.replace('tier', '')}</td>
                            <td className="flex items-center gap-2">
                              {champions[lane][tier].map((champion) => {
                                return (
                                  <span
                                    key={`list_champion_${champion}`}
                                    className="group relative cursor-pointer"
                                    onClick={() => handleChampion(champion)}
                                  >
                                    <span className="flex items-center justify-center overflow-hidden h-[30px] w-[30px] rounded-full border border-secondary">
                                      <img
                                        className="object-cover"
                                        src={`https://cdn.mobalytics.gg/assets/lol/images/dd/champions/icons/${champion}.png?V3`}
                                        alt={champion}
                                      ></img>
                                    </span>
                                    <Tooltip>{capitalized(champion)}</Tooltip>
                                  </span>
                                );
                              })}
                            </td>
                          </tr>
                        );
                      });
                    }

                    return rows;
                  })}
              </>
            )}
            {/* {
              (loading || error || !champions) ?
                <tr>
                  <td className='px-[10px] h-[34px]' colSpan={4}>{error ? error : loading ? 'Aguarde...' : 'Selecione uma lane acima para buscar.'}</td>
                </tr> :
                <>
                  {
                    champions && champions.map((champion, i) => (
                      <tr key={`champ-${i}`} className='border-b border-l border-r border-secondary'>
                        {
                          Object.keys(champion).map((label, j) => (
                            <td key={`label-${j}`}>
                              <span 
                                className={`${label === orderBy[1] && 'flex items-center gap-2'} px-[10px] py-2 cursor-pointer rounded transition-colors duration-200 hover:bg-secondary hover:text-white`}
                                onClick={() => handleChampion(champion)}
                              >
                                {
                                  label === orderBy[1] && 
                                  <img 
                                    className='h-[45px] w-[45px] rounded-full' 
                                    src={`https://cdn.lolalytics.com/generated/champion280px/${champion.name.replace('\'', '').replace(' ', '').toLowerCase()}.jpg`} 
                                    alt={champion.name}
                                  />
                                }
                                {champion[label]}
                              </span>
                            </td>
                          ))
                        }
                      </tr>
                    ))
                  }
                </>
            }        */}
          </tbody>
        </table>
      </div>
    </section>
  );
}
