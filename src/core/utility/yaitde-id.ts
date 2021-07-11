import { v4 as uuidv4 } from 'uuid';

export const YaitdeId = () => {
    const id : string = uuidv4() as string;
    const newid = id.replace(/-/g, "");
    return newid;
};