import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { validationResult } from 'express-validator'; // Import validationResult
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    app.use(bodyParser.json())

    // Register express routes from defined application routes
    Routes.forEach(route => {
        // Define a middleware function for route-specific validation
        const routeValidationMiddleware = (req: Request, res: Response, next: Function) => {
            const validation = validationResult(req); // Get validation results
            if (!validation.isEmpty()) {
                // If there are validation errors, send a 400 Bad Request response
                return res.status(400).json({ errors: validation.array() });
            }
            next(); // If no validation errors, proceed to the route handler
        };

        (app as any)[route.method](route.route, [
            // Apply route-specific validation middleware before route handler
            ...(route.validation || []), // Route-specific validation rules
            routeValidationMiddleware, // Validation middleware
            (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            }
        ]);
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000)

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))
