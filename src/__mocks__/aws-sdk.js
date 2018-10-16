const getParameters = opts => ({
  promise: async () => ({
    Parameters: opts.Names.map(param => ({ Name: param, Value: `${param}-value` })),
    InvalidParameters: [],
  }),
});

const SSM = jest.fn().mockImplementation(() => ({
  getParameters,
}));

export default {
  SSM,
};
