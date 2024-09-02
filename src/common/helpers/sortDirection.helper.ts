export function sortDirectionHelper(sortDirection: string) {
  let sortDir: 'ASC' | 'DESC';
  if (!sortDirection || sortDirection === 'desc' || sortDirection === 'DESC') {
    sortDir = 'DESC';
  } else {
    sortDir = 'ASC';
  }
  return sortDir;
}
