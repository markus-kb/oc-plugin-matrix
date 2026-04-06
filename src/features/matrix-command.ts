export const createMatrixCommand = (run: () => void) => {
  return {
    title: "/matrix",
    value: "/matrix",
    slash: {
      name: "matrix",
    },
    onSelect() {
      run();
    },
  };
};
