import en from '../../messages/en.json';
import id from '../../messages/id.json';

const messages = { en, id };

export function getContent(locale = 'id') {
  return messages[locale] || messages.id;
}

export const person = getContent().person;
export const social = getContent().social;
export const newsletter = getContent().newsletter;
export const home = getContent().home;
export const about = getContent().about;
export const blog = getContent().blog;
export const work = getContent().work;
export const gallery = getContent().gallery;
