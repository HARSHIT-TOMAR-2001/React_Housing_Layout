import { customAlphabet } from 'nanoid';

export function getRandomNumber(limit) {
	const nanoid = customAlphabet('1234567890', limit ?? 5);
	return nanoid();
}