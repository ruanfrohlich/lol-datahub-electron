import { ChampionRequestData } from '@/lib/LA/LA.DataTypes/LA.Interfaces';
import { Tooltip } from '@/components';
import { useEffect, useRef, useState } from 'react';
import items from '@/data/items.json'

interface Props {
  champion: string;
  championData: ChampionRequestData;
  className?: string;
}

/**
 * Componente contendo todos os dados sobre build do campão selecionado
 * pelo usuário
 *
 * @param {string} champion Nome do campẽao selecionado
 * @param {ChampionRequestData} championData Propriedade do campão selecionado. Build, spells...
 * @returns Compontente de build
 */

export default function ChampionBuild({
  championData: { build: championBuild },
  className,
}: Props) {
  const buildList = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<number>(null);

  useEffect(() => {
    setBoxWidth(buildList.current.getBoundingClientRect().width);
  }, []);

  return (
    <div
      className={
        className &&
        className.concat(
          ' flex flex-col justify-center gap-[20px] p-3 bg-primary border border-secondary'
        )
      }
    >
      {Object.keys(championBuild).map((build, i) => {
        return (
          <div
            key={`buy-order-${i}`}
            className="flex justify-between items-center z-0"
            ref={buildList}
          >
            <h3 className="uppercase relative">
              <span className="p-1 rounded bg-secondary overflow-hidden">
                {build}
              </span>
              <span
                className="z-[-1] absolute top-[50%] translate-y-[-50%] left-0 border-b border-secondary"
                style={{
                  width: boxWidth + 'px',
                }}
              ></span>
            </h3>
            <ul className="w-[min(70%,362px)] flex gap-2 justify-start bg-primary">
              {championBuild[build].map(
                (item: { name: string; id: number }, j: number) => {
                  return (
                    <li
                      className="group flex gap-[10px]"
                      key={`buy-${i}-item-${j}`}
                    >
                      <span className="relative">
                        <Tooltip>
                          {item.name ? item.name : 'Nome indisponível'}
                        </Tooltip>
                        <img
                          className="w-[30px] h-[30px] object-cover object-center rounded-sm border-2 border-secondary"
                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${items.find((object) => object.id == item.id).iconPath.split('/')[6].toLocaleLowerCase()}`}
                          alt={item.name}
                        />
                      </span>
                      {j !== championBuild[build].length - 1
                        ? i > 1
                          ? 'Or'
                          : '>'
                        : ''}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
