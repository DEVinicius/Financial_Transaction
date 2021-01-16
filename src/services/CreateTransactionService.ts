import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  private sendDataToTransactionRepository({
    title,
    value,
    type,
  }: RequestDTO): Transaction {
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    if (type === 'income') {
      return this.sendDataToTransactionRepository({ title, value, type });
    }
    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();
      if (balance.total < value) {
        throw Error('Insuficient Balance');
      }

      return this.sendDataToTransactionRepository({ title, value, type });
    }

    throw Error('Type not Accept');
  }
}

export default CreateTransactionService;
