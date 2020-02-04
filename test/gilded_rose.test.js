const {
  Shop,
  Item,
  isMaxQuality,
  isMinQuality,
  normalizeProducts,
  CATEGORY_BY_PRODUCT,
  UPDATE_RULES_BY_CATEGORY
} = require("../src/gilded_rose");


let products = [
  { name: "Aged Brie", sellIn: 15, quality: 30 },
  { name: "Backstage passes to a TAFKAL80ETC concert", sellIn: 11, quality: 20 },
  { name: "Sulfuras, Hand of Ragnaros", sellIn: 40, quality: 80 },
  { name: "Conjured", sellIn: 40, quality: 25 },
  { name: "Lolipop", sellIn: 14, quality: 21 }
]

let gildedRose

describe("Gilded Rose", () => {

  beforeAll(() => {
    let mockProducts = products.map(item => new Item(item.name, item.sellIn, item.quality))
    gildedRose = new Shop(mockProducts)
  })


  describe('Item - Properties', () => {
    it('should build an Item with its respective properties', () => {
      let item = new Item('Product', 10, 40)

      expect(item).toMatchObject({
        name: expect.any(String),
        sellIn: expect.any(Number),
        quality: expect.any(Number)
      })
    })
  })


  describe('Utils', () => {
    it('should return true if quality has reached max', () => {
      expect(isMaxQuality(50)).toBe(true)
      expect(isMaxQuality(49)).toBe(false)
    })

    it('should return true if quality has reached minimum', () => {
      expect(isMinQuality(0)).toBe(true)
      expect(isMinQuality(1)).toBe(false)
    })


    it('should get correct category by product name', () => {
      expect(CATEGORY_BY_PRODUCT[products[0].name]).toBe('special')
      expect(CATEGORY_BY_PRODUCT[products[1].name]).toBe('passes')
      expect(CATEGORY_BY_PRODUCT[products[2].name]).toBe('legendary')
    })

    it('should normalize products correctly by adding category by product name', () => {
      let normalized = normalizeProducts(products)

      expect(normalized[0]).toMatchObject({
        name: expect.any(String),
        sellIn: expect.any(Number),
        quality: expect.any(Number),
        category: expect.any(String),
      })

      expect(normalized[0].category).toBe('special')
      expect(normalized[1].category).toBe('passes')
      expect(normalized[2].category).toBe('legendary')
    })

  })

  describe('Product Category Rules - Mediocre', () => {
    it('should decrease quality twice as fast (compared to regular products)', () => {
      let mediocreProduct = gildedRose.items[3]

      let updated = UPDATE_RULES_BY_CATEGORY[mediocreProduct.category](mediocreProduct)
      expect(updated.quality).toBe(23)
    })
  })

  describe('Product Category Rules - Regular  ', () => {

    it('should make sure all items have correct Properties', () => {
      let normalizedItems = normalizeProducts(products)

      normalizedItems.forEach(products => {
        expect(products.sellIn).toBeDefined()
      })
    })

    it('should never have contain a negative "Quality"', () => {
      let prod1 = new Item('TestProduct1', 10, 0)
      let prod2 = new Item('TestProduct2', 10, 10)

      let normalizedProducts = normalizeProducts([prod1, prod2])
      let normalizedProduct1 = normalizedProducts[0]

      let updated1 = UPDATE_RULES_BY_CATEGORY[normalizedProduct1.category](normalizedProduct1)

      expect(updated1.sellIn).toBe(9)
      expect(updated1.quality).toBe(0)

      let normalizedProduct2 = normalizedProducts[1]
      let updated2 = UPDATE_RULES_BY_CATEGORY[normalizedProduct2.category](normalizedProduct2)

      expect(updated2.sellIn).toBe(9)
      expect(updated2.quality).toBe(9)


    })

    it('should degrade quality twice as fast after "SellIn" time is overdue', () => {
      let prod1 = new Item('TestProduct', -1, 20)
      let normalizedProduct = normalizeProducts([prod1])[0]

      let updated = UPDATE_RULES_BY_CATEGORY[normalizedProduct.category](normalizedProduct)

      expect(updated.quality).toBe(18)

      let updated2 = UPDATE_RULES_BY_CATEGORY[updated.category](updated)

      expect(updated2.quality).toBe(16)


    })

    it('should never be over 50, the "Quality" of regular products', () => {
      let prod1 = new Item('RegularProduct1', 10, 50)
      let prod2 = new Item('RegularProduct2', 10, 60)

      let normalizedProduct1 = normalizeProducts([prod1, prod2])[0]
      let normalizedProduct2 = normalizeProducts([prod1, prod2])[0]

      expect(normalizedProduct1.quality).toBe(50)
      expect(normalizedProduct2.quality).toBe(50)
    })

  })

  describe('Product Category Rules - Special', () => {
    it('should increase "Quality"  products ', () => {
      let specialProduct = gildedRose.items[0]

      let specialUpdated = UPDATE_RULES_BY_CATEGORY[specialProduct.category](specialProduct)
      expect(specialUpdated.quality).toBe(31)
    })

    it('should never be over 50, the "Quality" of special products ', () => {
      let specialProd = new Item('Aged Brie', 10, 50)
      let normalizedSpecial = normalizeProducts([specialProd])[0]

      let specialUpdated = UPDATE_RULES_BY_CATEGORY[normalizedSpecial.category](normalizedSpecial)
      expect(specialUpdated.quality).toBe(50)

      let specialUpdatedTwice = UPDATE_RULES_BY_CATEGORY[specialUpdated.category](specialUpdated)
      expect(specialUpdatedTwice.quality).toBe(50)

    })
  })

  describe('Product Category Rules - Legendary', () => {
    it('should never be sold', () => {
      let legendaryProduct = gildedRose.items[2]

      let updatedLegendary = UPDATE_RULES_BY_CATEGORY[legendaryProduct.category](legendaryProduct)
      expect(updatedLegendary.sellIn).toBe(0)

      let updatedLegendaryTwice = UPDATE_RULES_BY_CATEGORY[updatedLegendary.category](updatedLegendary)
      expect(updatedLegendaryTwice.sellIn).toBe(0)

    })

    it('should never decrease its quality (always 80)', () => {
      let legendaryProduct = gildedRose.items[2]

      let updatedLegendary = UPDATE_RULES_BY_CATEGORY[legendaryProduct.category](legendaryProduct)
      expect(updatedLegendary.quality).toBe(80)

      let updatedLegendaryTwice = UPDATE_RULES_BY_CATEGORY[updatedLegendary.category](updatedLegendary)
      expect(updatedLegendaryTwice.quality).toBe(80)

    })
  })

  describe('Product Category Rules - Passes', () => {
    it('should increase quality by 2 when there are 10 days or less', () => {
      let passProduct = gildedRose.items[1]

      let updated = UPDATE_RULES_BY_CATEGORY[passProduct.category](passProduct)
      expect(updated.sellIn).toBe(10)
      expect(updated.quality).toBe(21)

      let updatedTwice = UPDATE_RULES_BY_CATEGORY[updated.category](updated)
      expect(updatedTwice.sellIn).toBe(9)
      expect(updatedTwice.quality).toBe(23)

    })

    it('should increase quality by 3 when there are 5 days or less', () => {
      let passProd = new Item('Backstage passes to a TAFKAL80ETC concert', 5, 30)
      let normalized = normalizeProducts([passProd])[0]

      let updated = UPDATE_RULES_BY_CATEGORY[normalized.category](normalized)
      expect(updated.sellIn).toBe(4)
      expect(updated.quality).toBe(33)
    })
    it('should drop quality to 0 when past concert', () => {
      let passProd = new Item('Backstage passes to a TAFKAL80ETC concert', 0, 30)
      let normalized = normalizeProducts([passProd])[0]

      let updated = UPDATE_RULES_BY_CATEGORY[normalized.category](normalized)
      expect(updated.quality).toBe(0)

    })
  })



  describe('Shop - Integration', () => {
    it('should update all Items accordingly to its categories', () => {
      const updatedShop = gildedRose.updateQuality()


      let specialProd = updatedShop[0]
      let passesProd = updatedShop[1]
      let legendaryProd = updatedShop[2]
      let mediocreProduct = updatedShop[3]
      let regularProduct = updatedShop[4]

      expect(specialProd.quality).toBe(31)
      expect(passesProd.quality).toBe(21)
      expect(legendaryProd.quality).toBe(80)
      expect(mediocreProduct.quality).toBe(23)
      expect(regularProduct.quality).toBe(20)
    })
  })

});
