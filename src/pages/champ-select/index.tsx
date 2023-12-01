import { useRouter } from 'next/router'
import champions from '../../../data/champions.json'

const ChampSelect = () => {
  const router = useRouter()

  const {championId, assignedPosition} = router.query
  const champion = champions.find((champion) => champion.key === championId) ?? null

  return (
    <div className='flex space-x-2'>
      { championId ? (
        <>
          <span className="text-3xl font-semibold">Builds para</span>
          <span className="text-3xl font-semibold">{champion?.id ?? ''}</span>
          <span className="text-3xl font-semibold">{assignedPosition}</span>
        </>
      ) : (
        <span className="text-3xl font-semibold">Selecione o campeão</span>
      )}
    </div>
  );
};

export default ChampSelect;
