import { Module, Global } from "@nestjs/common";
import { MongoDBClient } from './clients/mongodb.client';
@Global()
@Module({
    imports: [],
    exports: [MongoDBClient],
    providers: [MongoDBClient],
})
export class DatabaseModule { }