const rawMoments = [
  {
    id: 'm-01',
    type: 'music',
    timestamp: '2026-09-18T07:42:00Z',
    detail: 'Played "Sunrise Again" by Nova Lane',
    emotion: 'grounded',
  },
  {
    id: 'l-01',
    type: 'location',
    timestamp: '2026-09-18T08:15:00Z',
    detail: 'Arrived at Downtown Station',
    emotion: 'focused',
  },
  {
    id: 'p-01',
    type: 'purchase',
    timestamp: '2026-09-18T08:19:00Z',
    detail: 'Bought oat latte ($6.40)',
    amount: 6.4,
    emotion: 'rewarded',
  },
  {
    id: 'msg-01',
    type: 'message',
    timestamp: '2026-09-18T12:21:00Z',
    detail: 'Text from Sam: "How is launch prep going?"',
    emotion: 'connected',
  },
  {
    id: 'm-02',
    type: 'music',
    timestamp: '2026-09-19T06:55:00Z',
    detail: 'Played "Tiny Victories" by The Winters',
    emotion: 'hopeful',
  },
  {
    id: 'l-02',
    type: 'location',
    timestamp: '2026-09-19T10:05:00Z',
    detail: 'Checked in at Riverside Park',
    emotion: 'calm',
  },
  {
    id: 'p-02',
    type: 'purchase',
    timestamp: '2026-09-19T13:10:00Z',
    detail: 'Purchased sketchbook ($14.00)',
    amount: 14,
    emotion: 'curious',
  },
  {
    id: 'msg-02',
    type: 'message',
    timestamp: '2026-09-19T20:48:00Z',
    detail: 'Voice note from mom: "Proud of you."',
    emotion: 'grateful',
  },
];

const state = {
  selectedType: 'all',
  search: '',
  selectedId: null,
};

const timelineNode = document.getElementById('timeline');
const chaptersNode = document.getElementById('chapters');
const inspectorNode = document.getElementById('inspector');
const filtersNode = document.getElementById('typeFilters');
const searchInput = document.getElementById('searchInput');

const typeOrder = ['all', 'music', 'location', 'purchase', 'message'];

function normalize(value) {
  return String(value).toLowerCase();
}

function sortedMoments() {
  return [...rawMoments].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
}

function filteredMoments() {
  return sortedMoments().filter((item) => {
    const typePass = state.selectedType === 'all' || item.type === state.selectedType;
    const searchPass =
      !state.search ||
      normalize(item.detail).includes(state.search) ||
      normalize(item.emotion).includes(state.search);
    return typePass && searchPass;
  });
}

function buildChapters(moments) {
  const byDate = new Map();

  moments.forEach((moment) => {
    const day = moment.timestamp.slice(0, 10);
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day).push(moment);
  });

  return [...byDate.entries()].map(([day, entries]) => {
    const music = entries.find((item) => item.type === 'music');
    const place = entries.find((item) => item.type === 'location');
    const spend = entries
      .filter((item) => item.type === 'purchase')
      .reduce((sum, item) => sum + (item.amount || 0), 0);
    const social = entries.filter((item) => item.type === 'message').length;

    return {
      day,
      title: `${new Date(day).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })}: ${entries.length} moments`,
      summary: `${music ? music.detail : 'No music tracked'}, ${
        place ? `centered around ${place.detail.toLowerCase()}` : 'no location ping'
      }, $${spend.toFixed(2)} spent, ${social} meaningful message${social === 1 ? '' : 's'}.`,
    };
  });
}

function renderFilters() {
  filtersNode.innerHTML = '';

  typeOrder.forEach((type) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `chip ${state.selectedType === type ? 'active' : ''}`;
    button.textContent = type === 'all' ? 'All moments' : type;
    button.addEventListener('click', () => {
      state.selectedType = type;
      render();
    });
    filtersNode.append(button);
  });
}

function renderTimeline(moments) {
  timelineNode.innerHTML = '';

  if (!moments.length) {
    timelineNode.innerHTML = '<li>No moments match your filter.</li>';
    return;
  }

  moments.forEach((item) => {
    const listItem = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';
    button.addEventListener('click', () => {
      state.selectedId = item.id;
      renderInspector(moments, item.id);
    });
    button.innerHTML = `<strong>${item.type.toUpperCase()}</strong> · ${item.detail}<small>${new Date(
      item.timestamp,
    ).toLocaleString()} · mood: ${item.emotion}</small>`;

    listItem.append(button);
    timelineNode.append(listItem);
  });
}

function renderChapters(moments) {
  chaptersNode.innerHTML = '';

  buildChapters(moments).forEach((chapter) => {
    const article = document.createElement('article');
    article.className = 'chapter';
    article.innerHTML = `<h3>${chapter.title}</h3><p>${chapter.summary}</p>`;
    chaptersNode.append(article);
  });
}

function renderInspector(moments, id) {
  const index = moments.findIndex((item) => item.id === id);
  if (index < 0) {
    inspectorNode.textContent = 'Select a moment in the timeline to see how it fits your day.';
    return;
  }

  const current = moments[index];
  const previous = moments[index - 1];
  const next = moments[index + 1];

  inspectorNode.innerHTML = `
    <strong>${current.detail}</strong>
    <p>${current.type.toUpperCase()} at ${new Date(current.timestamp).toLocaleTimeString()} with a ${
      current.emotion
    } tone.</p>
    <p>${
      previous ? `Before this: ${previous.detail}.` : 'This is the first recorded moment in view.'
    }</p>
    <p>${next ? `Next: ${next.detail}.` : 'This is currently the final moment in view.'}</p>
  `;
}

function render() {
  renderFilters();
  const moments = filteredMoments();
  renderChapters(moments);
  renderTimeline(moments);
  renderInspector(moments, state.selectedId);
}

searchInput.addEventListener('input', (event) => {
  state.search = normalize(event.target.value.trim());
  render();
});

render();
