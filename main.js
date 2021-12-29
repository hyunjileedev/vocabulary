'use strict';

fetchWords('data/words.json').then(words => {
  const vocabularies = words.map(createVocabulary);
  const vocabularyList = document.querySelector('.vocabulary-list');
  vocabularyList.append(...vocabularies);
  setEventListeners(vocabularyList);
});

async function fetchWords(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not OK');
  }
  const obj = await response.json();
  return obj.items;
}

function createVocabulary(word) {
  const vocabulary = document.createElement('li');
  vocabulary.setAttribute('class', 'vocabulary');
  vocabulary.setAttribute('data-id', `${word.id}`);
  vocabulary.innerHTML = `
    <input type="checkbox" class="vocabulary__checkbox" data-id=${word.id}></input>
    <div class="vocabulary__content">
        <span class="vocabulary__word">${word.word}</span>
        <span class="vocabulary__meaning">${word.meaning}</span>
    </div>
    `;
  return vocabulary;
}

function setEventListeners(vocabularyList) {
  const checkedArray = [];

  vocabularyList.addEventListener('change', e => onCheck(e, checkedArray));

  const scrollBtn = document.querySelector('.scroll');
  scrollBtn.addEventListener('click', () => onScrollClick(checkedArray));

  const arrowUpBtn = document.querySelector('.arrow-up');
  arrowUpBtn.addEventListener('click', onArrowUpClick);
}

function onCheck(e, checkedArray) {
  const target = e.target;
  const id = target.dataset.id;
  const checked = document.querySelector(`[data-id="${id}"]`);
  if (target.checked) {
    checkedArray.push(checked);
    checkedArray.sort((a, b) => a.dataset.id - b.dataset.id);
  } else {
    const index = checkedArray.indexOf(checked);
    checkedArray.splice(index, 1);
  }
}

let i = 0;
function onScrollClick(checkedArray) {
  if (i > checkedArray.length - 1) {
    return;
  }
  const toBeScrolled = checkedArray[i++];
  toBeScrolled.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function onArrowUpClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  i = 0;
}
