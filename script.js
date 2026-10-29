const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const navLinks = [...document.querySelectorAll('.primary-nav .nav-link')];
const dropdowns = [...document.querySelectorAll('[data-dropdown]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopHover = window.matchMedia('(hover: hover) and (min-width: 901px)');
const compareEnglish = new Intl.Collator('en', { sensitivity: 'base' }).compare;

const setDropdownState = (dropdown, isOpen) => {
  dropdown.classList.toggle('is-open', isOpen);
  dropdown.querySelector('[data-dropdown-link]')?.setAttribute('aria-expanded', String(isOpen));
};

const closeDropdowns = (except = null) => {
  dropdowns.forEach((dropdown) => {
    if (dropdown === except) return;
    setDropdownState(dropdown, false);
  });
};

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  primaryNav?.classList.remove('open');
  document.body.classList.remove('menu-open');
  closeDropdowns();
};

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  primaryNav?.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
  if (isOpen) closeDropdowns();
});

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener('mouseenter', () => {
    if (!desktopHover.matches) return;
    closeDropdowns(dropdown);
    setDropdownState(dropdown, true);
  });
  dropdown.addEventListener('mouseleave', () => {
    if (desktopHover.matches) setDropdownState(dropdown, false);
  });
  dropdown.addEventListener('focusin', () => {
    closeDropdowns(dropdown);
    setDropdownState(dropdown, true);
  });
  dropdown.addEventListener('focusout', (event) => {
    if (!dropdown.contains(event.relatedTarget)) setDropdownState(dropdown, false);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const openToggle = document.querySelector('.nav-dropdown.is-open [data-dropdown-link]');
  closeDropdowns();
  if (primaryNav?.classList.contains('open')) closeMenu();
  openToggle?.focus();
});

document.querySelectorAll('.primary-nav a').forEach((link) => link.addEventListener('click', closeMenu));

const handleHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
handleHeader();
window.addEventListener('scroll', handleHeader, { passive: true });

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((element) => {
  const delay = element.dataset.delay;
  if (delay) element.style.setProperty('--delay', `${delay}ms`);
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -35px' });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const peopleCards = [...document.querySelectorAll('[data-person]')];
const peopleSearch = document.querySelector('#people-search');
const peopleRoleFilter = document.querySelector('#people-role-filter');
const peopleAreaFilter = document.querySelector('#people-area-filter');
const peopleResults = document.querySelector('#people-results');
const peopleCardView = document.querySelector('#people-card-view');
const peopleTableView = document.querySelector('#people-table-view');
const peopleTableBody = document.querySelector('#people-table tbody');
const peopleEmpty = document.querySelector('#people-empty');
const peopleViewButtons = [...document.querySelectorAll('[data-people-view]')];
const peopleGroups = [...document.querySelectorAll('[data-people-group]')];
let currentPeopleView = 'table';
let peopleRows = [];
let peopleGroupCards = [];

const getText = (element, selector) => element.querySelector(selector)?.textContent.trim() || '';
const peopleAreaLabels = {
  'analysis-pde': {
    label: 'Analysis & PDE',
    search: 'analysis partial differential equations nonlinear pde fluid mechanics',
  },
  'bifurcation-theory-pdes': {
    label: 'Bifurcation Theory & PDEs',
    search: 'reaction-diffusion systems equations elliptic parabolic bifurcation theory applications dynamical systems singular perturbation mathematical biology',
  },
  'harmonic-analysis': {
    label: 'Harmonic Analysis',
    search: 'harmonic analysis',
  },
  'nonlinear-diffusion-image-processing': {
    label: 'Nonlinear Diffusion & Image Processing',
    search: 'nonlinear diffusion pseudo-parabolic non-local reaction-diffusion equations pde image processing',
  },
  'dynamics-geometry': {
    label: 'Dynamics & Geometry',
    search: 'dynamical systems geometry hamiltonian dynamics celestial mechanics symplectic geometry',
  },
  'stochastic-dynamics': {
    label: 'Stochastic Dynamical Systems',
    search: 'stochastic dynamical systems stochastic differential equations averaging recurrent dynamics',
  },
};
const peopleCommunityLabels = {
  faculty: 'Faculty Member',
  junior: 'Junior Researcher',
};
const getAreaLabel = (element) => peopleAreaLabels[element.dataset.area]?.search || '';
// Read immutable card data once; sorting and filtering reuse it.
const peopleDetails = new Map(peopleCards.map((card) => {
  const name = getText(card, '.person-name-en');
  const search = `${card.textContent} ${getAreaLabel(card)} ${card.dataset.group}`.toLocaleLowerCase();
  card.dataset.search ||= search;
  return [card, { name, surname: name.split(/\s+/).filter(Boolean).at(-1) || name, search }];
}));

const arrangePeopleByCommunity = () => {
  peopleCards.sort((left, right) => {
    const leftDetails = peopleDetails.get(left);
    const rightDetails = peopleDetails.get(right);
    return compareEnglish(leftDetails.surname, rightDetails.surname)
      || compareEnglish(leftDetails.name, rightDetails.name);
  });
  const groupLists = new Map(peopleGroups.map((group) => [group.id, group.querySelector('.people-list')]));
  peopleCards.forEach((card) => {
    const targetList = groupLists.get(card.dataset.group);
    targetList?.append(card);
  });
  peopleGroupCards = peopleGroups.map((group) => ({
    group,
    cards: [...group.querySelectorAll('[data-person]')],
  }));
};

const buildPeopleTable = () => {
  if (!peopleTableBody || !peopleCards.length) return;
  const fragment = document.createDocumentFragment();

  peopleRows = peopleCards.map((card) => {
    const row = document.createElement('tr');
    row.dataset.group = card.dataset.group;
    row.dataset.area = card.dataset.area;
    row.dataset.role = card.dataset.role;
    row.dataset.search = peopleDetails.get(card).search;

    const nameCell = document.createElement('td');
    const name = document.createElement('span');
    name.className = 'table-name';
    const englishName = document.createElement('span');
    englishName.textContent = peopleDetails.get(card).name;
    name.append(englishName);
    const chineseName = getText(card, '.person-name-zh');
    if (chineseName) {
      const chinese = document.createElement('span');
      chinese.lang = 'zh-Hans';
      chinese.textContent = chineseName;
      name.append(chinese);
    }
    nameCell.append(name);

    const roleCell = document.createElement('td');
    const role = document.createElement('span');
    role.className = 'table-role';
    role.textContent = getText(card, '.person-role');
    const periodText = getText(card, '.person-period');
    if (periodText) {
      const period = document.createElement('small');
      period.textContent = periodText;
      role.append(period);
    }
    roleCell.append(role);

    const communityCell = document.createElement('td');
    const community = document.createElement('span');
    community.className = 'table-community';
    community.textContent = peopleCommunityLabels[card.dataset.group] || 'Member';
    communityCell.append(community);

    const researchCell = document.createElement('td');
    researchCell.textContent = getText(card, '.person-research');

    const directionCell = document.createElement('td');
    const direction = document.createElement('span');
    direction.className = 'table-community';
    direction.textContent = peopleAreaLabels[card.dataset.area]?.label || 'Other';
    directionCell.append(direction);

    const linksCell = document.createElement('td');
    const links = card.querySelector('.person-links')?.cloneNode(true);
    if (links) {
      links.className = 'table-links';
      linksCell.append(links);
    } else {
      linksCell.textContent = '—';
    }

    row.append(nameCell, roleCell, communityCell, researchCell, directionCell, linksCell);
    fragment.append(row);
    return row;
  });

  peopleTableBody.replaceChildren(fragment);
};

const matchesPeopleFilter = (cardOrRow, query, roleFilter, areaFilter) => {
  const searchText = cardOrRow.dataset.search;
  const matchesQuery = !query || searchText.includes(query);
  const matchesRole = roleFilter === 'all'
    || cardOrRow.dataset.group === roleFilter
    || cardOrRow.dataset.role === roleFilter;
  const matchesArea = areaFilter === 'all' || cardOrRow.dataset.area === areaFilter;
  return matchesQuery && matchesRole && matchesArea;
};

const updatePeopleDirectory = () => {
  if (!peopleCards.length) return;
  const query = peopleSearch?.value.trim().toLocaleLowerCase() || '';
  const roleFilter = peopleRoleFilter?.value || 'all';
  const areaFilter = peopleAreaFilter?.value || 'all';
  let visibleCount = 0;

  peopleCards.forEach((card, index) => {
    const isMatch = matchesPeopleFilter(card, query, roleFilter, areaFilter);
    card.hidden = !isMatch;
    if (peopleRows[index]) peopleRows[index].hidden = !isMatch;
    if (isMatch) visibleCount += 1;
  });

  peopleGroupCards.forEach(({ group, cards }) => {
    const hasVisibleCard = cards.some((card) => !card.hidden);
    group.hidden = !hasVisibleCard;
  });

  if (peopleResults) {
    peopleResults.textContent = visibleCount === peopleCards.length && !query && roleFilter === 'all' && areaFilter === 'all'
      ? `Showing all ${visibleCount} people`
      : `Showing ${visibleCount} of ${peopleCards.length} people`;
  }
  if (peopleEmpty) peopleEmpty.hidden = visibleCount !== 0;
};

const setPeopleView = (view) => {
  if (!peopleCardView || !peopleTableView) return;
  currentPeopleView = view === 'table' ? 'table' : 'cards';
  peopleCardView.hidden = currentPeopleView !== 'cards';
  peopleTableView.hidden = currentPeopleView !== 'table';
  peopleViewButtons.forEach((button) => {
    const isActive = button.dataset.peopleView === currentPeopleView;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  updatePeopleDirectory();
};

if (peopleCards.length) {
  arrangePeopleByCommunity();
  buildPeopleTable();
  const initialGroup = window.location.hash.slice(1);
  if (peopleRoleFilter && ['faculty', 'junior'].includes(initialGroup)) peopleRoleFilter.value = initialGroup;
  setPeopleView('table');
  peopleSearch?.addEventListener('input', updatePeopleDirectory);
  peopleRoleFilter?.addEventListener('change', updatePeopleDirectory);
  peopleAreaFilter?.addEventListener('change', updatePeopleDirectory);
  peopleViewButtons.forEach((button) => button.addEventListener('click', () => setPeopleView(button.dataset.peopleView)));
  document.querySelector('#people-reset')?.addEventListener('click', () => {
    if (peopleSearch) peopleSearch.value = '';
    if (peopleRoleFilter) peopleRoleFilter.value = 'all';
    if (peopleAreaFilter) peopleAreaFilter.value = 'all';
    updatePeopleDirectory();
    peopleSearch?.focus();
  });

  document.querySelectorAll('a[href$="#faculty"], a[href$="#junior"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const group = link.hash.slice(1);
      if (peopleRoleFilter) peopleRoleFilter.value = group;
      updatePeopleDirectory();
      event.preventDefault();
      history.pushState(null, '', `#${group}`);
      const target = currentPeopleView === 'cards'
        ? document.querySelector(`#${group}`)
        : document.querySelector('#people');
      target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      closeMenu();
    });
  });
}

const teachingTermOrder = {
  spring: 1,
  summer: 2,
  fall: 3,
  autumn: 3,
  winter: 4,
};

const getTeachingChronology = (row) => {
  const semester = row.querySelector('.teaching-semester strong')?.textContent.trim() || '';
  const year = Number.parseInt(semester.match(/\b\d{4}\b/)?.[0] || '', 10);
  const term = semester.match(/^[A-Za-z]+/)?.[0].toLocaleLowerCase() || '';
  return (Number.isFinite(year) ? year : 0) * 10 + (teachingTermOrder[term] || 0);
};

const getFirstTeachingInstructorSurname = (row) => {
  const instructor = row.querySelector('.teaching-instructors strong')?.textContent
    .trim()
    .replace(/^(?:Prof|Dr)\.?\s+/iu, '') || '';
  const [, ...surnameParts] = instructor.split(/\s+/u);
  return surnameParts.join(' ') || instructor;
};

const getTeachingCourseTitle = (row) => (
  row.querySelector('.teaching-course h3')?.textContent.trim() || ''
);

const teachingList = document.querySelector('.teaching-list');
if (teachingList) {
  const teachingRows = [...teachingList.querySelectorAll(':scope > .teaching-list-row')].map((row) => ({
    row,
    chronology: getTeachingChronology(row),
    instructor: getFirstTeachingInstructorSurname(row),
    course: getTeachingCourseTitle(row),
  }));
  teachingRows.sort((left, right) => {
    const chronologyOrder = right.chronology - left.chronology;
    if (chronologyOrder) return chronologyOrder;

    const instructorOrder = compareEnglish(left.instructor, right.instructor);
    if (instructorOrder) return instructorOrder;

    return compareEnglish(left.course, right.course);
  });
  teachingList.append(...teachingRows.map(({ row }) => row));
}

const researchDirectionOrder = [
  'analysis-pde',
  'bifurcation-theory-pdes',
  'dynamics-geometry',
  'harmonic-analysis',
  'nonlinear-diffusion-image-processing',
  'stochastic-dynamics',
];

const getResearchDirectionId = (link) => {
  const hashIndex = link.getAttribute('href')?.indexOf('#') ?? -1;
  return hashIndex >= 0 ? link.getAttribute('href').slice(hashIndex + 1) : '';
};

document.querySelectorAll('#research-menu, .research-directions .page-side-nav').forEach((navigation) => {
  const links = new Map(
    [...navigation.querySelectorAll('a')]
      .map((link) => [getResearchDirectionId(link), link])
      .filter(([id]) => researchDirectionOrder.includes(id)),
  );
  researchDirectionOrder.forEach((id) => {
    if (links.has(id)) navigation.append(links.get(id));
  });
});

const researchDirectionStack = document.querySelector('.research-direction-stack');
if (researchDirectionStack) {
  researchDirectionOrder.forEach((id) => {
    const section = document.getElementById(id);
    if (section) researchDirectionStack.append(section);
  });
  const activeDirectionId = decodeURIComponent(window.location.hash.slice(1));
  const activeDirection = document.getElementById(activeDirectionId);
  if (activeDirection && researchDirectionOrder.includes(activeDirectionId)) {
    window.addEventListener('load', () => {
      setTimeout(() => activeDirection.scrollIntoView(), 0);
    }, { once: true });
  }
}

const getPublicationDetails = (item) => {
  const authorLine = item.querySelector('strong')?.textContent.trim() || '';
  const firstAuthor = authorLine.split(/\s*(?:&|,)\s*/u)[0] || '';
  return {
    item,
    year: Number.parseInt(item.querySelector(':scope > span')?.textContent || '', 10),
    surname: firstAuthor.split(/\s+/u).filter(Boolean).at(-1) || '',
    firstAuthor,
    authorLine,
    title: item.querySelector('a')?.textContent || '',
  };
};

document.querySelectorAll('.research-publications-panel .publication-list').forEach((list, index) => {
  const publications = [...list.children].map(getPublicationDetails);
  if (!list.closest('#harmonic-analysis')) {
    publications.sort((left, right) => (
      (right.year - left.year)
      || compareEnglish(left.surname, right.surname)
      || compareEnglish(left.firstAuthor, right.firstAuthor)
      || compareEnglish(left.authorLine, right.authorLine)
      || compareEnglish(left.title, right.title)
    ));
    list.append(...publications.map(({ item }) => item));
  }
  if (list.closest('#bifurcation-theory-pdes')) return;

  const archivedItems = publications
    .filter(({ year }) => Number.isFinite(year) && year < 2025)
    .map(({ item }) => item);
  if (!archivedItems.length) return;

  list.id ||= `publication-list-${index + 1}`;
  archivedItems.forEach((item) => { item.hidden = true; });

  const controls = document.createElement('div');
  controls.className = 'publication-toggle-row';
  const button = document.createElement('button');
  button.className = 'publication-toggle';
  button.type = 'button';
  button.innerHTML = '<span class="publication-toggle-label">More</span><span class="publication-toggle-symbol" aria-hidden="true">+</span>';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', list.id);
  button.setAttribute('aria-label', 'Show more publications');
  controls.append(button);
  list.after(controls);

  const label = button.querySelector('.publication-toggle-label');
  const symbol = button.querySelector('.publication-toggle-symbol');

  const setButtonState = (expanded) => {
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Show fewer publications' : 'Show more publications');
    button.classList.toggle('is-expanded', expanded);
    button.classList.remove('is-changing');
    void button.offsetWidth;
    button.classList.add('is-changing');
    label.textContent = expanded ? 'Less' : 'More';
    symbol.textContent = expanded ? '−' : '+';
  };

  button.addEventListener('click', async () => {
    if (button.classList.contains('is-animating')) return;

    const willExpand = button.getAttribute('aria-expanded') !== 'true';
    setButtonState(willExpand);

    if (reduceMotion || typeof archivedItems[0]?.animate !== 'function') {
      archivedItems.forEach((item) => { item.hidden = !willExpand; });
      return;
    }

    button.classList.add('is-animating');
    button.setAttribute('aria-disabled', 'true');

    if (willExpand) archivedItems.forEach((item) => { item.hidden = false; });

    const animations = archivedItems.map((item, itemIndex) => {
      const itemStyle = getComputedStyle(item);
      const height = item.offsetHeight;
      const openFrame = {
        height: `${height}px`,
        paddingTop: itemStyle.paddingTop,
        paddingBottom: itemStyle.paddingBottom,
        borderTopColor: itemStyle.borderTopColor,
        opacity: 1,
        transform: 'translateY(0)',
      };
      const closedFrame = {
        height: '0px',
        paddingTop: '0px',
        paddingBottom: '0px',
        borderTopColor: 'transparent',
        opacity: 0,
        transform: 'translateY(-10px)',
      };
      const staggerIndex = willExpand ? itemIndex : archivedItems.length - itemIndex - 1;
      return item.animate(willExpand ? [closedFrame, openFrame] : [openFrame, closedFrame], {
        duration: willExpand ? 360 : 260,
        delay: Math.min(staggerIndex * 24, 240),
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'both',
      });
    });

    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
    if (!willExpand) archivedItems.forEach((item) => { item.hidden = true; });
    animations.forEach((animation) => animation.cancel());
    button.classList.remove('is-animating');
    button.removeAttribute('aria-disabled');
  });
});

const observedSections = document.body.classList.contains('home-page')
  ? [...document.querySelectorAll('#home')]
  : [];
if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    navLinks.forEach((link) => link.classList.remove('active'));
    const id = visible.target.id;
    if (id === 'people') {
      document.querySelector('[data-dropdown-link][aria-controls="people-menu"]')?.classList.add('active');
    } else if (id === 'activities') {
      document.querySelector('[data-dropdown-link][aria-controls="activities-menu"]')?.classList.add('active');
    } else {
      document.querySelector(`.primary-nav a[href="#${id}"]`)?.classList.add('active');
    }
  }, { rootMargin: '-30% 0px -60%', threshold: [0, 0.2, 0.5] });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelector('[data-back-to-top]')?.addEventListener('click', (event) => {
  event.preventDefault();
  history.replaceState(null, '', '#top');
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});
