export function init() {
    const display  = document.getElementById('calc-display');
    const calcGrid = document.querySelector('.calc-grid');
    if (!display || !calcGrid) return;
  
    let current     = '0';
    let shouldReset = false;
  
    const BUTTONS = [
      { label: 'C',  cls: 'special'  }, { label: '±', cls: 'special'  },
      { label: '%',  cls: 'special'  }, { label: '÷', cls: 'operator' },
      { label: '7' }, { label: '8' }, { label: '9' }, { label: '×', cls: 'operator' },
      { label: '4' }, { label: '5' }, { label: '6' }, { label: '-', cls: 'operator' },
      { label: '1' }, { label: '2' }, { label: '3' }, { label: '+', cls: 'operator' },
      { label: '0',  cls: 'zero'     }, { label: '.' }, { label: '=', cls: 'equals operator' },
    ];
  
    BUTTONS.forEach(({ label, cls }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      if (cls) cls.split(' ').forEach(c => btn.classList.add(c));
      btn.addEventListener('click', () => handleInput(label));
      calcGrid.appendChild(btn);
    });
  
    function handleInput(val) {
      if ('0123456789.'.includes(val)) {
        if (shouldReset) { current = val; shouldReset = false; }
        else { current = current === '0' && val !== '.' ? val : current + val; }
      } else if (val === 'C') {
        current = '0'; shouldReset = false;
      } else if (val === '±') {
        current = String(-parseFloat(current));
      } else if (val === '%') {
        current = String(parseFloat(current) / 100);
      } else if (['+', '-', '×', '÷'].includes(val)) {
        current += ` ${val} `;
      } else if (val === '=') {
        try {
          const expr = current.replace(/×/g, '*').replace(/÷/g, '/');
          // eslint-disable-next-line no-new-func
          current = String(Function('"use strict";return (' + expr + ')')());
        } catch { current = 'Error'; }
        shouldReset = true;
      }
      display.value = current;
    }
  }
  