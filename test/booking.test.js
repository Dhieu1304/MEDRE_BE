const {createNewBooking, createNewBookingForStaff, updateBooking, updateBookingDoctor, cancelBooking} = require('../src/booking/booking.service');
const sequelize = require('../src/config/database');

beforeAll(done => {
    done();
});
  
afterAll(done => {
    sequelize.close();
    done();
});

describe("Booking feature testing:", () => {
    let id;
    test('Create new booking (Valid).', async () => {
        const data = {
            id_schedule: "f3ff0347-ff8d-4120-a8f9-67f0e9047758",
            id_time: "4e210241-9d4a-4288-92de-1d09e61e0924",
            date: "2023-06-23",
            reason: "Đau đầu",
            id_patient: "1ac77a4a-bf58-46ea-bf95-799962544823",
            id_user: "a6819437-95a5-4492-b682-cb13916d00ee",
        }
        const response = await createNewBooking(data);
        await response.save();
        id = response.id;
        expect(response).toMatchObject(data);

    });

    test('Create new booking (Invalid).', async () => {
        const data = {
            id_schedule: "f3ff0347-ff8d-4120-a8f9-67f0e9047758",
            id_time: "3c4ef237-2ed3-4040-9bc2-45fa03d6a63d",
            date: "2023-06-23",
            reason: "Đau đầu",
            id_patient: "1ac77a4a-bf58-46ea-bf95-799962544823",
            id_user: "a6819437-95a5-4492-b682-cb13916d00ee",
        }
        const response = await createNewBooking(data);
        await response.save();
        data.date= "2023-06-20";
        expect(response).not.toMatchObject(data);

    });

    test('Create new booking for staff (Valid).', async () => {
        const data = {
            id_schedule: "f3ff0347-ff8d-4120-a8f9-67f0e9047758",
            id_time: "3c4ef237-2ed3-4040-9bc2-45fa03d6a63d",
            date: "2023-06-25",
            reason: "Đau đầu",
            id_patient: "1ac77a4a-bf58-46ea-bf95-799962544823",
            id_staff_booking: "a12bc102-bab0-409e-9290-28320bea22ee",
            id_user: "a6819437-95a5-4492-b682-cb13916d00ee",
            booking_status: "Booked",
            bookedAt: new Date(),
        }
        const response = await createNewBookingForStaff(data);
        await response.save();
        expect(response).toMatchObject(data);

    });

    test('Create new booking for staff (Invalid).', async () => {
        const data = {
            id_schedule: "f3ff0347-ff8d-4120-a8f9-67f0e9047758",
            id_time: "4e210241-9d4a-4288-92de-1d09e61e0924",
            date: "2023-06-25",
            reason: "Đau đầu",
            id_patient: "1ac77a4a-bf58-46ea-bf95-799962544823",
            id_staff_booking: "a12bc102-bab0-409e-9290-28320bea22ee",
            id_user: "a6819437-95a5-4492-b682-cb13916d00ee",
            booking_status: "Booked",
            bookedAt: new Date(),
        }
        const response = await createNewBookingForStaff(data);
        await response.save();
        data.booking_status = "Canceled";
        expect(response).not.toMatchObject(data);

    });

    test('Update booking (Valid).', async () => {
        const data = {
            id: id,
            code: "ggwp",
            reason: "Gặp vấn đề về tâm lý",
            id_staff_update: "a12bc102-bab0-409e-9290-28320bea22ee",
        }
        const response = await updateBooking(data);
        await response.save();
        expect(response).toMatchObject(data);
    });

    test('Update booking (Invalid).', async () => {
        const data = {
            id: id,
            code: "ggwp",
            reason: "Gặp vấn đề về tâm lý",
            id_staff_update: "a12bc102-bab0-409e-9290-28320bea22ee",
        }
        const response = await updateBooking(data);
        await response.save();
        data.code= "eee";
        expect(response).not.toMatchObject(data);
    });

    test('Update booking by doctor (Valid).', async () => {
        const data = {
            id: id,
            note: "Tái khám vào 1 tháng sau.",
            conclusion: "ADHD",
        }
        const response = await updateBooking(data);
        await response.save();
        expect(response).toMatchObject(data);
    });

    test('Update booking by doctor (Invalid).', async () => {
        const data = {
            id: id,
            note: "Tái khám vào 1 tháng sau.",
            conclusion: "ADHD",
        }
        const response = await updateBooking(data);
        await response.save();
        data.id = "a12bc102-bab0-409e-9290-28320bea22ee"
        expect(response).not.toMatchObject(data);
    });

    test('Cancel booking (Valid).', async () => {
        const data = {
            id_user: "a6819437-95a5-4492-b682-cb13916d00ee",
            id : id,
        }
        const response = await updateBooking(data);
        await response.save();
        expect(response).toMatchObject(data);
    });

    test('Cancel booking (Invalid).', async () => {
        const data = {
            id_user: "a6819437-95a5-4492-b682-cb13916d00ee",
            id : id,
        }
        const response = await updateBooking(data);
        await response.save();
        data.id = "a12bc122-bab0-409e-9290-28320bea22ee"
        expect(response).not.toMatchObject(data);
    });
});
