import runes from '@/data/runes.json'
import runeStyles from '@/data/runeStyles.json'

type RunesComponentProps = {
  primaryRunesList: number[],
  secondaryRunesList: number[]
}

const Runes = ({ primaryRunesList, secondaryRunesList }: RunesComponentProps) => {
  console.log(runes[0].iconPath.split('v1/')[1])

  const getRuneImage = (id: number) => {
    const url = runes
      .find((object) => object.id === id)
      ?.iconPath
      .toLowerCase()
      .split('v1/')[1]

    if (url) {
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${url}`
    } else {
      return ''
    }
  }

  const getRuneStyleImage = (id: number) => {
    const url = runeStyles
      .find((object) => object.id === id)
      ?.iconPath
      .toLowerCase()
      .split('v1/')[1]

    if (url) {
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${url}`
    } else {
      return ''
    }
  }

  return (
    <div className='flex w-full'>
      <div className='flex flex-col w-[50%] space-y-4'>
        <div className='flex justify-center'>
          <img
            className='w-6 h-6'
            src={getRuneStyleImage(primaryRunesList[0])} 
            alt={primaryRunesList[0].toString()}
          />
        </div>
        {
          primaryRunesList.slice(1).map((rune) => (
            <div className='flex justify-center'>
              <img
                className='w-12 h-12'
                src={getRuneImage(rune)} 
                alt={rune.toString()}
              />
            </div>
          ))
        }
      </div>

      <div className='flex flex-col w-[50%] space-y-4'>
        <div className='flex justify-center'>
          <img
            className='w-6 h-6'
            src={getRuneStyleImage(secondaryRunesList[0])} 
            alt={secondaryRunesList[0].toString()}
          />
        </div>
        {
          secondaryRunesList.slice(1).map((rune) => (
            <div className='flex justify-center'>
              <img
                className='w-12 h-12'
                src={getRuneImage(rune)} 
                alt={rune.toString()}
              />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Runes;