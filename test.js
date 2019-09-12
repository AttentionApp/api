const userRepo = require('./server/models/user');

userRepo.save({
    username: 'manuker',
    email: 'shura97@gmail.com',
    password: '12345',
    active: false,
    created_by: 'manuker',
    create_date: new Date(),
    modified_by: null,
    modify_date: null,
    modify_reason: null
}, id => {
    console.log(`Retrieved id: ${id}`);
})