export async function listItems(_req, res) {
  res.json([{ id: 'ex-1', name: 'Example Item' }]);
}

export async function createItem(req, res) {
  const { name } = req.body;
  res.status(201).json({ id: 'created-1', name });
}
