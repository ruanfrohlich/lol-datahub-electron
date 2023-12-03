import { useRouter } from 'next/router'
import { IoArrowBackOutline } from "react-icons/io5";

const ChampionSuggestion = () => {
  const router = useRouter()

  return (
      <div className='flex flex-col p-16 space-y-8'>
        <div>
          <button 
            className='text-3xl text-white'
            onClick={() => router.replace(`/champion-select`)}>
            <IoArrowBackOutline />
          </button>
        </div>
      </div>
  );
};

export default ChampionSuggestion;