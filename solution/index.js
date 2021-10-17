module.exports = async function (Homework) {
  const {
    add,
    less
  } = Homework;

  const promisify = (fn) => {
    return (...args) => {
      return new Promise((resolve, reject) => {
        function customCallback(result) {
          return resolve(result)
        }

        args.push(customCallback)
        fn(...args)
      })
    }
  }

  return (array, fn, initialValue, cb) => {
    const asyncAddPromise = promisify(add);
    const asyncLessPromise = promisify(less);
    const asyncElementPromise = promisify(array.get);

    let acc = initialValue;
    let currentIdx = 0;
    const asyncLengthPromise = promisify(array.length);
    const length = await asyncLengthPromise().then(res => res);
    let isIdxLessLength = true;

    while (isIdxLessLength) {
      const currentElement = await asyncElementPromise(currentIdx).then(res => res);
      acc = await new Promise((resolve) => fn(acc, currentElement, currentIdx, array, (res) => resolve(res)));
      currentIdx = await asyncAddPromise(currentIdx, 1).then(res => res);
      isIdxLessLength = await asyncLessPromise(currentIdx, length).then(res => res);
    }

    cb(acc);
  }
}
