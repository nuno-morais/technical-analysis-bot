import { EntityRepository, MongoRepository } from 'typeorm';
import { Notification } from '../entities/notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends MongoRepository<Notification> {}
