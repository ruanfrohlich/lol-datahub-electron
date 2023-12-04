import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  GetServerSideProps, 
  GetServerSidePropsContext, 
  InferGetServerSidePropsType 
} from 'next/types';
import { TableOfSkills, ChampionBuild, TheTitle, Tooltip } from '@/components';
import API from 'lib/API/API.Constants';
import { ChampionRequest } from 'lib/API/API.Interfaces';
import { ChampionRequestData } from 'lib/LA/LA.DataTypes/LA.Interfaces';
import { ParsedUrlQuery } from 'querystring';
import { capitalized } from '@/utils/general';

export const getServerSideProps: GetServerSideProps<{
  champion: string;
  title: string;
  build: ChampionRequestData;
  query: ParsedUrlQuery;
  error: object;
  description: string;
}> = async (ctx: GetServerSidePropsContext) => {
  const championName = String(ctx.query.name);  
  let build: ChampionRequestData, error = null;   

  const data = Object.entries(ctx.query);
  let params = '?';
  let route : string = API.championBuildRoute;

  if ('name' in ctx.query) {
    route += ctx.query.name;    
    data.pop();
  }

  data.forEach((element) => {
    params += params === '?' ? '' : '&';
    params += element[0].concat('=', element[1].toString());
  });  

  const req = await fetch(route.concat(params));
  const reqData: ChampionRequest = await req.json();     
  

  if(!reqData.error) {
    build = reqData.data;
  } else {
    console.log(reqData.error);
    build = null;
    error = reqData.error;
  }

  return { 
    props: { 
      title: championName ? `LoL DataHub | ${capitalized(championName)} Build` : 'LoL DataHub',
      champion: championName,
      build,
      query: ctx.query,
      error,
      description: `Informações sobre items e habilidades do campeão ${capitalized(championName)}`
    }
  };
};

enum SpellLetter {
  D = 0,
  F = 1
}
 
export default function ChampionPage({title, champion, build, query, error, description}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isFallback } = useRouter();
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Head>
      {
        !isFallback && !error ?
          <section id='champion-data'>
            <div className='container mx-auto'>
              <TheTitle type='secondary-white' level='h2' className='mb-4'>{`${capitalized(query.name as string)} Build & Skills`}</TheTitle>
              <div className='grid grid-rows-3 xl:grid-rows-2 grid-cols-3 grid-flow-col gap-3'>
                <TableOfSkills className='col-span-2' query={query} skillsOrder={build.skills}/>
                <ChampionBuild className='col-span-3 xl:col-span-2' champion={champion} championData={build}/>     
                <div className='col-start-3 row-start-1 border border-secondary flex items-center justify-center gap-2'>
                  {
                    build.spells.map((spell, index) => {
                      return (
                        <span key={`spell_${spell}`} className='group relative'>
                          <img className='w-[60px] h-[60px] border border-secondary rounded' src={`https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-spells/Summoner${spell}.png`} alt={spell} />
                          <span className='text-white text-[12px] bg-primary w-[15px] h-[15px] absolute bottom-0 right-0 font-bold text-center pointer-events-none'>{SpellLetter[index]}</span>
                          <Tooltip>{spell}</Tooltip>
                        </span>
                      );
                    })
                  }
                </div>    
                <div className='col-span-3 xl:col-span-1 border border-secondary'>Runes</div> 
              </div>
            </div>
          </section> :
          <div className='container mx-auto'>Ops! O campeão {champion ? champion : 'selecionado'} não foi encontrado :{'('}</div>
      }
    </>
  );
}
