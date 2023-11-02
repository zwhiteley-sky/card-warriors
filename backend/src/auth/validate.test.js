const { validate_login, validate_register } = require("./validate");

test("/login validations", () => {
    expect(validate_login({})).toBeTruthy();

    // Missing fields
    expect(validate_login({
        password: "secret"
    })).toBeTruthy();
    expect(validate_login({
        email: "zachary@example.com",
    })).toBeTruthy();

    // Invalid Fields
    expect(validate_login({
        email: "zachary",
        password: "secret"
    })).toBeTruthy();
    
    // Valid
    expect(validate_login({
        email: "zachary@example.com",
        password: "secret"
    })).toBeUndefined();
});

test("/register validations", () => {
    expect(validate_register({})).toBeTruthy();

    // Missing fields
    expect(validate_register({
        username: "Hello",
        email: "hello@gmail.com"
    })).toBeTruthy();
    expect(validate_register({
        username: "Hello",
        password: "hello"
    })).toBeTruthy();
    expect(validate_register({
        password: "Hello",
        email: "hello@gmail.com"
    })).toBeTruthy();

    // Types
    expect(validate_register({
        username: 1,
        email: "hello@gmail.com",
        password: "secret"
    })).toBeTruthy();
    expect(validate_register({
        username: "cheese",
        email: [1, 1],
        password: "secret"
    })).toBeTruthy();
    expect(validate_register({
        username: "cheese",
        email: "hello@gmail.com",
        password: { x: 1 }
    })).toBeTruthy();

    // Username format
    expect(validate_register({
        username: "h",
        email: "hello@gmail.com",
        password: "secret"
    })).toBeTruthy();
    expect(validate_register({
        username: "0123456778965432",
        email: "hello@gmail.com",
        password: "secret"
    })).toBeTruthy();
    expect(validate_register({
        username: "*$£^Y\\\\",
        email: "hello@gmail.com",
        password: "secret"
    })).toBeTruthy();

    // Email format
    expect(validate_register({
        username: "Zachary",
        email: "hello",
        password: "secret"
    })).toBeTruthy();


    // Valid test
    expect(validate_register({
        username: "Zachary",
        email: "zachary@example.com",
        password: "secret"
    })).toBeUndefined();
});