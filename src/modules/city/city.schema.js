const { isRequired, isString, isPositiveInt } = require('../../common/helpers/validators');

const getCities = {
  query: {
    limit: [],
  },
};

const getCityDetail = {
  params: {
    id: [isRequired('ID thành phố'), isPositiveInt('ID thành phố')],
  },
};

const createCity = {
  body: {
    name: [isRequired('Tên thành phố'), isString('Tên thành phố')],
    subtitle: [],
    thumbnail: [],
  },
};

const updateCity = {
  params: {
    id: [isRequired('ID thành phố'), isPositiveInt('ID thành phố')],
  },
  body: {
    name: [],
    subtitle: [],
    thumbnail: [],
  },
};

const deleteCity = {
  params: {
    id: [isRequired('ID thành phố'), isPositiveInt('ID thành phố')],
  },
};

module.exports = { getCities, getCityDetail, createCity, updateCity, deleteCity };
