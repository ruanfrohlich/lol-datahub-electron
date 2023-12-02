import items from '../../../data/items.json'

type ItemsListComponentProps = {
  itemsNumberList: number[]
};

const ItemsList = ({ itemsNumberList } : ItemsListComponentProps) => {

  const getItemImage = (id: number) => {
    const url = items
      .find((object) => object.id === id)
      ?.iconPath
      .toLowerCase()
      .split('/')

    if (url) {
      return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/${url[url.length-1]}`
    } else {
      return ''
    }
  }

  return (
    <div className="flex space-x-8">
      { 
        itemsNumberList.map((item) => (
          <div className="w-16 h-16 bg-red-500">
            <img src={getItemImage(item)} alt={item.toString()}/>
          </div>
        ))
      }
    </div>
  )
}

export default ItemsList;