import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../../dto/CreatePayment.dto';

@Injectable()
export class PaymentsService {
  private users = [
    {
      email: 'johndoe@email.com',
    },
    {
      email: 'styuy@email.com',
    },
    {
      email: 'aastadu@email.com',
    },
  ];

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const { email } = createPaymentDto;
    const user = this.users.find((user) => user.email === email);

    if (user) {
      return {
        id: 1,
        status: 'success',
      };
    } else {
      throw new BadRequestException();
    }
  }
}
