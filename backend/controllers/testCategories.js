const { FindAll } = require('../controllers/categories.controller');
const { FindOne } = require('../controllers/categories.controller');
const { Create } = require('../controllers/categories.controller');

FindAll()
    .then(() => {
        console.log('FindAll Done');
        return FindOne(2);
    })
    .then(() => {
        console.log('FindOne Done');
        return Create({ id: '3',parentId: '', name: 'Sudaderas', description: 'Sudaderas de todo tipo', created_at: '2021-09-01' });
    })
    .then(() => {
        console.log('Create Done');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });