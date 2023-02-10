import { globalState } from '@/models/state';
import { KEYS_TABLE } from '@/models/constants';

    export async function addKey(apiKey: string, today: string): Promise<void> {
        await globalState.hset(KEYS_TABLE, {
            [`${apiKey}.${today}.quota`]: "0",
            [`${apiKey}.${today}.used`]: "0",
        });
}

export async function keyExists(apiKey: string): Promise<boolean> {
    async function scan(cursor: string, pattern: string, count: number): Promise<[string, string[]]> {
        return await globalState.hscan(KEYS_TABLE, cursor, pattern, count);
    }

    let cursor = '0';

    do {
        const [newCursor, keys] = await scan(cursor, `${apiKey}*`, 1);
        if (keys.length > 0) {
            return true;
        }
        cursor = newCursor;
    } while (cursor !== '0');

    return false;
}

export async function removeKey(apiKey: string): Promise<void> {
    await globalState.hdel(KEYS_TABLE, apiKey);
}

export async function getKeys(): Promise<any> {
    const keys = await globalState.hgetall(KEYS_TABLE);
    const filteredKeys: { [key: string]: string } = Object.entries(keys)
        .filter(([key, value]) => key.includes(".quota") || key.includes(".used"))
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as any);


    const result = [];

    const apiKeyStats: any = {};

    for (const key in filteredKeys) {
        const [apiKey, date, quotaType] = key.split('.');
        if (!apiKeyStats[apiKey]) {
            apiKeyStats[apiKey] = {};
        }
        if (!apiKeyStats[apiKey][date]) {
            apiKeyStats[apiKey][date] = { date };
        }
        apiKeyStats[apiKey][date][quotaType] = parseInt(filteredKeys[key], 10);
    }

    for (const apiKey in apiKeyStats) {
        result.push({
            api_key: apiKey,
            stats: Object.values(apiKeyStats[apiKey]),
        });
    }

    return result;
}