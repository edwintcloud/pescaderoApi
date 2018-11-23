export function issuesHasErrored(bool) {
  return {
      type: 'ISSUES_HAS_ERRORED',
      hasErrored: bool
  };
}

export function issuesIsLoading(bool) {
  return {
      type: 'ISSUES_IS_LOADING',
      isLoading: bool
  };
}

export function issuesFetchDataSuccess(issues) {
  return {
      type: 'ISSUES_FETCH_DATA_SUCCESS',
      issues
  };
}

export function getIssues(url) {
  return (dispatch) => {
      dispatch(issuesIsLoading(true));

      fetch(url)
          .then((response) => {
              if (!response.ok) {
                  throw Error(response.statusText);
              }

              dispatch(issuesIsLoading(false));

              return response;
          })
          .then((response) => response.json())
          .then((issues) => dispatch(issuesFetchDataSuccess(issues)))
          .catch(() => dispatch(issuesHasErrored(true)));
  };
}

export function removeIssue(index) {
// TODO
    return {
        type: 'ITEMS_REMOVE_ITEM',
        index
    };
}