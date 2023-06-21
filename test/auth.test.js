const {register} = require('../src/auth/auth.controller');
const { responseData, responseMessage } = require('../src/utils/responseFormat');
const userService = require('../src/user/user.service.js');
const staffService = require('../src/staff/staff.service.js');
const {
    loginUserWithEmailAndPassword, 
    loginUserWithPhoneNumberAndPassword,
    staffLoginUserWithEmailAndPassword,
    staffLoginUserWithPhoneNumberAndPassword,
    staffLoginUserWithUsernameAndPassword
} = require('../src/auth/auth.service.js');
const authService = require('../src/auth/auth.service.js');
const sequelize = require('../src/config/database');
const httpStatus = require('http-status');
const i18next = require('i18next');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

beforeAll(done => {
    done();
});
  
afterAll(done => {
    sequelize.close();
    done();
});

describe("Auth feature testing:", () => {
    //---------------USER----------------
    let capturedUser;
    describe("Register:", () => {
        test('With email and phone number.', async () => {
            const req = { body: {
                email: 'testingemail@gmail.com',
                phone_number: '0933332171',
                name: 'Alexander',
                password: 'Ht123123',
            }};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const user = {
                id: uuidv4(),
                email: 'testingemail@gmail.com',
                phone_number: '0933332171',
                name: 'Alexander',
                password: 'Ht123123',
            }
            capturedUser = user;
            userService.createUser = jest.fn().mockResolvedValue(user);
            const sendMailVerificationMock = jest.spyOn(authService, 'sendMailVerification').mockResolvedValue();
            await register(req, res);
            expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
            expect(res.json).toHaveBeenCalledWith(responseData(user, i18next.t('auth.registerSuccess')));
            expect(sendMailVerificationMock).toHaveBeenCalledWith('testingemail@gmail.com', 1);
            expect(userService.createUser).toHaveBeenCalledWith(req.body);
        });
        test('Without email and phone number.', async () => {
            const req = {
                body: {
                    name: 'Alexander',
                    password: 'Ht123123',
                },
            };
        
            const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            };
        
            await register(req, res);
        
            expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
            expect(res.json).toHaveBeenCalledWith(responseMessage(i18next.t('auth.missingInput'), false));
        });
    });
    describe('User login with email and password:', () => {
        test('Have right email and password.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            const result = await loginUserWithEmailAndPassword(req.body.email, req.body.password);

            expect(result).toEqual(user);
            expect(userService.findOneByFilter).toHaveBeenCalledWith({ email: 'testingemail@gmail.com' });
        });
        test('Have right email and password but email not verified.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: false,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have right email and password but user has been blocked.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: true,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 400,
                isOperational: true
            });
        });
        test('Have wrong email and right password.', async () => {
            const req = {
              body: {
                email: 'testinge@gmail.com', 
                password: 'Ht123123',
              },
            };
         
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });

        });
        test('Have right email and wrong password.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123sf',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have wrong email and password.', async () => {
            const req = {
              body: {
                email: 'test@example.com',
                password: 'Ht12ssde',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Missing input.', async () => {
            const req = {
              body: {
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
    });
    describe('User login with phone number and password:', () => {
        test('Have right phone number and password.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526',
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            const result = await loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password);

            expect(result).toEqual(user);
            expect(userService.findOneByFilter).toHaveBeenCalledWith({ phone_number: '0978526526' });
        });
        test('Have right phone number and password but phone number not verified.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: false,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have right phone number and password but user has been blocked.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: true,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 400,
                isOperational: true
            });
        });
        test('Have wrong phone number and right password.', async () => {
            const req = {
              body: {
                phone_number: '0978526625',
                password: 'Ht123123',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Have right phone number and wrong password.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123sf',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(user);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have wrong phone number and password.', async () => {
            const req = {
              body: {
                phone_number: '0978526625',
                password: 'Ht123ddd',
              },
            };
          
            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Missing input.', async () => {
            const req = {
              body: {
              },
            };

            const user = { 
                id: capturedUser.id, 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            userService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(loginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
    });
    //----------------STAFF-----------------
    describe('Staff login with email and password:', () => {
        test('Have right email and password.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            const result = await staffLoginUserWithEmailAndPassword(req.body.email, req.body.password);

            expect(result).toEqual(staff);
            expect(staffService.findOneByFilter).toHaveBeenCalledWith({ email: 'testingemail@gmail.com' });
        });
        test('Have right email and password but email not verified.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: false,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have right email and password but user has been blocked.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: true,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 400,
                isOperational: true
            });
        });
        test('Have wrong email and right password.', async () => {
            const req = {
              body: {
                email: 'testingstaff@gmail.com',
                password: 'Ht123123',
              },
            };
         
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });

        });
        test('Have right email and wrong password.', async () => {
            const req = {
              body: {
                email: 'testingemail@gmail.com',
                password: 'Ht123sf',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have wrong email and password.', async () => {
            const req = {
              body: {
                email: 'test@example.com',
                password: 'Ht12ssde',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Missing input.', async () => {
            const req = {
              body: {
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                email: 'testingemail@gmail.com', 
                email_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithEmailAndPassword(req.body.email, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
    });
    describe('staff login with phone number and password:', () => {
        test('Have right phone number and password.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526',
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            const result = await staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password);

            expect(result).toEqual(staff);
            expect(staffService.findOneByFilter).toHaveBeenCalledWith({ phone_number: '0978526526' });
        });
        test('Have right phone number and password but phone number not verified.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: false,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have right phone number and password but staff has been blocked.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: true,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 400,
                isOperational: true
            });
        });
        test('Have wrong phone number and right password.', async () => {
            const req = {
              body: {
                phone_number: '0978526625',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Have right phone number and wrong password.', async () => {
            const req = {
              body: {
                phone_number: '0978526526',
                password: 'Ht123sf',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have wrong phone number and password.', async () => {
            const req = {
              body: {
                phone_number: '0978526625',
                password: 'Ht123ddd',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Missing input.', async () => {
            const req = {
              body: {
              },
            };

            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                phone_number: '0978526526', 
                phone_verified: true,
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithPhoneNumberAndPassword(req.body.phone_number, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
    });
    describe('staff login with username and password:', () => {
        test('Have right username and password.', async () => {
            const req = {
              body: {
                username: 'admin112',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                username: 'admin112',
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            const result = await staffLoginUserWithUsernameAndPassword(req.body.username, req.body.password);

            expect(result).toEqual(staff);
            expect(staffService.findOneByFilter).toHaveBeenCalledWith({ username: 'admin112' });
        });
        test('Have right username and password but staff has been blocked.', async () => {
            const req = {
              body: {
                username: 'admin112',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                username: 'admin112',
                password: await bcrypt.hash('Ht123123', 10),
                blocked: true,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithUsernameAndPassword(req.body.username, req.body.password)).rejects.toMatchObject({
                statusCode: 400,
                isOperational: true
            });
        });
        test('Have wrong username and right password.', async () => {
            const req = {
              body: {
                username: 'admin11',
                password: 'Ht123123',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                username: 'admin112',
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithUsernameAndPassword(req.body.username, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Have right username and wrong password.', async () => {
            const req = {
              body: {
                username: 'admin112',
                password: 'Ht123sf',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                username: 'admin112',
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(staff);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithUsernameAndPassword(req.body.username, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
        test('Have wrong username and password.', async () => {
            const req = {
              body: {
                username: 'admin11',
                password: 'Ht123ddd',
              },
            };
          
            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                username: 'admin112',
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithUsernameAndPassword(req.body.username, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
              });

        });
        test('Missing input.', async () => {
            const req = {
              body: {
              },
            };

            const staff = { 
                id: uuidv4(), 
                name: 'Alexander', 
                username: 'admin112',
                password: await bcrypt.hash('Ht123123', 10),
                blocked: false,
            };

            staffService.findOneByFilter = jest.fn().mockResolvedValue(null);
            authService.comparePassword = jest.fn().mockImplementation((password, hashedPassword) => password === hashedPassword);

            await expect(staffLoginUserWithUsernameAndPassword(req.body.username, req.body.password)).rejects.toMatchObject({
                statusCode: 401,
                isOperational: true
            });
        });
    });
});