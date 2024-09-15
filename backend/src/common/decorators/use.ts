import 'reflect-metadata';
import { MetadataKeys } from './enums';
import { RequestHandler } from 'express';

export function use(middleware: RequestHandler) {
    return function(target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor | void {
        const middlewares = Reflect.getMetadata(MetadataKeys.MIDDLEWARE, target, key) || [];

        Reflect.defineMetadata(MetadataKeys.MIDDLEWARE, [...middlewares, middleware], target, key);
    }

}