const {Load} = require('../loadModel');

module.exports.getLoad = async (options, queries) => {
  let loads;

  if (queries) {
    loads = await Load.find(
        options, {
          __v: 0,
        }, {
          skip: parseInt(queries.offset, 10),
          limit: queries.limit > 50 ? 10 : parseInt(queries.limit, 10),
          status: !!queries.status ? queries.status : {$eq: /\w*/},
        },
    );
  } else {
    loads = await Load.find(
        options, {
          __v: 0,
        } );
  }

  if (!loads) {
    throw new Error(`No loads found.`);
  }

  return loads;
};
