function PolyJQ() {
  let polyjq = (sel) => document.querySelector(sel);
  polyjq.noop = () => {};
  return polyjq;
};

define(PolyJQ);

polyjq = PolyJQ();
