import { useRouter } from 'next/router'

const ChampSelect = () => {
  const router = useRouter()

  const {championId, assignedPosition} = router.query

  return (
    <div className='flex space-x-2'>
      { championId ? (
        <>
          <span className="text-3xl font-semibold">Builds para</span>
          <span className="text-3xl font-semibold">{championId}</span>
          <span className="text-3xl font-semibold">{assignedPosition}</span>
        </>
      ) : (
        <span className="text-3xl font-semibold">Selecione o campeão</span>
      )}
    </div>
  );
};

export default ChampSelect;
