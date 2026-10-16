import { RefugioDB, type Preference } from '../storage/repository';
const db = new RefugioDB();
export async function readPreference(key: Preference['key']) {
  try {
    return (await db.preferences.get(key))?.value;
  } catch {
    return undefined;
  }
}
export async function writePreference(key: Preference['key'], value: string) {
  await db.preferences.put({ key, value });
}
