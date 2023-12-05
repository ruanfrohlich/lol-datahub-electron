import { capitalized } from '@/utils';
import { Skills } from '@/lib/LA/LA.DataTypes/LA.Interfaces';
import { ParsedUrlQuery } from 'querystring';
import { TChampion } from '@/interfaces';

interface ISkillsTable {
  query: ParsedUrlQuery;
  skillsOrder: Skills;
  className?: string;
  champion: TChampion;
}

export default function SkillsTable({
  query,
  skillsOrder,
  className,
  champion,
}: ISkillsTable) {
  return (
    <div className={className}>
      <div className="border border-secondary">
        <div className="bg-primary p-5">
          <div className="bg-primary flex items-center gap-[20px] flex-row">
            <div className="h-[98px] w-[98px] flex items-center justify-center border border-secondary">
              <img
                className="h-[100%] w-[100%] object-cover"
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}champion-icons/${champion.key}.png`}
                alt={query.id as string}
              ></img>
            </div>
            <div className="text-2xl">
              <p>{capitalized(query.id as string)}</p>
              <span className="text-[rgb(100,100,100)] text-[0.6em]">
                {champion.title}
              </span>
            </div>
          </div>
        </div>
        <table className="table-fixed text-[12px] w-[100%]">
          <tbody className="bg-primary">
            {skillsOrder &&
              Object.keys(skillsOrder).map((skill: string) => (
                <tr key={`skill-data-${skill}`}>
                  {(() => {
                    const els = [
                      <td
                        key={`image-skill-${skill}`}
                        className="h-[34px] border-t border-secondary relative"
                      >
                        <img
                          className="w-[100%] h-[100%] object-cover"
                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${champion.name.toLowerCase()}/hud/icons2d/${champion.name.toLowerCase()}_${skill}.png`}
                          alt={skill}
                        ></img>
                        <span className="text-white text-[12px] bg-primary w-[15px] h-[15px] absolute bottom-0 right-0 font-bold text-center pointer-events-none">
                          {skill.toUpperCase()}
                        </span>
                      </td>,
                    ];

                    skillsOrder[skill].map((level: string, index: number) => {
                      const key = `champ_hab_${index}`;
                      const style =
                        'text-white text-center h-[34px] border-t border-secondary';
                      const bg = Number(level) > 0 ? ' bg-secondary' : '';
                      const value = Number(level) > 0 ? level : '';

                      els.push(
                        <td key={key} className={`${style.concat(bg)}`}>
                          {value}
                        </td>
                      );
                    });

                    return els;
                  })()}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
