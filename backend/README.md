# **Preliminary Assignment for Backend Internship**

A Node.js + Typescript backend application for Wolt 2025 Backend Engineering Internship implementing Delivery Order Price Calculator (DOPC) service. Read more about the requirements of the service [here](https://github.com/woltapp/backend-internship-2025).

## **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [API Endpoints](#api-endpoints)
4. [Environment Variables](#environment-variables)
5. [Building and Running with Docker](#building-and-running-with-docker)
6. [Packages Highlight](packages-highlight)

## **Prerequisites**

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

Or

- [Docker](https://www.docker.com/) (for Dockerized setup)

## **Getting Started**

For Docker setup, jump [here](#building-and-running-with-docker).

1. Install Dependencies:

```
cd backend
npm install
```

2. Build:

```
npm run tsc
```

3. Run the project:

```
npm start
```

Navigate to `http://localhost:3000`. More details on how to use the service are available in the next section.

The project uses [jest](https://jestjs.io/) for testing. Run the tests by executing:

```
npm test
```

Linting ensures that the code adheres to a consistent style and helps catch potential bugs. The project uses [ESLint](https://eslint.org/) for linting. To check for linting, use the following:

```
npm run lint
```

The project can be excuted in development mode by using the following:

```
npm run dev
```

## **API Endpoints**

Following endpoints are provided by the application.

| Method | Endpoint                       | Description                                        |
| ------ | ------------------------------ | -------------------------------------------------- |
| GET    | `/`                            | Greeting endpoint and healthcheck for application. |
| GET    | `/api/v1/delivery-order-price` | DOPC endpoint (specification below)                |
|        |                                |                                                    |

### Specification

<details>
<summary>Click to expand specification for DOPC endpoint. </summary>

**GET** `/api/v1/delivery-order-price` takes four **required** query parameters:

- `venue_slug` (string): The unique identifier (slug) for the venue from which the delivery order will be placed
- `cart_value`: (integer): The total value of the items in the shopping cart
- `user_lat` (number with decimal point): The latitude of the user's location
- `user_lon` (number with decimal point): The longitude of the user's location

An example url can be as follows:

```
http://localhost:3000/api/v1/delivery-order-price?venue_slug=home-assignment-venue-helsinki&cart_value=1000&user_lat=60.17094&user_lon=24.93087
```

The endpoint responds with JSON in the following format:

```json
{
  "total_price": 1190,
  "small_order_surcharge": 0,
  "cart_value": 1000,
  "delivery": {
    "fee": 190,
    "distance": 177
  }
}
```

where

- `total_price` (integer): The calculated total price
- `small_order_surcharge` (integer): The calculated small order surcharge
- `cart_value` (integer): The cart value. This is the same as what was got as query parameter.
- `delivery` (object): An object containing:
  - `fee` (integer): The calculated delivery fee
  - `distance` (integer): The calculated delivery distance in meters

The endpoint responds with an appropriate error message if calculation is not possible.

A few sample venue url slugs are as follows:

- home-assignment-venue-helsinki
- home-assignment-venue-stockholm
- home-assignment-venue-berlin
- home-assignment-venue-tokyo

_The DOPC api endpoint can be renamed by the changing it in the `.env` file using format `/api/v#/<endpoint-slug-here>`_.

</details>

### Request

A request can be sent to the endpoint by navigating to the application url using the browser. The `.rest` file in `requests/*.rest` can also be used to send request to the application.

## **Environment Variables**

The project uses the following environment variables mentioned in the `.env` file at the root of the folder structure:

| Variable               | Value                                                                            | Description                   |
| ---------------------- | -------------------------------------------------------------------------------- | ----------------------------- |
| `PORT`                 | `3000`                                                                           | Server port                   |
| `DELIVERY_PRICE_ROUTE` | `/api/v1/delivery-order-price`                                                   | API endpoint to assign DOPC   |
| `VENUE_SERVICE_URL`    | `https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues` | _Home Assignment API_ address |

The environment variables fallback to default values without error if failed to validate.

## **Building and Running with Docker**

### Getting Started

Build the image:

```
$ docker build --build-arg PORT=<PORT> . -t wolt-backend
```

Run a container using the image:

```
$ docker run -p 3000:<PORT> --env-file ./.env wolt-backend
```

Replace `<PORT>` with PORT number in the `.env` file. `wolt-backend` is the image name. Navigate to `http://localhost:3000`.

### Development and Testing

To run the project in development mode, use the following:

```
$ docker build --target dev --build-arg PORT=<PORT> . -t wolt-backend:dev
$ docker run -p 3000:<PORT> --env-file ./.env wolt-backend:dev
```

To run tests inside the container, use the following:

```
$ docker build --target test . -t wolt-backend:test
$ docker run --rm wolt-backend:test
```

## **Packages Highlight**

The table hightlights the packages used in the project:

| Package              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| axios                | Promise-based HTTP client for the browser and Node.js        |
| cors                 | Middleware for enabling CORS (Cross-Origin Resource Sharing) |
| cross-env            | Cross-platform way to set environment variables              |
| dotenv               | Loads environment variables from a `.env` file               |
| express              | Web framework for Node.js                                    |
| express-async-errors | Adds support for handling async errors in Express            |
| morgan               | HTTP request logger middleware for Node.js                   |
| zod                  | TypeScript-first schema validation library                   |
| zod-validation-error | Human-friendly error formatting for Zod validation errors    |
| jest                 | Testing framework                                            |
| supertest            | HTTP assertion library for testing                           |
