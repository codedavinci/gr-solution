

const isMaxQuality = (quality) => quality >= 50
const isMinQuality = (quality) => quality <= 0
const isOverdue = (sellIn) => sellIn <= 0



const CATEGORY_BY_PRODUCT = {
  'Aged Brie': 'special',
  'Backstage passes to a TAFKAL80ETC concert': 'passes',
  'Sulfuras, Hand of Ragnaros': 'legendary',
  'Conjured': 'mediocre'
}


const regularRule = ({ sellIn, quality, ...rest }) => ({
  ...rest,
  sellIn: sellIn - 1,
  quality: isMinQuality(quality) ? 0 :
    isMaxQuality(quality) ? 50 :
      isOverdue(sellIn) ? (quality - 2) : (quality - 1)
})


const specialRule = ({ sellIn, quality, ...rest }) => ({
  ...rest,
  sellIn: sellIn - 1,
  quality: isMinQuality(quality) ? 0 :
    isMaxQuality(quality) ? 50 : quality + 1
})


const legendaryRule = ({ sellIn, quality, ...rest }) => ({
  ...rest,
  sellIn: 0,
  quality: 80
})


const passesRule = ({ sellIn, quality, ...rest }) => {

  if (isMinQuality(quality)) {
    return {
      ...rest,
      sellIn: sellIn - 1,
      quality: 0
    }
  }

  let finalQuality

  if (isOverdue(sellIn)) {
    finalQuality = 0
  } else {
    if (sellIn <= 10 && sellIn >= 5) {
      finalQuality = !isMaxQuality(quality) ? (quality + 2) : 50
    }

    if (sellIn <= 5 && sellIn >= 1) {
      finalQuality = !isMaxQuality(quality) ? (quality + 3) : 50
    }
  }

  return {
    ...rest,
    sellIn: sellIn - 1,
    quality: typeof finalQuality !== "undefined" ?
      finalQuality : quality + 1
  }

}

const mediocreRule = ({ sellIn, quality, ...rest }) => ({
  ...rest,
  sellIn: sellIn - 1,
  quality: isMinQuality(quality) ? 0 :
    isMaxQuality(quality) ? 50 : quality - 2
})

const UPDATE_RULES_BY_CATEGORY = {
  mediocre: mediocreRule,
  regular: regularRule,
  special: specialRule,
  legendary: legendaryRule,
  passes: passesRule
}


const normalizeProducts = (products) => {
  return products.map(product => ({
    ...product,
    category: CATEGORY_BY_PRODUCT[product.name] || 'regular'
  }))
}



class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}


class Shop {
  constructor(items = []) {
    this.items = normalizeProducts(items);
  }
  updateQuality() {
    this.items = this.items.map(item => UPDATE_RULES_BY_CATEGORY[item.category](item))

    return this.items
  }
}

module.exports = {
  Item,
  Shop,
  isMaxQuality,
  isMinQuality,
  normalizeProducts,
  CATEGORY_BY_PRODUCT,
  UPDATE_RULES_BY_CATEGORY
}
