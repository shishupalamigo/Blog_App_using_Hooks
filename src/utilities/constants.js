const ROOT_URL = 'https://mighty-oasis-08080.herokuapp.com/api/';

const ArticlesURL = ROOT_URL + 'articles';
const TagsURL = ROOT_URL + 'tags';

const loginURL = ROOT_URL + 'users/login';
const registerURL = ROOT_URL + 'users';
const UserVerifyURL = ROOT_URL + 'user';

const localStorageKey = "app_user"

export { ROOT_URL, ArticlesURL, TagsURL, loginURL, registerURL, localStorageKey, UserVerifyURL };
