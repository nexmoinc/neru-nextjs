import { globalState } from '@/models/state';
import { KEYS_TABLE } from '@/models/constants';

export async function addKey(apiKey: string): Promise<void> {
    await globalState.hset(KEYS_TABLE, {
        [apiKey]: 'true'
    });
}

export async function getKey(apiKey: string): Promise<string> {
    const key = await globalState.hget(KEYS_TABLE, apiKey);
    return key;
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