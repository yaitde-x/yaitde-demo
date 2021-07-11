import { ModelIdentity } from "../domain/models";

export interface EnvKeyValue {
    key: string;
    value: any;
}

export interface Environment extends ModelIdentity {
    id: string;
    name: string;
    category: string;
    group: string;
    items: EnvKeyValue[];
}

export interface RuntimeContext {
    environments: string[];
}

// const runtimeContext = {
//     environments: [
//         "ERP_Dev",
//         "Azure_Dev_2"
//     ]
// }