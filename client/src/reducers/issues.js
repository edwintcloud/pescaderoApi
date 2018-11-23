export function issuesHasErrored(state = false, action) {
  switch (action.type) {
      case 'ISSUES_HAS_ERRORED':
          return action.hasErrored;

      default:
          return state;
  }
}

export function issuesIsLoading(state = false, action) {
  switch (action.type) {
      case 'ISSUES_IS_LOADING':
          return action.isLoading;

      default:
          return state;
  }
}

export function issues(state = [], action) {
  switch (action.type) {
      case 'ISSUES_FETCH_DATA_SUCCESS':
          return action.issues;

      case 'ISSUES_REMOVE_ITEM':
          return [
              ...state.slice(0, action.index),
              ...state.slice(action.index + 1)
          ];

      default:
          return state;
  }
}