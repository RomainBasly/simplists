import 'reflect-metadata';

import { MetadataKeys} from './enums';

export function bodyValidator(...keys: string[]) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(MetadataKeys.VALIDATOR, keys, target, key);
    }
}