import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoDBClient implements OnModuleInit {
    private readonly logger = new Logger(MongoDBClient.name);
    private client: MongoClient;

    async onModuleInit() {
        this.client = new MongoClient(process.env.MONGODB_URI as string ?? 'mongodb://localhost:27017');
        await this.client.connect();
        this.logger.log(`MongoDB client connected to ${this.client}`);
    }

    getClient(): MongoClient {
        return this.client;
    }

    async closeConnection() {
        await this.client.close();
        this.logger.log('MongoDB client connection closed');
    }
}