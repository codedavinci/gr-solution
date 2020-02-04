const { Shop, Item } = require("../src/gilded_rose");


let products = [
  { name: "Aged Brie", sellIn: 15, quality: 30 },
  { name: "Backstage passes to a TAFKAL80ETC concert", sellIn: 12, quality: 20 },
  { name: "Sulfuras, Hand of Ragnaros", sellIn: 40, quality: 80 }
]



let gildedRose

describe("Gilded Rose", () => {

  beforeAll(() => {
    let mockProducts = products.map(item => new Item(item.name, item.sellIn, item.quality))
    gildedRose = new Shop(mockProducts)
  })



  describe('Product Category - Regular ', () => {

    it.skip('should make sure all items have a "SellIn" Property', () => {

    })

    it.skip('should make sure make sure all items have a "Quality" Property', () => { })

    it.skip('should never have contain a negative "Quality"', () => { })

    it.skip('should degrade quality twice as fast after "SellIn" time is overdue', () => { })

    it.skip('should never be over 50, the "Quality" of regular products', () => { })

  })

  describe.skip('Product Category - Special', () => {
    it('should increase "Quality"  products ', () => { })
  })

  describe.skip('Product Category - Legendary', () => {
    it('should never be sold', () => { })

    it('should never decrease its quality', () => { })

    it('should have quality equals 80 if "Sulfuras"', () => { })
  })

  describe.skip('Product Category - Passes', () => {
    it('should increase quality by 2 when there are 10 days or less', () => { })
    it('should increase quality by 3 when there are 5 days or less', () => { })
    it('should drop quality to 0 when past concert', () => { })
  })

  describe.skip('Product Category - Conjured', () => {
    it('should decrease quality twice as fast (compared to regular products)', () => { })
  })

});
