import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import {
  initializeVideoFilters,
  applyFiltersFromURL,
  updateURLFromFilters,
} from '../../src/js/videography.js';

/**
 * Build a DOM structure mirroring the videography page filter UI and gallery.
 * Two type sections (film, demoreel) each containing items tagged by project.
 */
function setupDOM() {
  document.body.innerHTML = `
    <div class="video-filters-container">
      <div class="filter-section">
        <button type="button" class="filter-section-header" aria-expanded="false" aria-controls="filter-content">
          <span class="filter-section-title">Filter Videos</span>
        </button>
        <div id="filter-content" class="filter-content" aria-hidden="true">
          <div class="video-filters" role="group" aria-label="Filter videos by type">
            <button type="button" class="video-filter-btn" data-type="film" aria-pressed="false"><span>Films</span></button>
            <button type="button" class="video-filter-btn" data-type="demoreel" aria-pressed="false"><span>Demo Reels</span></button>
          </div>
          <div class="video-filters" role="group" aria-label="Filter videos by project">
            <button type="button" class="video-filter-btn" data-filter="project" data-value="Quazar" aria-pressed="false"><span>Quazar</span></button>
            <button type="button" class="video-filter-btn" data-filter="project" data-value="ALifeExp" aria-pressed="false"><span>ALifeExp</span></button>
          </div>
          <button type="button" class="clear-filters-btn" aria-label="Clear all filters"><span>Clear Filters</span></button>
        </div>
      </div>
    </div>

    <div class="videography-container">
      <div class="video-type-section" data-type="film" data-project="Quazar">
        <div class="video-grid">
          <div class="video-item" data-project="Quazar" data-video-id="a1"></div>
          <div class="video-item" data-project="Quazar" data-video-id="a2"></div>
        </div>
      </div>
      <div class="video-type-section" data-type="demoreel" data-project="Quazar ALifeExp">
        <div class="video-grid">
          <div class="video-item" data-project="Quazar" data-video-id="b1"></div>
          <div class="video-item" data-project="ALifeExp" data-video-id="b2"></div>
        </div>
      </div>
    </div>
  `;
}

const byType = (type) => document.querySelector(`.video-filter-btn[data-type="${type}"]`);
const byProject = (value) => document.querySelector(`.video-filter-btn[data-value="${value}"]`);
const sectionByType = (type) => document.querySelector(`.video-type-section[data-type="${type}"]`);

beforeEach(() => {
  // Reset to a clean URL with no query string before each test
  window.history.replaceState(null, '', '/videography');
  setupDOM();
});

describe('Videography filters: writing to the URL', () => {
  beforeEach(() => {
    initializeVideoFilters();
  });

  it('adds a single type filter to the URL when a type button is clicked', () => {
    fireEvent.click(byType('film'));

    const params = new URLSearchParams(window.location.search);
    expect(params.getAll('type')).toEqual(['film']);
    expect(params.getAll('project')).toEqual([]);
    expect(byType('film').getAttribute('aria-pressed')).toBe('true');
    expect(byType('film').classList.contains('active')).toBe(true);
  });

  it('adds a single project filter to the URL when a project button is clicked', () => {
    fireEvent.click(byProject('Quazar'));

    const params = new URLSearchParams(window.location.search);
    expect(params.getAll('project')).toEqual(['Quazar']);
    expect(params.getAll('type')).toEqual([]);
  });

  it('records multiple filters across both categories in the URL', () => {
    fireEvent.click(byType('film'));
    fireEvent.click(byType('demoreel'));
    fireEvent.click(byProject('Quazar'));

    const params = new URLSearchParams(window.location.search);
    expect(params.getAll('type')).toEqual(['film', 'demoreel']);
    expect(params.getAll('project')).toEqual(['Quazar']);
  });

  it('removes a filter from the URL when its button is toggled off', () => {
    fireEvent.click(byType('film'));
    fireEvent.click(byProject('Quazar'));
    // Toggle film back off
    fireEvent.click(byType('film'));

    const params = new URLSearchParams(window.location.search);
    expect(params.getAll('type')).toEqual([]);
    expect(params.getAll('project')).toEqual(['Quazar']);
  });

  it('clears the query string when the last filter is toggled off', () => {
    fireEvent.click(byType('film'));
    fireEvent.click(byType('film'));

    expect(window.location.search).toBe('');
  });

  it('clears all filter params when Clear Filters is clicked', () => {
    fireEvent.click(byType('film'));
    fireEvent.click(byProject('Quazar'));

    fireEvent.click(document.querySelector('.clear-filters-btn'));

    expect(window.location.search).toBe('');
    expect(byType('film').getAttribute('aria-pressed')).toBe('false');
    expect(byProject('Quazar').getAttribute('aria-pressed')).toBe('false');
    expect(byType('film').classList.contains('active')).toBe(false);
  });

  it('updates the URL without navigating away from the page', () => {
    const originalPathname = window.location.pathname;
    fireEvent.click(byType('film'));
    expect(window.location.pathname).toBe(originalPathname);
  });
});

describe('Videography filters: restoring from the URL', () => {
  it('applies a type and a project filter from the URL on initialization', () => {
    window.history.replaceState(null, '', '/videography?type=film&project=Quazar');
    initializeVideoFilters();

    expect(byType('film').getAttribute('aria-pressed')).toBe('true');
    expect(byProject('Quazar').getAttribute('aria-pressed')).toBe('true');
    expect(byType('demoreel').getAttribute('aria-pressed')).toBe('false');

    // Type filter keeps only the film section visible
    expect(sectionByType('film').style.display).toBe('');
    expect(sectionByType('demoreel').style.display).toBe('none');

    // Project filter hides items that are not part of Quazar
    expect(document.querySelector('[data-video-id="b2"]').style.display).toBe('none');
    expect(document.querySelector('[data-video-id="a1"]').style.display).toBe('');
  });

  it('restores multiple type filters from repeated URL parameters', () => {
    window.history.replaceState(null, '', '/videography?type=film&type=demoreel');
    initializeVideoFilters();

    expect(byType('film').getAttribute('aria-pressed')).toBe('true');
    expect(byType('demoreel').getAttribute('aria-pressed')).toBe('true');
    expect(sectionByType('film').style.display).toBe('');
    expect(sectionByType('demoreel').style.display).toBe('');
  });

  it('expands the filter panel when filters are restored from the URL', () => {
    window.history.replaceState(null, '', '/videography?type=film');
    initializeVideoFilters();

    expect(document.querySelector('.filter-section-header').getAttribute('aria-expanded')).toBe(
      'true'
    );
    expect(document.getElementById('filter-content').getAttribute('aria-hidden')).toBe('false');
  });

  it('keeps the filter panel collapsed when there are no filters in the URL', () => {
    initializeVideoFilters();

    expect(document.querySelector('.filter-section-header').getAttribute('aria-expanded')).toBe(
      'false'
    );
    expect(document.getElementById('filter-content').getAttribute('aria-hidden')).toBe('true');
  });

  it('matches URL parameters case-insensitively', () => {
    window.history.replaceState(null, '', '/videography?project=quazar&type=FILM');
    initializeVideoFilters();

    expect(byProject('Quazar').getAttribute('aria-pressed')).toBe('true');
    expect(byType('film').getAttribute('aria-pressed')).toBe('true');
  });

  it('supports the legacy single project parameter', () => {
    window.history.replaceState(null, '', '/videography?project=ALifeExp');
    initializeVideoFilters();

    expect(byProject('ALifeExp').getAttribute('aria-pressed')).toBe('true');
  });

  it('ignores unknown filter values in the URL', () => {
    window.history.replaceState(null, '', '/videography?type=nonsense&project=unknown');
    initializeVideoFilters();

    expect(byType('film').getAttribute('aria-pressed')).toBe('false');
    expect(byProject('Quazar').getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelector('.filter-section-header').getAttribute('aria-expanded')).toBe(
      'false'
    );
  });
});

describe('Videography filters: round trip and helpers', () => {
  it('produces a URL that restores the same selection (round trip)', () => {
    initializeVideoFilters();
    fireEvent.click(byType('film'));
    fireEvent.click(byProject('Quazar'));

    const shareableSearch = window.location.search;

    // Simulate opening the shared URL in a fresh page
    setupDOM();
    window.history.replaceState(null, '', `/videography${shareableSearch}`);
    initializeVideoFilters();

    expect(byType('film').getAttribute('aria-pressed')).toBe('true');
    expect(byProject('Quazar').getAttribute('aria-pressed')).toBe('true');
  });

  it('updateURLFromFilters writes the provided sets and clears when empty', () => {
    updateURLFromFilters(new Set(['film', 'demoreel']), new Set(['Quazar']));
    let params = new URLSearchParams(window.location.search);
    expect(params.getAll('type')).toEqual(['film', 'demoreel']);
    expect(params.getAll('project')).toEqual(['Quazar']);

    updateURLFromFilters(new Set(), new Set());
    expect(window.location.search).toBe('');
  });

  it('applyFiltersFromURL populates the provided sets', () => {
    window.history.replaceState(null, '', '/videography?type=demoreel&project=Quazar');
    const activeTypeFilters = new Set();
    const activeProjectFilters = new Set();

    applyFiltersFromURL(
      activeTypeFilters,
      activeProjectFilters,
      document.querySelectorAll('.video-filter-btn')
    );

    expect([...activeTypeFilters]).toEqual(['demoreel']);
    expect([...activeProjectFilters]).toEqual(['Quazar']);
  });
});
