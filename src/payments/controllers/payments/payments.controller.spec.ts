import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { PaymentsService } from '../../services/payments/payments.service';
import { PaymentsController } from './payments.controller';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let paymentsService: PaymentsService;

  const requestMock = {
    query: {},
  } as unknown as Request;

  const statusResponseMock = {
    send: jest.fn((x) => x),
  };

  const responseMock = {
    status: jest.fn((x) => statusResponseMock),
    send: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            createPayment: jest.fn((x) => x),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should be defined', () => {
    expect(paymentsService).toBeDefined();
  });

  describe('getPayments', () => {
    it('should return a status of 400', () => {
      controller.getPayments(requestMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(statusResponseMock.send).toHaveBeenCalledWith({
        msg: 'Missing count or page query parameter.',
      });
    });

    it('should return a status of 200 when params are present', async () => {
      requestMock.query = { count: '10', page: '1' };
      await controller.getPayments(requestMock, responseMock);
      expect(responseMock.send).toHaveBeenCalledWith(200);
    });
  });

  describe('create', () => {
    it('should throw an error', async () => {
      jest.spyOn(paymentsService, 'createPayment').mockResolvedValue(null);
      try {
        await controller.createPayment({
          email: 'bry@email.com',
          price: 1,
        });
      } catch (error) {
        // Expect that the error is a BadRequestException
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
