export function issuesHasErrored(state = false, action) {
  switch (action.type) {
    case "ISSUES_HAS_ERRORED":
      return action.hasErrored;

    default:
      return state;
  }
}

export function issuesIsLoading(state = false, action) {
  switch (action.type) {
    case "ISSUES_IS_LOADING":
      return action.isLoading;

    default:
      return state;
  }
}

export function issues(state = [], action) {
  switch (action.type) {
    case "ISSUES_GET_SUCCESS":
      return action.issues;

    case "ISSUES_DELETE_SUCCESS":
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];
    case "ISSUES_POST_SUCCESS":
      return [
        ...state,
        action.issue
      ];
    case "ISSUES_PUT_SUCCESS":
    const index = state.findIndex(issue => issue._id === action.issue._id);
      return [
        ...state.slice(0, index),
        action.issue,
        ...state.slice(index + 1)
      ];
    default:
      return state;
  }
}

