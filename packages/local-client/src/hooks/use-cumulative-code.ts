import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  const { data, order } = useTypedSelector((state) => state.cells);
  const orderedCells = order.map((id) => data[id]);
  const showFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';

    var show = (value) => {
      const root = document.querySelector('#root');
      
      if (typeof value === 'function') {
        value = value();
      }

      if(typeof value === 'object') {
        if(value.$$typeof && value.props){
          _ReactDOM.render(value, root);
        } else {
          root.innerHTML = JSON.stringify(value);
        }
      } else {
        root.innerHTML = value;
      }
    }
  `;
  const showFuncNoop = 'var show = () => {}';
  const cumulativeCode: string[] = [];
  for (let c of orderedCells) {
    if (c.type === 'code') {
      if (c.id === cellId) {
        cumulativeCode.push(showFunc);
      } else {
        cumulativeCode.push(showFuncNoop);
      }
      cumulativeCode.push(c.content);
    }
    if (c.id === cellId) {
      break;
    }
  }
  return cumulativeCode.join('\n');
};
