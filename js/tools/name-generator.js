/**
 * Random Name Generator Tool
 * Generates random names from predefined lists
 */

const NAMES = {
  first: {
    male: [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
      'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald',
      'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George',
      'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary'
    ],
    female: [
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica',
      'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley',
      'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol', 'Amanda', 'Melissa',
      'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia'
    ],
    neutral: [
      'Alex', 'Cameron', 'Casey', 'Jordan', 'Parker', 'Quinn', 'Riley', 'Taylor',
      'Morgan', 'Avery', 'Sky', 'River', 'Rain', 'Sage', 'Blake', 'Drew', 'Dakota'
    ]
  },
  last: [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
  ]
};

function initNameGenerator() {
  const nameTypeSelect = document.getElementById('name-type');
  const nameCountInput = document.getElementById('name-count');
  const namesOutput = document.getElementById('names-output');
  const generateBtn = document.getElementById('generate-names');

  if (!nameTypeSelect) return;

  function getRandomName(type) {
    if (type === 'first-male') {
      return NAMES.first.male[Math.floor(Math.random() * NAMES.first.male.length)];
    } else if (type === 'first-female') {
      return NAMES.first.female[Math.floor(Math.random() * NAMES.first.female.length)];
    } else if (type === 'first-neutral') {
      return NAMES.first.neutral[Math.floor(Math.random() * NAMES.first.neutral.length)];
    } else if (type === 'last') {
      return NAMES.last[Math.floor(Math.random() * NAMES.last.length)];
    } else if (type === 'full-male') {
      return `${NAMES.first.male[Math.floor(Math.random() * NAMES.first.male.length)]} ${NAMES.last[Math.floor(Math.random() * NAMES.last.length)]}`;
    } else if (type === 'full-female') {
      return `${NAMES.first.female[Math.floor(Math.random() * NAMES.first.female.length)]} ${NAMES.last[Math.floor(Math.random() * NAMES.last.length)]}`;
    }
  }

  function generateNames() {
    const type = nameTypeSelect.value;
    const count = Math.min(parseInt(nameCountInput.value) || 1, 10);
    const names = [];

    for (let i = 0; i < count; i++) {
      names.push(getRandomName(type));
    }

    namesOutput.innerHTML = names
      .map((name) => `<p class="name-item" data-name="${name}">${name}</p>`)
      .join('');

    // Add click to copy functionality
    namesOutput.querySelectorAll('.name-item').forEach((item) => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        navigator.clipboard.writeText(name).then(() => {
          const originalText = item.textContent;
          item.textContent = '✓ Copied!';
          setTimeout(() => {
            item.textContent = originalText;
          }, 1500);
        });
      });
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', generateNames);
  }

  // Allow Enter key to generate
  nameCountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateNames();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNameGenerator);
} else {
  initNameGenerator();
}
