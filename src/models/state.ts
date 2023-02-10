import { neru, State } from 'neru-alpha'

const session = neru.getGlobalSession();
export const globalState = new State(session);