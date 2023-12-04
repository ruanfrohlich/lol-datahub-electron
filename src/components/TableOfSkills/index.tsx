import { capitalized } from '@/utils';
import { Skills } from 'lib/LA/LA.DataTypes/LA.Interfaces';
import { ParsedUrlQuery } from 'querystring';

interface Props {
  query: ParsedUrlQuery;
  skillsOrder: Skills;
  className?: string | null;
}

export default function TableOfSkills({query, skillsOrder, className}: Props) {
  console.log(query);
  
  return (
    <div className={className}>
      <div className='border border-secondary'>
        <div className='bg-primary p-5'>
          <div className='bg-primary flex items-center gap-[20px] flex-row'>
            <div className='h-[98px] w-[98px] flex items-center justify-center rounded-full border border-secondary'>
              <img className='h-[96px] w-[96px] rounded-full' src={`https://cdn.mobalytics.gg/assets/lol/images/dd/champions/icons/${query.name as string}.png?V3`} alt={query.name as string}></img>
            </div>
            <div className='text-2xl'>
              <p>{capitalized(query.name as string)}</p>
              <span className='text-[rgb(100,100,100)] text-[0.6em]'>{query.lane ? query.lane : 'Main Role'}</span>
            </div>
          </div>
        </div>
        <table className='table-fixed text-[12px] w-[100%]'>
          <tbody className='bg-primary'>
            {
              skillsOrder && Object.keys(skillsOrder).map((skill: string) => (
                <tr key={`skill-data-${skill}`}>
                  {
                    (() => {
                      const els = [
                        <td key={`image-skill-${skill}`} className='h-[34px] border-t border-secondary relative'>
                          <img className='w-[100%] h-[100%] object-cover' src={`https://cdn.mobalytics.gg/assets/lol/images/dd/champions/abilities/${capitalized(query.name as string) + skill.toUpperCase()}.png?V3`} alt={skill}></img>
                          <span className='text-white text-[12px] bg-primary w-[15px] h-[15px] absolute bottom-0 right-0 font-bold text-center pointer-events-none'>{skill.toUpperCase()}</span>
                        </td>
                      ];                      
    
                      skillsOrder[skill].map((level: string, index: number) => {
                        const key = `champ_hab_${index}`;
                        const style = 'text-white text-center h-[34px] border-t border-secondary';
                        const bg = Number(level) > 0 ? ' bg-secondary' : '';
                        const value = Number(level) > 0 ? level : '';
    
                        els.push(<td key={key} className={`${style.concat(bg)}`}>{value}</td>);  
                      });
    
                      return els;
                    })()
                  }
                </tr>
              ))
            }
          </tbody>
        </table>  
      </div>
    </div>
  );
}
