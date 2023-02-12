const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll( {
    include: [
      {
        model:Product,
        through:ProductTag,
      }
    ]
  })
  .then((tags) => res.status(200).json(tags))
  .catch((err) => res.status(500).json(err));
  // be sure to include its associated Product data
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where:{
      id: req.params.id,
    }
  })
  .then((tags) => res.status(200).json(tags))
  .catch((err) => res.status(500).json(err));
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create({
      id: req.body.tag_name,
  });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }

  
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      // find all associated tags from ProductTag
      return Tag.findAll({ where: { product_id: req.params.id } });
    })
    .then((tags) => {
      // get list of current tag_ids
      const tagIds = tags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newTags = req.body.tagIds
        .filter((tag_id) => !tagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            tag_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const tagsToRemove = tags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        Tag.destroy({ where: { id: tagsToRemove } }),
        Tag.bulkCreate(newTags),
      ]);
    })
    .then((updatedTags) => res.json(updatedTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id:req.params.id,
    },
  })
  .then((product) => res.status(200).json(product))
  .catch((err) => res.status(400).json(err));
});

module.exports = router;
