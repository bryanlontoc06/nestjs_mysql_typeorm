import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../typeorm/entities/Post';
import { Profile } from '../../../typeorm/entities/Profile';
import { User } from '../../../typeorm/entities/User';
import * as bcryptUtils from '../../../utils/bcrypt';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;
  let postRepository: Repository<Post>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const PROFILE_REPOSITORY_TOKEN = getRepositoryToken(Profile);
  const POST_REPOSITORY_TOKEN = getRepositoryToken(Post);

  console.log(USER_REPOSITORY_TOKEN);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: PROFILE_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    profileRepository = module.get<Repository<Profile>>(
      PROFILE_REPOSITORY_TOKEN,
    );
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should be defined', () => {
    expect(profileRepository).toBeDefined();
  });

  it('should be defined', () => {
    expect(postRepository).toBeDefined();
  });

  describe('createUser', () => {
    jest.spyOn(bcryptUtils, 'encodePassword').mockReturnValue('hashed123');
    it('should encoded password correctly', async () => {
      await service.createUser({
        username: 'bry',
        email: 'bry@example.com',
        password: '123',
      });

      expect(bcryptUtils.encodePassword).toHaveBeenCalledWith('123');
    });
    it('should call user userRepository.create  with correct params', async () => {
      await service.createUser({
        username: 'bry',
        email: 'bry@example.com',
        password: '123',
      });

      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'bry',
        email: 'bry@example.com',
        password: 'hashed123',
      });
      expect(userRepository.create);
    });
    it('should call user userRepository.create  with correct params', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValueOnce({
        id: 1,
        username: 'bry',
        email: 'bry@example.com',
        password: 'hashed123',
      } as any);
      await service.createUser({
        username: 'bry',
        email: 'bry@example.com',
        password: '123',
      });

      expect(userRepository.save).toHaveBeenCalledWith({
        id: 1,
        username: 'bry',
        email: 'bry@example.com',
        password: 'hashed123',
      });
    });
  });
});
