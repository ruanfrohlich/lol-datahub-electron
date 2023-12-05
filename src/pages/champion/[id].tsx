import Head from 'next/head';
import champions from '@/data/champions.json';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next/types';
import { SkillsTable, ChampionBuild, TheTitle, Tooltip } from '@/components';
import { capitalized } from '@/utils/general';
import { TChampion } from '@/interfaces';
import { ChampionRequestData } from '@/lib/LA/LA.DataTypes/LA.Interfaces';
import { ParsedUrlQuery } from 'querystring';
import champBuild from '@/cache-files/nasus-top.json';
import Runes from '@/components/Runes';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = champions.map((champion) => ({
    params: { id: champion.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  champion: TChampion;
  title: string;
  build: ChampionRequestData;
  query: ParsedUrlQuery;
  error: object;
  description: string;
}> = async (ctx: GetStaticPropsContext) => {
  const championId = ctx.params.id as string;
  const champion: TChampion = champions.find(
    (champion) => champion.id === championId
  );

  const { build, skills, spells } = champBuild;

  return {
    props: {
      title: `LoL DataHub | ${capitalized(champion.name)} Build`,
      champion,
      build: {
        build,
        skills,
        spells,
      },
      query: ctx.params,
      error: null,
      description: `Informações sobre items e habilidades do campeão ${capitalized(
        champion.name
      )}`,
    },
  };
};

enum SpellLetter {
  D = 0,
  F = 1,
}

export default function ChampionPage({
  title,
  champion,
  build,
  query,
  error,
  description,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      {!error ? (
        <section id="champion-data">
          <div className="container mx-auto">
            <TheTitle
              type="secondary-white"
              level="h2"
              className="mb-4"
            >{`${capitalized(champion.name)} Build & Skills`}</TheTitle>
            <div className="grid grid-rows-3 xl:grid-rows-2 grid-cols-3 grid-flow-col gap-3">
              <SkillsTable
                className="col-span-2"
                query={query}
                skillsOrder={build.skills}
                champion={champion}
              />
              <ChampionBuild
                className="col-span-3 xl:col-span-2"
                champion={champion.name}
                championData={build}
              />
              <div className="col-start-3 row-start-1 border border-secondary flex items-center justify-center gap-2">
                {build.spells.map((spell, index) => {
                  return (
                    <span key={`spell_${spell}`} className="group relative">
                      <img
                        className="w-[60px] h-[60px] border border-secondary rounded"
                        src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_${spell.toLowerCase()}.png`}
                        alt={spell}
                      />
                      <span className="text-white text-[12px] bg-primary w-[15px] h-[15px] absolute bottom-0 right-0 font-bold text-center pointer-events-none">
                        {SpellLetter[index]}
                      </span>
                      <Tooltip>{spell}</Tooltip>
                    </span>
                  );
                })}
              </div>
              <div className="col-span-3 xl:col-span-1 border border-secondary">
                <Runes
                  primaryRunesList={[8000, 8010, 9111, 9105, 8299]}
                  secondaryRunesList={[8400, 8473, 8453]}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="container mx-auto">
          Ops! O campeão {champion ? champion : 'selecionado'} não foi
          encontrado :{'('}
        </div>
      )}
    </>
  );
}
