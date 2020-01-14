import { objectType } from 'nexus'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    // t.model.createdAt()
    // t.model.updatedAt()
    t.model.published()
    t.model.title()
    t.model.content()
    t.model.author()
    t.model.dataType()
    t.model.dfImaginaryPartX()
    t.model.dfImaginaryPartY()
    t.model.dfRealPartX()
    t.model.dfRealPartY()
    t.model.imaginaryPartX()
    t.model.imaginaryPartY()
    t.model.materialType()
  },
})
