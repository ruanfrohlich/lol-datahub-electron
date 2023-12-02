import { useRouter } from 'next/router'
import champions from '../../../data/champions.json'
import { ChampionSkillsTable, ItemsList, Runes } from '../../components';
import { IoArrowBackOutline } from "react-icons/io5";
const ChampSelect = () => {
  const router = useRouter()

  const {championId, assignedPosition} = router.query
  const champion: Champion = champions.find((champion) => champion.key === championId) ?? null

  return (
      <div className='flex flex-col p-16 space-y-8'>
        <div>
          <button className='text-3xl'>
            <IoArrowBackOutline />
          </button>
        </div>
        
        <div className='flex space-x-4 px-8'>
          <div className='w-24 h-24'>
            <img className='rounded-full' src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champion.key}.png`} />
          </div>
          <div className='flex flex-col justify-center'>
            <span className='text-white text-3xl font-semibold'>{champion.id}</span>
          </div>
        </div>

        <div className='flex'>
          <div className='flex flex-col space-y-8'>
            <ChampionSkillsTable />
            <ItemsList itemsNumberList={[6630, 3047, 3161, 3053, 6333, 3026]}/>
          </div>
        
          <Runes primaryRunesList={[8000, 8010, 9111, 9105, 8299]} secondaryRunesList={[8400, 8473, 8453]}/>
        </div>
      </div>
  );
};

export default ChampSelect;
