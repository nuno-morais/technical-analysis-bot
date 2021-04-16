import { EntityRepository, MongoRepository } from 'typeorm';
import { Symbol as SymbolTrade } from '../entities/symbol.entity';

@EntityRepository(SymbolTrade)
export class SymbolRepository extends MongoRepository<SymbolTrade> {}
