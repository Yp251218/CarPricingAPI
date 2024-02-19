import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
// import { BadRequestException } from '@nestjs/common';


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        const users: User[] = [];
         fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 999999),email, password} as User
                users.push(user)
                return Promise.resolve(user);
            }
                
        }

        const module = await Test.createTestingModule({
            //create a fake copy of user service 
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asdf@asdf.com', 'asdf');

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('a@gmail.com', 'a')
        try {
            await service.signup('a@gmail.com', 'a');
            // If the above line doesn't throw an error, the test should fail
            // since it's expected to throw.
            throw new Error('Expected error but did not occur');
        } catch (err) {
            // If an error occurs, the test passes.
            expect(err).toBeDefined();
        }
    });
    
    it('throws if signin is called with an unused email', async () => {
        try {
            await service.signin('asdfgdh@asfsh.com', 'passweub');
            // If the above line doesn't throw an error, the test should fail
            // since it's expected to throw.
            throw new Error('Expected error but did not occur');
        } catch (err) {
            // If an error occurs, the test passes.
            expect(err).toBeDefined();
        }
    });
    

    it('throws if an invalid password is provided', async () => {
       
        await service.signup('lask@asdf.com', 'password')
        try {
            
            await service.signin('lask@asdf.com', 'password');
            // If the above line doesn't throw an error, the test should fail
            // since it's expected to throw.
            throw new Error('Expected error but did not occur');
        } catch (err) {
            // If an error occurs, the test passes.
            expect(err).toBeDefined();
            
        }
    });
    

    it('return an user if password is provded', async () =>{
       await service.signup('a@gmail.com', 'a')
       

         const user = await service.signin('a@gmail.com', 'a');
         expect(user).toBeDefined();

        
    // expect(user).toBeDefined();
        

    });
})
