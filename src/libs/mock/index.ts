import Mock from 'mockjs'
import list from './list'

Mock.setup({
  timeout: '300-600'
});

Mock.mock(/\/api\/list/, 'get', list);

export default Mock;