const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//http://localhost:3001/api/categories/
router.get('/',async (req, res) => {
  // find all categories
    try {
      const categoryData = await Category.findAll({
        include: [{ model: Product }],
      });
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  // be sure to include its associated Products
//http://localhost:3001/api/categories/:id
router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    where:{
      id: req.params.id,
    }
  })
  .then((categories) => res.json(categories))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
  // be sure to include its associated Category and Tag data
});
  // be sure to include its associated Products

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
  .then((category) => res.status(200).json(category))
  .catch((err) => res.status(400).json(err));
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((category) => res.status(200).json(category))
  .catch((err) => res.status(400).json(err));
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id:req.params.id,
    },
  })
  .then((category) => res.status(200).json(category))
  .catch((err) => res.status(400).json(err));
});

module.exports = router;
