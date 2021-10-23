import { createRef } from './ref';

export const Nav = {
  goToCreateItem: createRef(),
  goToSetting: createRef()
}

export const FilterStores = {
  tags: createRef([]),
  allTags: createRef([]),
  allTagsSelected: createRef([]),
  performToggleTagFilter: createRef([]),
}