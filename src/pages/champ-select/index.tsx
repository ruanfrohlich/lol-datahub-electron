import { useRouter } from 'next/router'

const ChampSelect = () => {
  const router = useRouter()

  console.log(router.query)

  return (
    <div className='flex space-x-2'>
      <span className="text-3xl font-semibold">Builds para</span>
      <span className="text-3xl font-semibold">{router.query.championId}</span>
      <span className="text-3xl font-semibold">{router.query.assignedPosition}</span>
    </div>
  );
};

export default ChampSelect;
