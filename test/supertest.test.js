import chai from "chai";
import supertest from 'supertest';

const expect = chai.expect;

const requester = supertest('http://localhost:8080')

describe("Testing Ecommerce", () => {

    // PRODUCT TESTING
    describe("Testing Products Api", () => {

        // Test 01
        it("Crear Producto: El API POST /api/productspost debe crear un producto correctamente", async () => {
            // Given
            const productMock = {
                title: "Harina",
                description: "0000 1KG",
                price: 200,
                status:true,
                thumbnail: [],
                code:'ASW21',
                stock:100
            }


            // Then
            const { statusCode, _body } = await requester.post('/api/productspost').send(productMock)
            // console.log(result);


            // Assert
            expect(statusCode).is.eqls(200)
            expect(_body.payload).is.ok.and.to.have.property("_id")
            expect(_body.payload).to.have.property(stock)

        })


        // Test 02
        it("Buscar producto por ID: El API GET /api/products/:pid debe retornar un producto determinado por ID", async () => {

            // Given
            const productID = '64ecef5ffa802dfa58b92d31';


            // Then
            const { statusCode, _body } = await requester.get('/api/products/${productID}')


            // Assert
            expect(statusCode).is.eqls(200)
            expect(_body.payload).to.have.property(stock)
            expect(_body.payload.title).to.be.ok.and.eql(productID)
        })


        // Test 03
        it("Crear producto con stock 0, debe devolver un error 400", async () => {
             // Given
            const productMock = {
                title: "Harina",
                description: "0000 1KG",
                price: 200,
                status:true,
                thumbnail: [],
                code:'ASW21',
                stock:0
            }


            // Then
            const { statusCode, _body } = await requester.post('/api/productspost').send(productMock)
            // console.log(result);


            // Assert
            expect(statusCode).is.eqls(400)
        });
    })
    // CARTS TESTING
    describe("Testing Carts Api", () => {

        // Test 01
        it("Crear Cart: El API POST /api/cartpost debe crear un cart con los id's de los productos y la cantidad si se desea", async () => {
            // Given
            const cartMock = {
                products: [{
                    productId: '64ecef5ffa802dfa58b92d33',
                    quantity: 2
                }

                ]
            }


            // Then
            const { statusCode, _body } = await requester.post('/api/cartpost').send(cartMock)
            // console.log(result);


            // Assert
            expect(statusCode).is.eqls(200)
            expect(_body.payload).is.ok.and.to.have.property("_id")

        })


        // Test 02
        it("Traer todos los carritos: El API GET /api/cart/ debe retornar todos los carts de mi app", async () => {

            // Then
            const { statusCode, _body } = await requester.get('/api/cart/')
            console.log(_body.payload);

            // Assert
            expect(statusCode).is.eqls(200)
            // expect(_body.payload.title).to.be.ok.and.eql(productID)
        })


        // Test 03
        it("Crear mascota con Avatar (Test con uploads): Debe poder crearse una mascota con la ruta de la imagen.", async () => {
             // Given
            const productMock = {
                title: "Harina",
                description: "0000 1KG",
                price: 200,
                status:true,
                thumbnail: [],
                code:'ASW21',
                stock:0
            }


            // Then
            const { statusCode, _body } = await requester.post('/api/productspost').send(productMock)
            // console.log(result);


            // Assert
            expect(statusCode).is.eqls(400)
        });
    })




        describe("Testing Login and session with Cookies", () => {

        // Before
        before(function () {
            this.cookie;
            this.mockUser = {
                first_name: "Usuario de prueba 1",
                last_name: "Apellido de prueba 1",
                email: "correodeprueba1@gmail.com",
                age: 18,
                password: "123456"
            }
        })


        // Test 01 - registro user
        it("Test Registro Usuario: Debe poder registrar correctamente un usuario", async function () {

            // Given
            // console.log(this.mockUser);


            // Then
            const { statusCode, _body } = await requester.post('/register').send(this.mockUser);


            // Assert
            expect(statusCode).is.eqls(200)
        })



        // Test 02 - Login user
        it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {


            // Given
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password,
            }

            // Then
            const result = await requester.post('/login').send(mockLogin);
            // console.log(result); // result.headers['set-cookie'][0]
            const cookieResult = result.headers['set-cookie'][0]
            console.log(cookieResult);



            // Assert
            // expect(result.statusCode).is.equal(200)

            // extraer cookie
            const cookieData = cookieResult.split("=")
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            }

            expect(this.cookie.name).to.be.ok.and.eql('coderCookie')
            expect(this.cookie).to.be.ok
            
        })




        // Test 03 - ruta protegida
        it("Test Ruta Protegida: Debe enviar la cookie que contiene el usuario y destructurarla correctamente.", async function () {

            // Given


            // Then
            const { _body } = await requester.get("/private").set('Cookie', [`${this.cookie.name}=${this.cookie.value}`]);

            // console.log(_body);




            // Assert
            expect(_body.payload.email).to.be.ok.and.eql(this.mockUser.email)

        })


    })




})