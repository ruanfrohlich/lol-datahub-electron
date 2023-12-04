import LayoutDefault from '@/layout';
import { Select } from '@/components';
import { useState } from 'react';
import champions from '@/data/champions.json';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  const [champion, setChampion] = useState('');

  return (
    <LayoutDefault>
      <div className="flex flex-col">
        <div className="flex justify-center py-16">
          <input
            className="text-base font-semibold text-text-secondary
              h-12 w-[50%]
              border p-2 rounded"
            type="text"
            value={champion}
            onChange={(e) => setChampion(e.target.value)}
            placeholder="Com qual campeão você vai jogar?"
          ></input>
        </div>
        <div className="flex flex-wrap justify-center px-4 py-8">
          {champions
            .filter((object) => {
              return object.id.toLowerCase().startsWith(champion.toLowerCase());
            })
            .map((champion) => (
              <button
                key={champion.key}
                className="text-base font-semibold
                text-text-primary dark:text-dark-text-primary
                bg-masala-950
                h-44 w-40
                rounded 
                p-4 m-2
                flex flex-col items-center space-y-4"
                onClick={() =>
                  router.replace(
                    `/champion-select/?championId=${champion.key}&assignedPosition=`
                  )
                }
              >
                <div className="w-24 h-24">
                  <img
                    className="rounded-full"
                    src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.key}.png`}
                  />
                </div>
                <span>{champion.id}</span>
              </button>
            ))}
        </div>
      </div>
    </LayoutDefault>
  );
};

export default Home;
