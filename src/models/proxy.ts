import { globalState } from '@/models/state';
import { PROXY_DEFAULT_URL, PROXY_URL_KEY } from '@/models/constants';

export async function setProxyURL(url: string): Promise<void> {
    await globalState.set(PROXY_URL_KEY, url)
}

export async function getProxyURL(): Promise<string> {
    return await globalState.get(PROXY_URL_KEY) || PROXY_DEFAULT_URL;
}