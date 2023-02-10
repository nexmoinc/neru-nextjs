import { KEYS_TABLE } from '@/models/constants';
import { globalState } from '@/models/state';

export async function setQuota(apiKey: string, date: string, quota: number): Promise<void> {
    await globalState.hset(KEYS_TABLE, {
        [`${apiKey}.${date}.quota`]: JSON.stringify(quota),
    });
}

export async function getQuota(apiKey: string, date: string): Promise<number> {
    const quota = await globalState.hget(KEYS_TABLE, `${apiKey}.${date}.quota`);
    return JSON.parse(quota);
}

export async function incrementQuota(apiKey: string, date: string): Promise<void> {
    await globalState.hincrby(KEYS_TABLE, `${apiKey}.${date}.used`, 1);
}

export async function hasQuota(apiKey: string, date: string): Promise<boolean> {
    console.log('today', date)

    const result = await globalState.hmget(KEYS_TABLE, [`${apiKey}.${date}.quota`, `${apiKey}.${date}.used`]);
    const quota = result[0] ? JSON.parse(result[0]) : 0;
    const used = result[1] ? JSON.parse(result[1]) : 0;

    return used < quota;
}