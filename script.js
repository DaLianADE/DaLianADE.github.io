const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const navLinks = [...document.querySelectorAll('.primary-nav .nav-link')];
const dropdowns = [...document.querySelectorAll('[data-dropdown]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopHover = window.matchMedia('(hover: hover) and (min-width: 901px)');

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

document.querySelectorAll('.reveal').forEach((element) => {
  const delay = element.dataset.delay;
  if (delay) element.style.setProperty('--delay', `${delay}ms`);
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -35px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
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

const getText = (element, selector) => element.querySelector(selector)?.textContent.trim() || '';
const peopleAreaLabels = {
  'analysis-pde': {
    label: 'Analysis & PDE',
    search: 'analysis partial differential equations nonlinear pde fluid mechanics',
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
  phd: 'PhD Student',
};
const getAreaLabel = (element) => peopleAreaLabels[element.dataset.area]?.search || '';

const arrangePeopleByCommunity = () => {
  peopleCards.forEach((card) => {
    const targetList = document.querySelector(`#${card.dataset.group} .people-list`);
    targetList?.append(card);
  });
};

const buildPeopleTable = () => {
  if (!peopleTableBody || !peopleCards.length) return;
  const fragment = document.createDocumentFragment();

  peopleRows = peopleCards.map((card) => {
    const row = document.createElement('tr');
    row.dataset.group = card.dataset.group;
    row.dataset.area = card.dataset.area;
    row.dataset.role = card.dataset.role;
    row.dataset.search = `${card.textContent} ${getAreaLabel(card)} ${card.dataset.group}`.toLocaleLowerCase();

    const nameCell = document.createElement('td');
    const name = document.createElement('span');
    name.className = 'table-name';
    const englishName = document.createElement('span');
    englishName.textContent = getText(card, '.person-name-en');
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
  const searchText = (cardOrRow.dataset.search || cardOrRow.textContent).toLocaleLowerCase();
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

  peopleCards.forEach((card) => {
    if (!card.dataset.search) card.dataset.search = `${card.textContent} ${getAreaLabel(card)} ${card.dataset.group}`.toLocaleLowerCase();
    const isMatch = matchesPeopleFilter(card, query, roleFilter, areaFilter);
    card.hidden = !isMatch;
    if (isMatch) visibleCount += 1;
  });

  peopleRows.forEach((row) => {
    row.hidden = !matchesPeopleFilter(row, query, roleFilter, areaFilter);
  });

  peopleGroups.forEach((group) => {
    const hasVisibleCard = [...group.querySelectorAll('[data-person]')].some((card) => !card.hidden);
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
  if (peopleRoleFilter && ['faculty', 'phd'].includes(initialGroup)) peopleRoleFilter.value = initialGroup;
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

  document.querySelectorAll('a[href$="#faculty"], a[href$="#phd"]').forEach((link) => {
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

const observedSections = document.body.classList.contains('home-page')
  ? [...document.querySelectorAll('#home')]
  : [];
if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    document.querySelectorAll('.primary-nav .nav-link').forEach((link) => link.classList.remove('active'));
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
