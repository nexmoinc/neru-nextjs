import { neru } from 'neru-alpha';

export async function getURL(): Promise<string> {
    return Promise.resolve(neru.getAppUrl())
}